var _ = require('lodash');
var Common = require('./common');

exports.compare = function(pred) {

  pred = _.isString(pred) ? exports[pred] : pred;

  return function(x, y) {

    if (Common.truthy(pred(x, y))) {

      return -1;

    } else if (Common.truthy(pred(y, x))) {

      return 1;

    } else {

      return 0;
    }

  };

};

/* Comparators.js 1.1.0 
 * http://spencerwi.github.io/Comparators.js
 * (c) 2014 Spencer Williams
 * Comparators.js may be freely distributed under the MIT license. */
exports.comparing = function(attrOrFunction, opts) {

  var reversed = (opts && opts.reversed);

  var comparatorFunction = function(firstItem, secondItem) {

    var result, comparisonValueOfFirstItem, comparisonValueOfSecondItem;

    if (typeof attrOrFunction === "function") {

      comparisonValueOfFirstItem = attrOrFunction(firstItem);
      comparisonValueOfSecondItem = attrOrFunction(secondItem);

    } else {

      comparisonValueOfFirstItem = firstItem[attrOrFunction];
      comparisonValueOfSecondItem = secondItem[attrOrFunction];

    }

    if (comparisonValueOfFirstItem > comparisonValueOfSecondItem) {

      if (reversed) {

        result = -1;

      } else {

        result = 1;

      }

    } else if (comparisonValueOfFirstItem < comparisonValueOfSecondItem) {

      if (reversed) {

        result = 1;

      } else {

        result = -1;

      }

    } else {

      if (comparatorFunction.nextStep != undefined) {

        result = comparatorFunction.nextStep(firstItem, secondItem);

      } else {

        result = 0;

      }

    }

    return result;

  };

  var lastStepInComparisonChain = comparatorFunction;

  comparatorFunction.thenComparing = function(attrOrFunction) {

    lastStepInComparisonChain = lastStepInComparisonChain.nextStep = buildComparisonStep(attrOrFunction);

    return this;

  }

  return comparatorFunction;

};

exports.lessOrEqual = function(x, y) {

  return x <= y;

};

exports.equal = exports.eql = function(x, y) {

  return x == y;

};

exports.exactlyEqual = exports.xeql = function(x, y) {

  return x == y && x === y;

};