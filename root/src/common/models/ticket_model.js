'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * A random code generator function for identifying tickets
 */
var generateRandomCode = function() {

    var fmt = 'xxxxxxxxxx';
    return fmt.replace(/[x]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16).toUpperCase();
    });
}

/**
 * Ticket Schema.
 * Note: Mongo saves the date using the ISO standard, which does not include the GTM time(for instance in Spain GTM time is +2). It means you need to translate date to GTM after presenting it to the user (in browser Javascript you can use 'toLocalDate' function)
 *
 */
var ticketSchema = new Schema({

    'code': {

        type:String, 
        required:true, 
        unique:true, 
        index:true, 
        default: function(){ return generateRandomCode(); }
    },
    'date': {

        type:Date, 
        required:true, 
        default: new Date()
    },
    'date_end': {

        type:Date
    },
    'status': {

        type:String, 
        required:true, 
        index:true, 
        trim: true, 
        uppercase: true, 
        default:'EXPIRING'
    },
    'employee': {

        type:String, 
        required:true, 
        trim: true
    },
    'employee_id': {

        type:String, 
        required:true
    },
    'products': {

        type:Array
    },
    'overview': {

        type:Object
    },
    'print': {

        type:String
    },
    'visible': {

        type:Boolean, 
        default:true, 
        required: true
    },
    'box': {

    }
});

module.exports = exports = mongoose.model('Ticket', ticketSchema);
