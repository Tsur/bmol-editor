var _ = require('lodash');
var Q = require('q');

var config = require('config');
var ratesDB = require('../../models/rates_model');
var balancesDB = require('../../models/balance_model');

var Autoservice = function(department) {

    this.department = department;

};

// service areas constants
Autoservice.RATES = 1;
Autoservice.BALANCES = 2;

// Factory 
Autoservice.department = function(department) {

    return new Autoservice(department);

};

Autoservice.prototype.process = function(ticket, fn) {

    _getModel(this.department).findByIdAndRemove(ticket, function(err, result) {

        err ? fn(err) : fn(null, result);

    });

};

Autoservice.prototype.send = function(data, fn) {

    try {

        if (!_.isObject(data) || _.isEmpty(data)) {

            return fn(true);

        }

        var instance = new _getModel(this.department)(data);

        instance.save(function(err, result) {

            return err ? fn(err || true) : fn(false, result._id);

        });

    } catch (err) {

        fn(err || true);

    }

};

var _getModel = function(model) {

    switch (model) {

        case Autoservice.RATES:
            return ratesDB;

        case Autoservice.BALANCES:
            return balancesDB;

        default:
            return ratesDB;

    }

};

module.exports = exports = Autoservice;