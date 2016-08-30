'use strict';

/**
 * Module dependencies.
 */
 import mongoose from 'mongoose';
 import _ from 'lodash';
 import settings from '../../settings/init';

 const Schema = mongoose.Schema;

/**
 * A random barcode generator function for identifying a single stock element
 */
var generateBarcode = function() {

  var fmt = 'xxxxxxxxx-xx';
  return fmt.replace(/[x]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16).toUpperCase();
  });
};

/**
 * A Validation function for reference field
 */
var validateReference = function(reference) {

  // It validates if return true
  return (reference && reference.length >= settings.get('stock.shoes.ReferenceMinLength'));
};

/**
 * A Validation function for brand field
 */
var validateBrand = function(brand) {

  // It validates if return true
  return (brand && brand.length >= settings.get('stock.shoes.BrandMinLength'));
};

/**
 * A Validation function for price field
 */
var validatePrice = function(price) {

  var isPositiveNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && typeof n === 'number' && n > 0;
  };

  // It validates if return true
  return (!_.isEmpty(price) && _.values(price).every(function(e) {
    return isPositiveNumber(e);
  }));
};

/**
 * A Validation function for qty field
 */
var validateQty = function(qty) {

  var isIntNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && n % 1 === 0;
  };

  // It validates if return true
  return isIntNumber(qty) && qty >= 0;
};

/**
 * A Validation function for size field
 */
var validateSize = function(size) {

  var isPositiveNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n) && n > 0;
  };

  // It validates if return true
  return (!_.isEmpty(size) && size.zone && typeof size.zone === 'string' && size.zone != '' && size.value && isPositiveNumber(size.value));
};

/**
 * A Validation function for color field
 * X11 Colors Code
 * (http://en.wikipedia.org/wiki/List_of_colors:_A%E2%80%93F)
 */
var validateColor = function(color) {

  const isArray = arr => _.isArray(arr) && !_.isEmpty(arr);

  // It validates if return true
  return isArray(color) &&
    color.every(color => _.isString(color) && settings.get('stock.colors').indexOf(color.toLowerCase()) > -1);
};

/**
 * Stock Schema.
 */
var stockSchema = new Schema({

  'reference': {

    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true,
    validate: [validateReference, 'Reference should be longer']
  },

  'brand': {

    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true,
    validate: [validateBrand, 'Brand should be longer']
  },

  // i.e. size = {zone:'europe', value:'35'}
  'size': {

    type: Object,
    required: true,
    index: true,
    validate: [validateSize, 'Size does not validate. It should be an object with zone as key and size as value. Size value should be a number greater than zero.']
  },

  'color': {

    type: Array,
    required: true,
    index: true,
    validate: [validateColor, 'Color does not validate. It should be an array of strings as colors']
  },

  // i.e. price = {'EUR': 15.95}
  'price': {

    type: Object,
    required: true,
    index: true,
    validate: [validatePrice, 'Price does not validate. It should be an object with currency as key and price as value']
  },

  'quantity': {

    type: Number,
    required: true,
    trim: true,
    default: 1,
    validate: [validateQty, 'Quantity should be a number greater or equal than zero.']
  },

  'category': {

    type: String,
    required: true,
    uppercase: true,
    trim: true
  },

  'season': {

    type: String
  },

  'maker': {

    type: String
  },

  'provider': {

    type: String
  },

  'pictures': [],

  'storeLocation': {

    type: String
  },

  // Aka reserved ??
  // 'sold': {

  //   type: Number,
  //   default: 0
  // },

  'qr': {

    type: String,
    default: false
  },

  'barcode': {

    type: String,
    index: true,
    unique: true,
    default: function() {
      return generateBarcode();
    }
  },
  'description': {

    type: String
  },

  'history': [

    {
      action: String,
      date: Date,
      employee: String
    }
  ],

  'valoration': {

    'voters': [String],
    'votesUp': {
      type: Number,
      default: 0
    },
    'votesDown': {
      type: Number,
      default: 0
    }
  },

  'actived': {

    type: Boolean,
    default: true
  },

  'keywords': [String],

  'comments': [

    {
      text: String,
      date: Date,
      employee: String
    }
  ],

  'lastModified': {

    type: Date,
    default: Date.now
  },

  // This item is about to be sold, aka it is in a cart session or ticket
  '_carts': []
});


/**
 * Validate barcode
 * @todo the reference, brand, size & color validation should not be here, but it is the only better available place to set this since if we set this validation into its most right place, in the pre save hook method, it only has effect when saving but no when updating. There is no hook for updating ...
 */
stockSchema.path('barcode').validate(function(b, validated) {

  var model = this.model(this.constructor.modelName);

  if (!this.reference || !this.brand || !this.size || !this.size.zone || !this.size.value || !this.color || !validateColor(this.color)) {
    return validated(false);
  }

  if (this.color) {

    // Remove duplicates and sort
    this.color = _.uniq(this.color, true);
    this.color.sort();
  }

  var query = {

    'reference': this.reference,
    'brand': this.brand,
    'size.zone': this.size.zone,
    'size.value': this.size.value,
    'color': this.color
  };

  model.findOne(query, function(err, stock) {

    if (err || stock) {
      return validated(false);
    }

    validated(true);

  });

}, 'This sotck is already in database');

export default mongoose.model('Stock', stockSchema);
