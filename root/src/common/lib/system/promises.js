var Q = require('q');
var _ = require('lodash');
var Common = require('./common');

exports.create = function() {

  var promise = Q.defer();

  promise.promise.no = function(result) {

    promise.reject(result);
    return promise.promise;

  };

  promise.promise.yes = function(result) {

    promise.resolve(result);
    return promise.promise;

  };

  promise.promise.fulfil = function() {

    var result = arguments[0];

    if (arguments.length > 1) {

      if (arguments[0]) {

        return promise.reject('No result was found');

      }

      result = arguments[1];

    }

    Common.truthy(result) ? promise.resolve(result) : promise.reject('Promise not truthy value');

  };

  // promise.promise.you = promise.promise.doit;
  // promise.promise.iPromiseYou = promise.promise.doit;

  return promise.promise;
};

exports.anyOf = function() {

  var fns = _.toArray(arguments);

  var run = function(i) {

    if (i == fns.length - 1) {

      return fns[fns.length - 1](false);

    }

    fns[i]
      .then(function(result) {

        if (result) {

          fns[fns.length - 1](result);

        } else {

          run(i + 1);
        }

      })
      .fail(function() {

        run(i + 1);

      });

  };

  run(0);

};

exports.resolve = function(promises) {

  if (!_.isArray(promises)) {

    throw new Error('promises has to be an Array');

  }

  return Q.all(promises);

}