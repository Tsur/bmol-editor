'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  shoesDB = mongoose.model('Stock'),
  json2csv = require('json2csv'),
  PDFDoc = require('pdfkit'),
  Barc = require('barc'),
  QRCode = require('qrcode'),
  fs = require('fs'),
  stockLogger = require('./../../../config/loggers/init')('stock'),
  settings = require('config');

/**************************************************************************

Store functions
 
**************************************************************************/
var _getShoes = function(what, limit, offset, order, cb) {

  var what = what || {},
    limit = limit || settings.get('stock.defaultShoesLimit'),
    offset = offset || settings.get('stock.defaultShoesOffset'),
    order = order || settings.get('stock.defaultShoesOrder'),
    cb = cb || this.arguments[this.arguments.length - 1],
    fields = settings.get('stock.defaultShoesFields');

  shoesDB
    .find(what, fields, {
      limit: limit,
      skip: offset
    })
    .sort(order)
    .exec(function(err, shoes) {

      if (err) {

        stockLogger.error('Error _getShoes method', err);
        return cb(err);
      }

      shoesDB.count(what, function(err, count) {

        if (err) {

          stockLogger.error('Error _getShoes method', err);
          return cb(true);
        }

        cb(false, {
          count: count,
          items: shoes
        });
      });
    });
};

var _getShoeById = function(id, cb) {

  var id = id || '',
    cb = cb || this.arguments[this.arguments.length - 1];

  shoesDB
    .findById(id, {
      qr: 0,
      'last-modified': 0,
      history: 0,
      sold: 0
    }, function(err, shoe) {
      if (!shoe || err) {

        stockLogger.error('Error _getShoeById method', err);
        return cb(true);
      }

      cb(false, shoe);
    });
};

var _updateShoeById = function(id, change, cb) {

  var id = id || '',
    change = change || {},
    cb = cb || this.arguments[this.arguments.length - 1];

  shoesDB
    .findByIdAndUpdate(id, {
      $set: change
    }, function(err, shoe) {

      if (!shoe || err) {

        stockLogger.error('Error _updateShoeById method', err);
        return cb(true);
      }

      cb(false, true);
    });
};

exports.getShoes = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {

    //TODO: Filter it!
    var data = req.body;
    var what = !data['search'] ? {} : data['search'];
    var limit = data['limit'];
    var offset = data['offset'];
    var order = data['order']

    _getShoes(what, limit, offset, order, function(err, response) {

      if (err) {

        stockLogger.error('Error getShoes method', err);
        return res.send(401);
      }

      res.send(response);
    });
  } else {

    stockLogger.debug('User not authorised in method getShoes');
    res.send(401);
  }
};

exports.getShoe = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {

    var id = req.param('stockId');

    _getShoeById(id, function(err, response) {

      if (err) {
        stockLogger.error('Error getShoe method', err);
        return res.send(401);
      }

      res.send(response);
    });
  } else {

    stockLogger.debug('User not authorised in method getShoe');
    res.send(401);
  }
};

exports.editShoe = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {
    var id = req.param('stockId');

    _updateShoeById(id, req.body, function(err, shoe) {

      if (err) {
        stockLogger.error('Error editShoe method', err);
        return res.send(401);
      }

      res.send(true);
    });
  } else {

    stockLogger.debug('User not authorised in method EditShoe');
    res.send(401);
  }
};

exports.addShoes = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {

    var data = req.body,
      shoe = new shoesDB(req.body);

    return shoe.save(function(err) {

      if (err) {

        stockLogger.error('Error addShoes method', err);
        return next(err);
      }

      res.send(200, shoe);

    });
  } else {

    stockLogger.debug('User not authorised in method addShoes');
    res.send(401);
  }
}

exports.importShoes = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {

    var data = req.body;

    if (data.remove) {

      return mongoose.connection.db.dropCollection("shoes", function(err,
        result) {

        if (err) {

          stockLogger.error('Error importShoes method', err);
          return next(err);
        }

        return shoesDB.create(data.items, function(err) {

          if (err) {

            stockLogger.error('Error importShoes method', err);
            return next(err);
          }

          res.send(true);
        });
      });
    } else {

      return shoesDB.create(data.items, function(err) {

        if (err) {

          stockLogger.error('Error importShoes method', err);
          return next(err);
        }

        res.send(true);

      });
    }
  } else {

    stockLogger.debug('User not authorised in method importShoes');
    res.send(401);
  }
};

exports.exportShoesCsv = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {

    shoesDB
      .find({}, function(err, shoes) {

        if (err) {

          stockLogger.error('Error exportShoesCsv method', err);
          return next(err);
        }

        json2csv({
          data: shoes,
          fields: ['reference', 'brand', 'color', 'size', 'quantity',
            'category', 'price'
          ]
        }, function(err, csv) {

          if (err) {

            stockLogger.error('Error exportShoesCsv method', err);
            return next(err);
          }

          res.attachment('zapatos.csv');
          res.setHeader('Content-Type', 'text/csv');
          res.end(csv);
        });
      });
  } else {

    stockLogger.debug('User not authorised in method exportShoesCsv');
    res.send(401);
  }
};

exports.exportShoesPdf = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {
    /* TODO: cache it
        var fs = require('fs')
            ,path = __dirname + '/../../../client/app/barcodes/'
            ;

        if(fs.existsSync(path+'zapatos_barcodes.pdf'))
        {   
            return res.send({cache:true});
        }
        */
    shoesDB
      .find({}, {
        reference: 1,
        brand: 1,
        color: 1,
        size: 1,
        barcode: 1,
        quantity: 1
      }, function(err, shoes) {

        if (err) {

          stockLogger.error('Error exportShoesPdf method', err);
          return next(err);
        }

        var doc = new PDFDoc({
            size: 'A4',
            info: {
              title: 'Kalzate Barcodes',
              author: 'Zurisadai'
            }
          }),
          path = __dirname + '/../../../client/app/barcodes/',
          barc = new Barc({
            fontsize: '16px'
          }),
          x = 9,
          y = 17,
          text = [],
          j,
          imgPath,
          t = 0,
          in_c = 0,
          total_length = shoes.length;

        doc.fontSize(7);

        for (var i = 0; i < shoes.length; i++) {
          //doc.text(shoes[i]['reference']+' | '+shoes[i]['brand']+' | '+shoes[i]['color']+' | '+shoes[i]['size']);

          imgPath = path + shoes[i]['barcode'] + '.png';

          if (!fs.existsSync(imgPath)) {

            try {

              fs.writeFileSync(imgPath, barc.code128(shoes[i]['barcode'], 210,
                110));
            } catch (e) {

              continue;
            }
          }

          in_c = 0;

          if (shoes[i]['quantity'] > 1) {

            total_length += shoes[i]['quantity'] - 1;
          }

          for (var h = 1; h <= shoes[i]['quantity']; h++) {

            doc.image(imgPath, x, y, {
              width: 210,
              height: 110,
              fit: [180, 120]
            });

            j = t + h;

            //Columnas de  6 elementos
            if (j % 6 == 0) { //Nueva columna

              //Let's print the text
              long_text = shoes[i]['reference'] + ' | ' + shoes[i]['brand'] +
                ' | ' + shoes[i]['color'] + ' | ' + shoes[i]['size'] + ' | ' +
                h;

              if (long_text.length > 48) {

                text.push(long_text.substr(0, 48));
                text.push(long_text.substr(48, long_text.length));
              } else {

                text.push(long_text);
              }

              in_c = h;

              y += 120;

              for (var z = 0; z < text.length; z++) {

                doc.text(text[z], x, y + (z * 12));
              }

              text = [];
              x += 200;
              y = 17;
            } else { //Nuevo elemento en la columna

              y += 120;

              if (h == shoes[i]['quantity']) {

                long_text = shoes[i]['reference'] + ' | ' + shoes[i]['brand'] +
                  ' | ' + shoes[i]['color'] + ' | ' + shoes[i]['size'] +
                  ' | ' + (h - in_c);

                if (long_text.length > 48) {

                  text.push(long_text.substr(0, 48));
                  text.push(long_text.substr(48, long_text.length));
                } else {

                  text.push(long_text);
                }
              }
              //Si ya no quedan mas elementos, por ejemplo una columna de 4 elementos en vez de completa(6 elementos)
              if (j == total_length) {

                for (var k = 0; k < text.length; k++) {

                  doc.text(text[k], x, y + (k * 12));
                }

                doc
                  .moveTo(199, 0).lineTo(199, 850).dash(3, {
                    space: 5
                  }).stroke()
                  .moveTo(399, 0).lineTo(399, 850).dash(3, {
                    space: 5
                  }).stroke()
                  .moveTo(0, 125).lineTo(600, 125).dash(3, {
                    space: 5
                  }).stroke()
                  .moveTo(0, 245).lineTo(600, 245).dash(3, {
                    space: 5
                  }).stroke()
                  .moveTo(0, 365).lineTo(600, 365).dash(3, {
                    space: 5
                  }).stroke()
                  .moveTo(0, 485).lineTo(600, 485).dash(3, {
                    space: 5
                  }).stroke()
                  .moveTo(0, 605).lineTo(600, 605).dash(3, {
                    space: 5
                  }).stroke()
                  .moveTo(0, 725).lineTo(600, 725).dash(3, {
                    space: 5
                  }).stroke();
              }
            }

            //Nuevo página
            if (j % 18 == 0) {

              doc
                .moveTo(199, 0).lineTo(199, 850).dash(3, {
                  space: 5
                }).stroke()
                .moveTo(399, 0).lineTo(399, 850).dash(3, {
                  space: 5
                }).stroke()
                .moveTo(0, 125).lineTo(600, 125).dash(3, {
                  space: 5
                }).stroke()
                .moveTo(0, 245).lineTo(600, 245).dash(3, {
                  space: 5
                }).stroke()
                .moveTo(0, 365).lineTo(600, 365).dash(3, {
                  space: 5
                }).stroke()
                .moveTo(0, 485).lineTo(600, 485).dash(3, {
                  space: 5
                }).stroke()
                .moveTo(0, 605).lineTo(600, 605).dash(3, {
                  space: 5
                }).stroke()
                .moveTo(0, 725).lineTo(600, 725).dash(3, {
                  space: 5
                }).stroke();

              doc.addPage();
              text = [];
              x = 9;
              y = 17;
            }
          }

          t += shoes[i]['quantity'];
        }

        doc.write(path + 'zapatos_barcodes.pdf', function() {

          res.send(true);
        });

        /*doc.output(function(pdf){

                res.attachment('zapatos_barcodes.pdf');
                res.setHeader('Content-Type', 'text/pdf');
                res.end(pdf,'binary');
            })*/

      });
  } else {

    stockLogger.debug('User not authorised in method exportShoesPdf');
    res.send(401);
  }
};

exports.getShoesFields = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {

    var data = req.body;

    shoesDB
      .distinct(data['field'])
      .exec(function(err, field) {

        if (err) {

          stockLogger.error('Error getShoesFields method', err);
          return next(err);
        }

        /*var matches = [];

            for(var i=0;i<references.length;i++)
            {
                if(references[i].indexOf(data['ref']) > -1)
                    matches.push(references[i]);
            }

            res.send(matches);*/
        res.send(field);
      });
  } else {

    stockLogger.debug('User not authorised in method getShoesFields');
    res.send(401);
  }
};

exports.removeShoe = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {

    shoesDB
      .remove({
        _id: req.body.id
      }, function(err) {

        if (err) {

          stockLogger.error('Error removeShoe method', err);
          return next(err);
        }

        res.send(true);
        //req.body.field = 'reference';
        //return exports.GetShoesFields(req,res,next);
      });
  } else {

    stockLogger.debug('User not authorised in method removeShoe');
    res.send(401);
  }
};

exports.getQR = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {

    var data = req.body;

    if (data['has_qr']) {

      shoesDB
        .findById(data['id'], {
          qr: 1
        }, function(err, item) {

          if (err) {

            stockLogger.error('Error getQR method', err);
            return next(err);
          }

          res.send({
            qr: item.qr
          });
        });
    } else {

      QRCode.toDataURL('http://www.kalzate.es/qr/zapatos/ver/' + data['id'],
        function(err, dataURL) {

          if (err) {

            stockLogger.error('Error getQR method', err);
            return next(err);
          }

          shoesDB
            .findByIdAndUpdate(data['id'], {
              $set: {
                'qr': dataURL,
                'has_qr': true
              }
            }, function(err, item) {

              if (err) {

                stockLogger.error('Error getQR method', err);
                return next(err);
              }

              res.send({
                qr: item.qr
              });
            });
        });
    }
  } else {

    stockLogger.debug('User not authorised in method getQR');
    res.send(401);
  }
};

exports.getBarCode = function(req, res, next) {

  if (req.user && req.user.role == 'employee') {

    var bc = req.body['barcode'],
      path = __dirname + '/../../../client/app/barcodes/' + bc + '.png',
      buf = (new Barc({
        fontsize: '16px'
      })).code128(bc, 210, 110);

    fs.writeFile(path, buf, function(err) {

      if (err) {

        stockLogger.error('Error getBarCode method', err);
        return res.send(404);
      }

      var base64data = new Buffer(buf).toString('base64');

      res.send("data:image/png;base64," + base64data);
    });
  } else {

    stockLogger.debug('User not authorised in method getBarCode');
    res.send(401);
  }
};