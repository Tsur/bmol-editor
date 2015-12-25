'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    userDB = mongoose.model('User'),
    stockDB = mongoose.model('Stock'),
    ticketsDB = mongoose.model('Ticket'),
    fs = require('fs'),
    util = require('util'),
    moment = require('moment'),
    salesLogger = require('./../../../config/loggers')('sales'),
    settings = require('config');

var _removeTicket = function (id, cb) {

    var id = id || '',
        cb = cb || this.arguments[this.arguments.length-1];

    ticketsDB.remove({_id: id}, function (err) {

        if(err) {

            salesLogger.error('Error _removeTicket method', err);
            return cb(err);
        }

        return cb(false);
    });
}

var _createTicket = function (id, employee, cb) {

    var id = id || '',
        employee = employee || '',
        cb = cb || this.arguments[this.arguments.length-1],
        newTicket = new ticketsDB({employee:employee, employee_id:id});

    newTicket.save(function (err) {

        if(err) {

            salesLogger.error('Error _createTicket method', err);
            return cb(err);
        }

        cb(false, newTicket);
    });
}

var _updateTicket = function (id, item, cb) {

    var id = id || '',
        item = item || {},
        cb = cb || this.arguments[this.arguments.length-1];

    //Mark item with timestamp
    item['ts'] = (new Date()).getTime();

    ticketsDB.update(

        {'_id': id, 'status': settings.get('ticketStatus')['open']}, 

        {'$push': { 'products': item }}, 

        function (err) {

            if (err) {

                salesLogger.error('Error _updateTicket method', err);
                return cb(err);
            }

            stockDB.update(

                {'_id': item['_id'], 'quantity': {'$gte': 0}}, 

                {
                    '$inc': {quantity: (item['qa']-item['quantity'])}, 
                    '$set': {in_carts: {quantity: item['quantity'], id: id, timestamp: item['ts']}}
                }, 

                function (err) {

                    if (err) {

                        salesLogger.error('Error _updateTicket method', err);
                        return cb(err);
                    }

                    cb(false);
                }
            );
        }
    );
}

/**
* It deletes all open tickets restoring its items to the store and creates a new one empty
* This function is called every time the user enters the sales page (/tickets)
*/
exports.newTicket = function (req, res, next) {

    if(req.user && req.user.role == 'employee') {

        var sessTicket = req.body['session'] || '';
        var numQueries = 0;
        var onCreate = function (err, response) {

            if (err) {

                salesLogger.error('Error creating ticket; newTicket method', err);
                return res.send(404);
            }

            salesLogger.debug('Created a new open Ticket and Exiting');
            return res.send(response);
        };
        var onRemove = function (err, len, pos, id) {

            if (err) {

                salesLogger.error('Error removing ticket; newTicket method', err);
                return res.send(404);
            }

            salesLogger.debug('removed ticket with id %s', id);

            if (len == pos) {

                createTicket(req.user._id, req.user.username, onCreate);
            }
        };

        salesLogger.debug('Tickets to keep alive', sessTicket);

        //Get all open tickets
        return ticketsDB.find({status: settings.get('ticketStatus')['open']}, function (err, tickets) {

            if (!err && tickets.length) { 
                
                salesLogger.debug('There are %s tickets open', tickets.length);

                return tickets.forEach(function (ticket, i) {

                    salesLogger.debug('Processing ticket %s ', i, ticket);

                    //If the ticket is on the session, do NOT remove it!!!
                    if (sessTicket.indexOf(ticket['_id'].toString()) != -1) {

                        salesLogger.debug('Ticket is on the session; we do not remove it!');

                        if (i+1 == tickets.length) {

                            createTicket(req.user._id, req.user.username, onCreate);
                        }

                        //go to the next ticket (same as continue; in a loop)
                        return;
                    }

                    for (var j = 0; j < ticket.products.length; j++) {
                        
                        var product = ticket.products[j];

                        salesLogger.debug('item in ticket to be restored', product);

                        numQueries++;

                        stockDB.update(
                        {
                            '_id': product['_id'],
                            'in_carts.id': ticket['_id'].toString(),
                            'in_carts.timestamp': product['ts'],
                            'in_carts.quantity': product['quantity']
                        },
                        {
                            $inc: {quantity: product['quantity']},
                            $set: {in_carts: {quantity:'', id: '', timestamp: ''}}
                        },
                        function (err, result) {

                            if (err && !result) {

                                salesLogger.error('Error restoring product for ticket with id %s', ticket['_id'], product, err);
                                return res.send(404);
                            }

                            salesLogger.debug('item restored!');

                            numQueries--;

                            if (numQueries == 0) {

                                salesLogger.debug('all items restored for ticket with id %s', ticket['_id']);

                                removeTicket(ticket['_id'], function (err) {

                                    onRemove(err, tickets.length, i+1, ticket['_id']);
                                });
                            }
                        });  
                    }

                    //The ticket had no products
                    if (!ticket.products.length) {

                        salesLogger.debug('The ticket had no products(was empty)');

                        removeTicket(ticket['_id'], function (err) {

                            onRemove(err, tickets.length, i+1, ticket['_id']);
                        });
                    }
                });
            }

            salesLogger.debug('There is no open tickets!');

            //Create a new ticket
            createTicket(req.user._id, req.user.username, onCreate);
        });
    }
    else {

        salesLogger.debug('User not authorised in method newTicket');
        res.send(401);
    }
};

exports.updateTicket = function (req, res, next) {

    if (req.user && req.user.role == 'employee') {

        var data = req.body;

        updateTicket(data['_id'], data['product'], function (err){

            if (err) {

                salesLogger.error('Error updateTicket method', err);
                return res.send(404);
            }

            return res.send(true);
        });
    }
    else {

        salesLogger.debug('User not authorised in method updateTicket');
        res.send(401);
    }
};

exports.orderTicket = function (req, res, next) {

    if (req.user && req.user.role == 'employee') {

        var ticket = req.body,
            total = parseFloat(data['overview']['total']).toFixed(2),
            received = parseFloat(data['overview']['received'].replace(',','.')).toFixed(2);

        var ticketReceipt = util.format(settings.get('ticketHeader'), data['overview']['code'], moment().format('DD/MM/YY HH:mm'), req.user.username);

        var total_with_no_discount = 0;

        for (var i=0, l=ticket['products'].length;i<l;i++) {
            
            var desc;

            if (ticket['products'][i]['type'] == 's') {
                //Si se pasa de 25 lo suyo seria hacer una abreviacion
                //desc = (data['products'][i]['description'] > 25) ? data['products'][i]['abbr']:data['products'][i]['description'];
                desc = data['products'][i]['description'];
            }
            else {

                desc = data['products'][i]['reference']+', '+data['products'][i]['description'];
            }

            desc = (desc.length > 21) ? desc.substr(0,17)+'... ':desc+Array(22 - desc.length).join(' ');

            ticketReceipt += ' '+desc+' '+data['products'][i]['quantity']+'x  '+parseFloat(data['products'][i]['price']).toFixed(2)+'E  '+(parseFloat(data['products'][i]['price'])*data['products'][i]['quantity']).toFixed(2)+'E\r\n';

            if (parseFloat(data['products'][i]['discount']) > 0 ) {
                
                var discount;
                
                if (data['products'][i]['discount'].indexOf('%') != -1) {
                    
                    discount = Math.abs((parseFloat(data['products'][i]['discount'])/100)*(parseFloat(data['products'][i]['price'])*data['products'][i]['quantity']));
                    ticketReceipt += '* DESC. '+data['products'][i]['discount']+'                        -'+discount.toFixed(2)+'E\r\n';
                }
                else {

                    discount = parseFloat(data['products'][i]['discount'])
                    ticketReceipt += '* DESC.                            -'+discount.toFixed(2)+'E\r\n';
                }

                total_with_no_discount +=  ((parseFloat(data['products'][i]['price'])*data['products'][i]['quantity']))-discount;
            }
            else {

                total_with_no_discount +=  ((parseFloat(data['products'][i]['price'])*data['products'][i]['quantity']));
            }
        }

        // ticketReceipt += '------------------------------------------\r\n                          TOTAL:   '+total+'E\r\n';
        ticketReceipt += '------------------------------------------\r\n                          TOTAL:   '+total_with_no_discount.toFixed(2)+'E\r\n';

        if  (data['overview']['total_discount']) {

            // ticketReceipt += ' CON DESCUENTO DEL '+( parseInt(data['overview']['discount']) <= 9 ? ' '+data['overview']['discount']:data['overview']['discount'] )+'%,   TOTAL:   '+data['overview']['total_discount']+'E\r\n';
            ticketReceipt += ' CON DESCUENTO DEL '+( parseInt(data['overview']['discount']) <= 9 ? ' '+data['overview']['discount']:data['overview']['discount'] )+'%,   TOTAL:   '+total+'E\r\n';
        }

        ticketReceipt +='                          (IVA incluido)\r\n\r\n';

        switch (data['overview']['payment_method']) {

            case 'cash':
                ticketReceipt += ' METODO: EFECTIVO,        ENTREGA: '+received+'E\r\n                          CAMBIO:  '+data['overview']['returned']+'E\r\n';
                break;
            case 'credit':
                ticketReceipt += ' METODO: T. CREDITO,      IMPORTE: '+total+'E\r\n';
                break;
            case 'voucher':
                ticketReceipt += ' METODO: VALE DESCUENTO,  IMPORTE: '+received+'E\r\n';
                if (received > total) {

                    ticketReceipt += '\r\n------------------------------------------\r\n\r\n      ESTE TICKET VALE POR '+Math.abs(received-total).toFixed(2)+' EUROS\r\n\r\n------------------------------------------\r\n';
                    ticketReceipt += '\r\n        VALIDO MAXIMO HASTA 6 MESES\r\n';
                    data['overview']['voucher'] = Math.abs(received-total).toFixed(2);
                }
                break;
            case 'phone':
                ticketReceipt += ' METODO: TELEFONO,        IMPORTE: '+total+'E\r\n';
                break;
            case 'combined':
                ticketReceipt += ' METODO: COMBINADO,     ';

                if (data['overview']['combined_cash']) {

                    ticketReceipt += '  EFECTIVO: '+data['overview']['combined_cash']+'E\r\n';

                    if (data['overview']['combined_credit']) {

                        ticketReceipt += '                          T. CRED.: '+data['overview']['combined_credit']+'E\r\n';
                    }

                    if (data['overview']['combined_voucher']) {

                        ticketReceipt += '                          V. DESC.: '+data['overview']['combined_voucher']+'E\r\n';
                    }
                }
                else if (data['overview']['combined_credit']) {

                    ticketReceipt += '  T. CRED.: '+data['overview']['combined_credit']+'E\r\n';

                    if (data['overview']['combined_cash']) {

                        ticketReceipt += '                          EFECTIVO: '+data['overview']['combined_cash']+'E\r\n';
                    }

                    if (data['overview']['combined_voucher']) {

                        ticketReceipt += '                          V. DESC.: '+data['overview']['combined_voucher']+'E\r\n';
                    }
                }
                else {

                    ticketReceipt += '  V. DESC.: '+data['overview']['combined_voucher']+'E\r\n';

                    if (data['overview']['combined_credit']) {

                        ticketReceipt += '                          T. CRED.: '+data['overview']['combined_credit']+'E\r\n';
                    }

                    if (data['overview']['combined_cash']) {

                        ticketReceipt += '                          EFECTIVO: '+data['overview']['combined_cash']+'E\r\n';
                    }
                }

                break;
        }

        ticketReceipt += '\r\n     DEVOLUCIONES MAXIMO HASTA 30 DIAS\r\n';
        ticketReceipt += '\r\n       *** GRACIAS POR SU VISITA ***\r\n\r\n';
        ticketReceipt += '-   -   -   -   -   -   -   -   -   -   -\r\n\r\n\r\n';

        //data['overview']['date'] = new Date();

        if (data['overview']['update_code']) {

            ticketsDB.update({'code': data['overview']['update_code']}, { '$set': { 'visible': false} }, function (err) {

                    if (err) {

                        salesLogger.error('Error orderTicket method', err);
                        return res.send(404);
                    }

                    ticketsDB.update({'_id': data['_id'], 'status':'EXPIRING'}, { '$set': { 'products': data['products'], 'overview':data['overview'], 'status':'VENDIDO', 'print':ticketReceipt, 'date_end':new Date() }}, function (err){

                        if (err) {

                            salesLogger.error('Error orderTicket method', err);
                            return res.send(404);//El ticket no se ha finalizado
                        }

                        res.send(ticketReceipt);
                    });
            });

        }
        else {

            //Obtenemos todos los productos, generamos el ticket impresion y actualizamos el ticket
            ticketsDB.update({'_id': data['_id'], 'status':'EXPIRING'}, { '$set': { 'products': data['products'], 'overview':data['overview'], 'status':'VENDIDO', 'print':ticketReceipt, 'date_end':new Date() }}, function (err) {

                if (err) {

                    salesLogger.error('Error orderTicket method', err);
                    return res.send(404);//El ticket no se ha finalizado
                }

                res.send(ticketReceipt);
            });
        }
    }
    else {

        salesLogger.debug('User not authorised in method orderTicket');
        res.send(401);
    }

};

exports.saveTicket = function (req, res, next) {
    
    if (req.user && req.user.role == 'employee') {

        var data = req.body,
            ticketReceipt = '\r\n             ZAPATERIA KALZATE\r\n\r\nCC. La Trocha, Local 31. Tel. 951-315-150\r\n    Ctra Cartama, Coin, Malaga, 29100.\r\n\r\n',
            total = parseFloat(data['overview']['total']).toFixed(2),
            datetime = moment().format('DD/MM/YY HH:mm');

        ticketReceipt += ' Ticket: '+data['overview']['code']+'  Fecha: '+datetime+'\r\n\r\n Atendid@ por: '+req.user.username+'\r\n\r\n------------------------------------------\r\n Articulo              Ud.  PVP  Subtotal\r\n------------------------------------------\r\n';

        var total_with_no_discount = 0;

        for (var i=0;i<data['products'].length;i++) {

            var desc;

            if (data['products'][i]['type'] == 's') {
                //Si se pasa de 25 lo suyo seria hacer una abreviacion
                //desc = (data['products'][i]['description'] > 25) ? data['products'][i]['abbr']:data['products'][i]['description'];
                desc = data['products'][i]['description'];
            }
            else {

                desc = data['products'][i]['reference']+data['products'][i]['description'];
            }

            desc = (desc.length > 21) ? desc.substr(0,17)+'... ':desc+Array(22 - desc.length).join(' ');

            ticketReceipt += ' '+desc+' '+data['products'][i]['quantity']+'x  '+parseFloat(data['products'][i]['price']).toFixed(2)+'E  '+parseFloat(data['products'][i]['subtotal']).toFixed(2)+'E\r\n';

            total_with_no_discount +=  parseFloat(data['products'][i]['subtotal']);
        }

        ticketReceipt += '------------------------------------------\r\n                          TOTAL:   '+total_with_no_discount.toFixed(2)+'E\r\n';

        if (data['overview']['total_discount']) {

            // ticketReceipt += ' CON DESCUENTO DEL '+( parseInt(data['overview']['discount']) <= 9 ? ' '+data['overview']['discount']:data['overview']['discount'] )+'%,   TOTAL:   '+data['overview']['total_discount']+'E\r\n';
            ticketReceipt += ' CON DESCUENTO DEL '+( parseInt(data['overview']['discount']) <= 9 ? ' '+data['overview']['discount']:data['overview']['discount'] )+'%,   TOTAL:   '+total+'E\r\n';
        }

        ticketReceipt +='                          (IVA incluido)\r\n\r\n';

        data['overview']['valid_till'] = moment().lang('es').add('d',7).format('dd D, MMM YYYY').toUpperCase();

        ticketReceipt += ' RESERVA VALIDA HASTA EL '+data['overview']['valid_till']+'\r\n';
        ticketReceipt += '\r\n       *** GRACIAS POR SU VISITA ***\r\n\r\n';
        ticketReceipt += '-   -   -   -   -   -   -   -   -   -   -\r\n\r\n\r\n';

        //data['overview']['date'] = new Date();

        //Obtenemos todos los productos, generamos el ticket impresion y actualizamos el ticket
        ticketsDB.update({'_id': data['_id'], 'status':'EXPIRING'}, { '$set': { 'products': data['products'], 'overview':data['overview'], 'status':'RESERVADO', 'print':ticketReceipt, 'date_end':new Date() }}, function (err){

            if (err) {

                salesLogger.error('Error saveTicket method', err);
                return res.send(404);//El ticket no se ha finalizado
            }

            res.send(ticketReceipt);
        });
    }
    else
    {
        salesLogger.debug('User not authorised in method saveTicket');
        res.send(401);
    }
};


exports.getFieldsForTickets = function (req, res, next) {

    if (req.user && req.user.role == 'employee') {

        //We are going to return an array of al necessary fields for tickets panel
        var numQueries = 4,
            fields = {};

        stockDB
        .distinct('reference')
        .exec(function (err, field) {       
            
            if (err) {

                salesLogger.error('Error getFieldsForTickets method', err);
                return res.send(404);
            }

            fields.references = field;

            numQueries--;

            if (numQueries == 0) {

                res.send(fields);
            }
            
        });

        stockDB
        .distinct('brand')
        .exec(function (err, field) {       
            
            if (err) {

                salesLogger.error('Error getFieldsForTickets method', err);
                return res.send(404);
            }

            fields.brands = field;

            numQueries--;

            if (numQueries == 0) {

                res.send(fields);
            }
            
        });

        ticketsDB
        .distinct('code',{$or:[{status:'VENDIDO'}, {status:'RESERVADO'}]})
        .exec(function (err, field) {       
            
            if (err) {

                salesLogger.error('Error getFieldsForTickets method', err);
                return res.send(404);
            }

            fields.codes = field;

            numQueries--;

            if (numQueries == 0) {

                res.send(fields);
            }
            
        });

        userDB
        .distinct('username')
        .exec(function (err, field) {       
            
            if(err) {

                salesLogger.error('Error getFieldsForTickets method', err);
                return res.send(404);
            }

            fields.employees = field;

            numQueries--;

            if(numQueries == 0) {

                res.send(fields);
            }
            
        });
    }
    else {

        salesLogger.debug('User not authorised in method getFieldsForTickets');
        res.send(401);
    }
};

exports.getTickets = function (req, res, next) {

    if (req.user && req.user.role == 'employee') {

        var data = req.body,
            search = {},
            date;

        if (data['search']['date']) {

            var date = data['search']['date'].split('/'),    
                date_start = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]),0,0,0),
                date_tomorrow = moment(date_start).add('d',1).format('DD/MM/YYYY').split('/'),
                date_end = new Date(parseInt(date_tomorrow[2]), parseInt(date_tomorrow[1])-1, parseInt(date_tomorrow[0]),0,0,0);

            salesLogger.debug('date received %s, date start %s, date end %s', date, date_start, date_end);

            search['date_end'] = {"$gte":date_start, "$lt": date_end};
            delete data['search']['date'];
        }

        if (!data['search']['status']) {

            search['$or'] = [{status:'VENDIDO'}, {status:'RESERVADO'}];
        }

        if (data['search']['code']) {
            search = {code:data['search']['code']};
        }

        search['visible'] = true;

        if (data['search']['employee']) {

            return userDB.findOne({'username': data['search']['employee']}, {'_id':1}, function(err, user) {

                if (err || !user) {

                    salesLogger.error('Error getTickets method', err);
                    return res.send(404);
                }

                data['search']['employee_id'] = user._id;
                delete data['search']['employee'];

                ticketsDB
                .find(search, {code:1, employee:1, print:1, status:1, date_end:1}, {limit:data['limit'], skip:data['offset']})
                .sort(data['order'])
                .execFind(function (err, tickets) {            
                    
                    if (err) {

                        salesLogger.error('Error getTickets method', err);
                        return res.send(404);
                    }

                    ticketsDB.count(search, function (err, count) {
                    
                        if (err) {

                            salesLogger.error('Error getTickets method', err);
                            return res.send(404);
                        }

                        res.send({count: count, items: tickets});
                    }); 
                });
            });
        }

        salesLogger.debug('Search data', search);
        
        ticketsDB
        .find(search, {code:1, employee:1, print:1, status:1, date_end:1}, {limit:data['limit'], skip:data['offset']})
        .sort(data['order'])
        .execFind(function (err, tickets) {            
            
            if (err)  {

                salesLogger.error('Error getTickets method', err);
                return res.send(404);
            }

            ticketsDB.count(search, function (err, count) {
            
                if (err) {

                    salesLogger.error('Error getTickets method', err);
                    return res.send(404);
                }

                res.send({count: count, items: tickets});
            });
        });
    }
    else {

        salesLogger.debug('User not authorised in method getTickets');
        res.send(401);
    }
};

exports.getTicket = function (req, res, next) {

    if (req.user && req.user.role == 'employee') {

        ticketsDB
        .findOne(req.body,{products:1, overview:1, date_end:1}, function(err, ticket){        
            
            if (err) {

                salesLogger.error('Error getTicket method', err);
                return res.send(404);
            }

            res.send(ticket);
        });
    }
    else {

        salesLogger.debug('User not authorised in method getTicket');
        res.send(401);
    }
};

exports.sellbackTicket = function (req, res, next) {

    if (req.user && req.user.role == 'employee') {

        var data = req.body,
            ticketReceipt = '\r\n             ZAPATERIA KALZATE\r\n\r\nCC. La Trocha, Local 31. Tel. 951-315-150\r\n    Ctra Cartama, Coin, Malaga, 29100.\r\n\r\n',
            total = parseFloat(data['overview']['total']).toFixed(2),
            received = parseFloat(data['overview']['received'].replace(',','.')).toFixed(2),
            datetime = moment().format('DD/MM/YY HH:mm'),
            i = 0,
            desc;

        if (total < 0 && data['overview']['payment_method'] == 'voucher') {

            ticketReceipt += ' Ticket: '+data['overview']['code']+'  Fecha: '+datetime+'\r\n\r\n Atendid@ por: '+req.user.username+'\r\n\r\n------------------------------------------\r\n\r\n      ESTE TICKET VALE POR '+Math.abs(total).toFixed(2)+' EUROS\r\n\r\n------------------------------------------\r\n';
            ticketReceipt += '\r\n        VALIDO MAXIMO HASTA 6 MESES\r\n'; 
            data['overview']['voucher'] = Math.abs(total).toFixed(2);
        }
        else {

            ticketReceipt += ' Ticket: '+data['overview']['code']+'  Fecha: '+datetime+'\r\n\r\n Atendid@ por: '+req.user.username+'\r\n\r\n------------------------------------------\r\n Articulo              Ud.  PVP  Subtotal\r\n------------------------------------------\r\n';

            for (i=0;i<data['products']['retained'].length;i++) {

                desc = '(*)';

                if (data['products']['retained'][i]['type'] == 's') {

                    //Si se pasa de 25 lo suyo seria hacer una abreviacion
                    //desc = (data['products'][i]['description'] > 25) ? data['products'][i]['abbr']:data['products'][i]['description'];
                    desc += data['products']['retained'][i]['description'];
                }
                else {

                    desc += data['products']['retained'][i]['reference']+', '+data['products']['retained'][i]['description'];
                }

                desc = (desc.length > 21) ? desc.substr(0,17)+'... ':desc+Array(22 - desc.length).join(' ');

                ticketReceipt += ' '+desc+' '+data['products']['retained'][i]['quantity']+'x  '+parseFloat(data['products']['retained'][i]['price']).toFixed(2)+'E  0.00E\r\n';
            }

            var total_no_discount = 0;

            for (i=0;i<data['products']['returned'].length;i++) {

                if (data['products']['returned'][i]['type'] == 's') {
                    //Si se pasa de 25 lo suyo seria hacer una abreviacion
                    //desc = (data['products'][i]['description'] > 25) ? data['products'][i]['abbr']:data['products'][i]['description'];
                    desc = data['products']['returned'][i]['description'];
                }
                else {

                    desc = data['products']['returned'][i]['reference']+', '+data['products']['returned'][i]['description'];
                }

                desc = (desc.length > 21) ? desc.substr(0,16)+'... ':desc+Array(21 - desc.length).join(' ');

                // ticketReceipt += ' '+desc+' -'+data['products']['returned'][i]['quantity']+'x  '+parseFloat(data['products']['returned'][i]['price']).toFixed(2)+'E  -'+parseFloat(data['products']['returned'][i]['subtotal']).toFixed(2)+'E\r\n';

                ticketReceipt += ' '+desc+' -'+data['products']['returned'][i]['quantity']+'x  '+parseFloat(data['products']['returned'][i]['price']).toFixed(2)+'E  -'+(parseFloat(data['products']['returned'][i]['quantity'])*parseFloat(data['products']['returned'][i]['price'])).toFixed(2)+'E\r\n';

                if (parseFloat(data['products']['returned'][i]['discount']) > 0 ) {

                    var discount;

                    if (data['products']['returned'][i]['discount'].indexOf('%') != -1) {
                        
                        discount = Math.abs((parseFloat(data['products']['returned'][i]['discount'])/100)*(parseFloat(data['products']['returned'][i]['price'])*data['products']['returned'][i]['quantity']));
                        ticketReceipt += '* DESC. '+data['products']['returned'][i]['discount']+'                        '+discount.toFixed(2)+'E\r\n';
                    }
                    else {

                        discount = parseFloat(data['products']['returned'][i]['_discount'])*data['products']['returned'][i]['quantity']
                        ticketReceipt += '* DESC.                            '+discount.toFixed(2)+'E\r\n';
                    }

                    total_no_discount +=  (-(parseFloat(data['products']['returned'][i]['price'])*data['products']['returned'][i]['quantity']))+discount;
                }
                else {

                    total_no_discount -=  (-(parseFloat(data['products']['returned'][i]['price'])*data['products']['returned'][i]['quantity']));
                }
            }

            for (i=0;i<data['products']['new'].length;i++) {

                if (data['products']['new'][i]['type'] == 's') {
                    //Si se pasa de 25 lo suyo seria hacer una abreviacion
                    //desc = (data['products'][i]['description'] > 25) ? data['products'][i]['abbr']:data['products'][i]['description'];
                    desc = data['products']['new'][i]['description'];
                }
                else {

                    desc = data['products']['new'][i]['reference']+', '+data['products']['new'][i]['description'];
                }

                desc = (desc.length > 21) ? desc.substr(0,17)+'... ':desc+Array(22 - desc.length).join(' ');

                ticketReceipt += ' '+desc+' '+data['products']['new'][i]['quantity']+'x  '+parseFloat(data['products']['new'][i]['price']).toFixed(2)+'E  '+parseFloat(data['products']['new'][i]['subtotal']).toFixed(2)+'E\r\n';

                if (parseFloat(data['products']['new'][i]['discount']) > 0 ) {

                    var discount;
                    
                    if (data['products']['new'][i]['discount'].indexOf('%') != -1) {
                        
                        discount = Math.abs((parseFloat(data['products']['new'][i]['discount'])/100)*(parseFloat(data['products']['new'][i]['price'])*data['products']['new'][i]['quantity']));
                        ticketReceipt += '* DESC. '+data['products']['new'][i]['discount']+'                        -'+discount.toFixed(2)+'E\r\n';
                    }
                    else {

                        discount = parseFloat(data['products']['new'][i]['discount'])
                        ticketReceipt += '* DESC.                            -'+discount.toFixed(2)+'E\r\n';
                    }

                    total_no_discount +=  ((parseFloat(data['products']['new'][i]['price'])*data['products']['new'][i]['quantity']))-discount;
                }
                else {

                    total_no_discount -=  ((parseFloat(data['products']['new'][i]['price'])*data['products']['new'][i]['quantity']));
                }
            }

            ticketReceipt += '------------------------------------------\r\n                          TOTAL:   '+total_no_discount.toFixed(2)+'E\r\n';

            if (data['overview']['total_discount']) {

                // ticketReceipt += ' CON DESCUENTO DEL '+( parseInt(data['overview']['discount']) <= 9 ? ' '+data['overview']['discount']:data['overview']['discount'] )+'%,   TOTAL:   '+data['overview']['total_discount']+'E\r\n';
                ticketReceipt += ' CON DESCUENTO DEL '+( parseInt(data['overview']['discount']) <= 9 ? ' '+data['overview']['discount']:data['overview']['discount'] )+'%,   TOTAL:   '+total+'E\r\n';
            }

            ticketReceipt +='                          (IVA incluido)\r\n\r\n';

            if (total != 0) {

                switch (data['overview']['payment_method']) {

                    case 'cash':
                        ticketReceipt += ' METODO: EFECTIVO,        ENTREGA: '+received+'E\r\n                          CAMBIO:  '+data['overview']['returned']+'E\r\n';
                        break;
                    case 'credit':
                        ticketReceipt += ' METODO: T. CREDITO,      IMPORTE: '+total+'E\r\n';
                        break;
                    case 'voucher':
                        ticketReceipt += ' METODO: VALE DESCUENTO,  IMPORTE: '+total+'E\r\n';
                        break;
                    case 'phone':
                        ticketReceipt += ' METODO: TELEFONO,        IMPORTE: '+total+'E\r\n';
                        break;
                    case 'combined':
                        ticketReceipt += ' METODO: COMBINADO,     ';

                        if (data['overview']['combined_cash']) {

                            ticketReceipt += '  EFECTIVO: '+data['overview']['combined_cash']+'E\r\n';

                            if (data['overview']['combined_credit']) {

                                ticketReceipt += '                          T. CRED.: '+data['overview']['combined_credit']+'E\r\n';
                            }

                            if (data['overview']['combined_voucher']) {

                                ticketReceipt += '                          V. DESC.: '+data['overview']['combined_voucher']+'E\r\n';
                            }
                        }
                        else if (data['overview']['combined_credit']) {

                            ticketReceipt += '  T. CRED.: '+data['overview']['combined_credit']+'E\r\n';

                            if (data['overview']['combined_cash']) {
                                ticketReceipt += '                          EFECTIVO: '+data['overview']['combined_cash']+'E\r\n';
                            }

                            if (data['overview']['combined_voucher']) {

                                ticketReceipt += '                          V. DESC.: '+data['overview']['combined_voucher']+'E\r\n';
                            }
                        }
                        else {

                            ticketReceipt += '  V. DESC.: '+data['overview']['combined_voucher']+'E\r\n';

                            if (data['overview']['combined_credit']) {

                                ticketReceipt += '                          T. CRED.: '+data['overview']['combined_credit']+'E\r\n';
                            }

                            if (data['overview']['combined_cash']) {

                                ticketReceipt += '                          EFECTIVO: '+data['overview']['combined_cash']+'E\r\n';
                            }
                        }

                        break;
                }
            }
            

            if (data['products']['retained'].length) {

                var today = moment(),
                    oldTicketDate = moment(data['products']['date']),
                    days = 30 - today.diff(oldTicketDate,'days');

                ticketReceipt += '\r\n       DEVOLUCIONES MAX. HASTA 30 DIAS\r\n';

                if (days <= 30) {

                    ticketReceipt += '\r\n      (*) DEVOLUCIONES MAX. '+days+' DIA'+(days > 1 ? 'S':'')+'\r\n';
                }
                else {

                    ticketReceipt += '\r\n     (*) NO DEVOLUCIONES ADMITIDAS \r\n';
                }
            }
            else {

                ticketReceipt += '\r\n     DEVOLUCIONES MAXIMO HASTA 30 DIAS\r\n';
            }
        }

        ticketReceipt += '\r\n       *** GRACIAS POR SU VISITA ***\r\n\r\n';
        ticketReceipt += '-   -   -   -   -   -   -   -   -   -   -\r\n\r\n\r\n';

        //data['overview']['date'] = new Date();

        ticketsDB.update({'code': data['overview']['update_code']}, { '$set': { 'visible': false} }, function (err) {

            if (err) {

                salesLogger.error('Error sellbackTicket method', err);
                return res.send(404);
            }

            var productsFinal = data['products']['productsFinal'];

            delete data['products']['productsFinal'];
            delete data['products']['date'];

            ticketsDB.update({'_id': data['_id'], 'status':'EXPIRING'}, { '$set': { 'box': data['products'], 'products': productsFinal, 'overview':data['overview'], 'status':(productsFinal.length > 0 ? 'VENDIDO' : 'DEVUELTO'), 'print':ticketReceipt, 'date_end': new Date() }}, function (err) {

                if (err) {

                    salesLogger.error('Error sellbackTicket method', err);
                    return res.send(404);//El ticket no se ha finalizado
                }

                res.send(ticketReceipt);
            });
        });
    }
    else {

        salesLogger.debug('User not authorised in method sellbackTicket');
        res.send(401);
    }

};

exports.abortTicket = function (req, res, next) {

    if (req.user && req.user.role == 'employee') {
        
        var data = req.body,
            promise = {},
            ts,
            numQueries = 0;

        if (data['updated']) {

            return ticketsDB.update({'code': data['overview']['code']}, { '$set': { 'visible': false} }, function (err) {

                if (err) {

                    salesLogger.error('Error abortTicket method', err);
                    return res.send({updated:true});
                }

                ticketsDB.update({'_id': data['_id'], 'status':'EXPIRING'}, { '$set': { 'box': {'returned':data['products'], 'new':[], 'retained':[]}, 'products': [], 'overview':data['overview'], 'status':'ANULADO', 'date_end': new Date() }}, function (err) {

                    if (err) {
                        
                        salesLogger.error('Error abortTicket method', err);
                        return res.send({updated:true});//El ticket no se ha finalizado
                    }

                    res.send(true);
                });
            });
        }

        for (var i=data['loop_index'];i<data['products'].length;i++) {
            //console.log('ENTRA2');
            ts = (new Date()).getTime()+Math.floor(Math.random()*1000+1);

            promise = {

                '_id':data['products'][i]['_id'],
                'quantity':-(data['products'][i]['quantity']),
                'qa':0,
                'ts': ts
            };

            numQueries++;

            ticketsDB.update({'_id': data['_id'], 'status':'EXPIRING'}, { '$push': { 'products': promise }}, function (err){

                if (err) {

                    salesLogger.error('Error abortTicket method', err);
                    return res.send({error:i});//El producto no se ha añadido
                }

                //console.log('ENTRA3');

                stockDB.update({'_id': promise['_id'], 'quantity': {'$gte': 0}}, 
                { $inc: {quantity: (promise['qa']-promise['quantity'])}, '$set': { in_carts: { quantity:promise['quantity'], id: data['_id'], timestamp: ts}}}, function (err) {

                    if (err) {

                        salesLogger.error('Error abortTicket method', err);
                        return res.send({error:i});//El producto no se ha añadido
                    }

                    numQueries--;

                    if (numQueries == 0) {

                        //console.log('ENTRA4');
                        ticketsDB.update({'code': data['overview']['code']}, { '$set': { 'visible': false} }, function (err) {

                            if (err) {

                                salesLogger.error('Error abortTicket method', err);
                                return res.send({updated:true});
                            }

                            ticketsDB.update({'_id': data['_id'], 'status':'EXPIRING'}, { '$set': { 'box': {'returned':data['products'], 'new':[], 'retained':[]}, 'products': [], 'overview':data['overview'], 'status':'ANULADO', 'date_end': new Date() }}, function (err) {

                                if (err) {

                                    salesLogger.error('Error abortTicket method', err);
                                    return res.send({updated:true});//El ticket no se ha finalizado
                                }

                                res.send(true);
                            });
                        });
                    }
                });
            });
        }  
    }
    else
    {
        salesLogger.debug('User not authorised in method abortTicket');
        res.send(401);
    }

};

exports.getSessionTicket = function (req, res, next) {

    if (req.user && req.user.role == 'employee') {
        
        var newTicket = new ticketsDB({employee: req.user.username, employee_id: req.user._id});

        newTicket.save(function (err) {

            if (err) {
                
                salesLogger.error('Error getSessionTicket method', err);
                return res.send(404);
            }

            ticketsDB
            .findOne(req.body,{products: 1, overview: 1, date_end: 1}, function (err, ticket) {        
                if (err) {

                    salesLogger.error('Error getSessionTicket method', err);
                    return res.send(404);
                }

                res.send({'sessTicket': newTicket, 'ticket': ticket});
            });
        });
    }
    else {

        salesLogger.debug('User not authorised in method getSessionTicket'); 
        res.send(401);
    }
};

exports.getBox = function (req, res, next) {

    if (req.user && req.user.role == 'employee') {

        var data = req.body,
            date,
            date_start,
            date_end,
            search = {};

        // if(data['dateFrom'] == data['dateTo'])
        // {
        //     date = data['dateFrom'].split('/');
        //     date_start = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]),0,0,0);

        //     date = moment(date_start).add('d',1).format('DD/MM/YYYY').split('/');
        //     date_end = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]),0,0,0);
        // }
        // else
        // {
        //     date = data['dateFrom'].split('/');
        //     date_start = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]),0,0,0);

        //     date = data['dateTo'].split('/');
        //     date_end = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]),0,0,0);
        
        // }

        date = data['date'].split('/');
        date_start = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]),0,0,0);

        date = moment(date_start).add('d',1).format('DD/MM/YYYY').split('/');
        date_end = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]),0,0,0);

        search['date_end'] = {"$gte":date_start, "$lt": date_end};
        
        //console.log(search['date_end']);

        ticketsDB
        .find(search, function (err, tickets) {            
            
            //console.log(tickets);

            if (err) {

                salesLogger.error('Error getBox method', err);
                return res.send(404);
            }

            if (!tickets.length) {

                return res.send({box:[],total:0})
            }

            userDB
            .find({},{username:1,_id:1}, function (err, employees) {       
                
                var i, box = [], temp_box = {}, summary;

                summary = {employee:'', ordered:0, returned_cash:0, returned_voucher:0, returned_plus_ordered:0, booked:0, cancelled:0, total_cash:0, total_credit:0, total_voucher:0, total_rcash:0, total:0, total_tickets:0};

                for (i=0;i<employees.length;i++) {

                    //box.push({employee:employees[i], ordered:0, returned:0, booked:0, cancelled:0, total:0});
                    temp_box[employees[i]['_id']] = {employee:employees[i]['username'], ordered:0, returned_cash:0, returned_voucher:0, returned_plus_ordered:0, booked:0, cancelled:0, total_cash:0, total_credit:0, total_voucher:0, total_rcash:0, total:0, total_tickets:0};
                }

                for (i=0;i<tickets.length;i++) {

                    if (tickets[i]['status'] == 'VENDIDO') {

                        //console.log(tickets[i]['overview']['total']);
                        if (tickets[i]['overview']['total'] < 0) {
                            
                            if (tickets[i]['box']['new'].length) {

                                temp_box[tickets[i]['employee_id']].ordered++;
                                summary.ordered++;
                            }

                            if (tickets[i]['overview']['payment_method'] == 'voucher') {

                                temp_box[tickets[i]['employee_id']].returned_voucher++;
                                summary.returned_voucher++;
                            }
                            //else if(tickets[i]['overview']['payment_method'] == 'cash')
                            else {

                                temp_box[tickets[i]['employee_id']].returned_cash++;
                                summary.returned_cash++;

                                temp_box[tickets[i]['employee_id']].total_rcash += parseFloat(tickets[i]['overview']['total']);
                                //temp_box[tickets[i]['employee_id']].total_cash += tickets[i]['overview']['total'];
                                temp_box[tickets[i]['employee_id']].total += parseFloat(tickets[i]['overview']['total']);
                                summary.total_rcash += parseFloat(tickets[i]['overview']['total']);
                                //summary.total_cash += tickets[i]['overview']['total'];
                                summary.total += parseFloat(tickets[i]['overview']['total']);
                            }
                        }
                        //vendido
                        else {
                            
                            if (tickets[i]['box'] && tickets[i]['box']['returned'].length) {

                                temp_box[tickets[i]['employee_id']].returned_plus_ordered++;
                                summary.returned_plus_ordered++;
                            }

                            temp_box[tickets[i]['employee_id']].ordered++;
                            summary.ordered++;

                            //temp_box[tickets[i]['employee_id']].total += tickets[i]['overview']['total'];
                            //summary.total += tickets[i]['overview']['total'];
                            
                            if (tickets[i]['overview']['payment_method'] == 'cash') {

                                temp_box[tickets[i]['employee_id']].total_cash += parseFloat(tickets[i]['overview']['total']);
                                summary.total_cash += parseFloat(tickets[i]['overview']['total']);

                                temp_box[tickets[i]['employee_id']].total += parseFloat(tickets[i]['overview']['total']);
                                summary.total += parseFloat(tickets[i]['overview']['total']);
                            }
                            else if (tickets[i]['overview']['payment_method'] == 'credit') {

                                temp_box[tickets[i]['employee_id']].total_credit += parseFloat(tickets[i]['overview']['total']);
                                summary.total_credit += parseFloat(tickets[i]['overview']['total']);

                                temp_box[tickets[i]['employee_id']].total += parseFloat(tickets[i]['overview']['total']);
                                summary.total += parseFloat(tickets[i]['overview']['total']);
                            }
                            else if (tickets[i]['overview']['payment_method'] == 'voucher') {

                                temp_box[tickets[i]['employee_id']].total_voucher += parseFloat(tickets[i]['overview']['total']);
                                summary.total_voucher += parseFloat(tickets[i]['overview']['total']);
                            }
                            else {

                                temp_box[tickets[i]['employee_id']].total_credit += (parseFloat(tickets[i]['overview']['combined_credit']) || 0);
                                summary.total_credit += (parseFloat(tickets[i]['overview']['combined_credit']) || 0);

                                temp_box[tickets[i]['employee_id']].total_cash += (parseFloat(tickets[i]['overview']['combined_cash']) || 0);
                                summary.total_cash += (parseFloat(tickets[i]['overview']['combined_cash']) || 0);

                                temp_box[tickets[i]['employee_id']].total_voucher += (parseFloat(tickets[i]['overview']['combined_voucher']) || 0);
                                summary.total_voucher += (parseFloat(tickets[i]['overview']['combined_voucher']) || 0);

                                temp_box[tickets[i]['employee_id']].total += (parseFloat(tickets[i]['overview']['combined_credit']) || 0) + (parseFloat(tickets[i]['overview']['combined_cash']) || 0);
                                summary.total += (parseFloat(tickets[i]['overview']['combined_credit']) || 0) + (parseFloat(tickets[i]['overview']['combined_cash']) || 0);
                            }
                        }
                        /*
                        if(tickets[i]['box'])
                        {
                            //if(tickets[i]['box']['returned'].length)
                            if(tickets[i]['overview']['total'] < 0)
                            {
                                
                                if(tickets[i]['box']['new'].length)
                                {
                                    temp_box[tickets[i]['employee_id']].ordered++;
                                    summary.ordered++;
                                }

                                if(tickets[i]['overview']['payment_method'] == 'voucher')
                                {
                                    temp_box[tickets[i]['employee_id']].returned_vocuher++;
                                    summary.returned_vocuher++;
                                }
                                //else if(tickets[i]['overview']['payment_method'] == 'cash')
                                else
                                {
                                    temp_box[tickets[i]['employee_id']].returned_cash++;
                                    summary.returned_cash++;

                                    temp_box[tickets[i]['employee_id']].total_cash += tickets[i]['overview']['total'];
                                    temp_box[tickets[i]['employee_id']].total += tickets[i]['overview']['total'];
                                    summary.total_cash += tickets[i]['overview']['total'];
                                    summary.total += tickets[i]['overview']['total'];
                                }
                            }
                            //vendido
                            else
                            {
                                
                                if(tickets[i]['box']['returned'].length)
                                {
                                    temp_box[tickets[i]['employee_id']].returned_plus_ordered++;
                                    summary.returned_plus_ordered++;
                                }

                                temp_box[tickets[i]['employee_id']].ordered++;
                                summary.ordered++;

                                temp_box[tickets[i]['employee_id']].total += tickets[i]['overview']['total'];
                                summary.total += tickets[i]['overview']['total'];
                                
                                if(tickets[i]['overview']['payment_method'] == 'cash')
                                {
                                    temp_box[tickets[i]['employee_id']].total_cash += tickets[i]['overview']['total'];
                                    summary.total_cash += tickets[i]['overview']['total'];
                                }
                                else if(tickets[i]['overview']['payment_method'] == 'credit')
                                {
                                    temp_box[tickets[i]['employee_id']].total_credit += tickets[i]['overview']['total'];
                                    summary.total_credit += tickets[i]['overview']['total'];
                                }
                            }
                        }
                        //vendido
                        else
                        {
                            temp_box[tickets[i]['employee_id']].ordered++;
                            summary.ordered++;

                            temp_box[tickets[i]['employee_id']].total += tickets[i]['overview']['total'];
                            summary.total += tickets[i]['overview']['total'];
                            
                            if(tickets[i]['overview']['payment_method'] == 'cash')
                            {
                                temp_box[tickets[i]['employee_id']].total_cash += tickets[i]['overview']['total'];
                                summary.total_cash += tickets[i]['overview']['total'];
                            }
                            else if(tickets[i]['overview']['payment_method'] == 'credit')
                            {
                                temp_box[tickets[i]['employee_id']].total_credit += tickets[i]['overview']['total'];
                                summary.total_credit += tickets[i]['overview']['total'];
                            }
                        } 
                        */               
                    }
                    else if (tickets[i]['status'] == 'DEVUELTO') {

                        if (tickets[i]['overview']['payment_method'] == 'voucher') {

                            temp_box[tickets[i]['employee_id']].returned_voucher++;
                            summary.returned_voucher++;
                        }
                        //else if(tickets[i]['overview']['payment_method'] == 'cash')
                        else {

                            temp_box[tickets[i]['employee_id']].returned_cash++;
                            summary.returned_cash++;

                            temp_box[tickets[i]['employee_id']].total_rcash += parseFloat(tickets[i]['overview']['total']);
                            //temp_box[tickets[i]['employee_id']].total_cash += tickets[i]['overview']['total'];
                            temp_box[tickets[i]['employee_id']].total += parseFloat(tickets[i]['overview']['total']);
                            summary.total_rcash += parseFloat(tickets[i]['overview']['total']);
                            //summary.total_cash += tickets[i]['overview']['total'];
                            summary.total += parseFloat(tickets[i]['overview']['total']);
                        }
                    }
                    else if (tickets[i]['status'] == 'RESERVADO') {

                        temp_box[tickets[i]['employee_id']].booked++;
                        summary.booked++;
                    }
                    else if (tickets[i]['status'] == 'ANULADO') {

                        temp_box[tickets[i]['employee_id']].cancelled++;
                        summary.cancelled++;
                    }

                    /*if(tickets[i]['visible'])
                    {
                        temp_box[tickets[i]['employee_id']].total_tickets++;
                        summary.total_tickets++;
                    }*/
                }

                for (var employee in temp_box) {

                    box.push(temp_box[employee]);
                }

                box.push(summary);

                //PRINTING PDF AND

                //res.send({box:box,total:summary.total}); 
                res.send({box:box,total:summary.total_cash+summary.total_rcash});   
            });
        });
    }
    else {

        salesLogger.debug('User not authorised in method getBox');
        res.send(401);
    }
};

exports.validateVoucher = function (req, res, next) {

    if (req.user && req.user.role == 'employee') {

        ticketsDB
        .findOne(req.body, {overview:1, date_end:1}, function (err, ticket) {        
            
            if (err || !ticket || !ticket.overview['voucher']) {

                salesLogger.error('Error validateVoucher method', err);
                return res.send(404);
            }

            //check if it is out of date
            var today = moment(),
                oldTicketDate = moment(ticket.date_end);

            //Exactly 6 months. 6 months and one day is not accepted
            if (today.diff(oldTicketDate,'months', true) > 6) {

                return res.send(404);
            }

            res.send({total:Math.abs(ticket.overview['voucher'])});
        });
    }
    else {

        salesLogger.debug('User not authorised in method validateVoucher');
        res.send(401);
    }
};