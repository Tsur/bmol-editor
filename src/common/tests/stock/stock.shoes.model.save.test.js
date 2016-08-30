'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  settings = require('config'),
  Stock = mongoose.model('Stock');

/**
 * Globals
 */
var shoes, shoes_same, shoes_same_BSC_different_R, shoes_same_RSC_different_B, shoes_same_RBS_different_C, shoes_same_RBC_different_S, shoes_reference, shoes_brand, shoes_price, shoes_quantity, shoes_size, shoes_color, shoes_color2;

/**
 * Unit tests
 */
describe('Stock Model', function() {

  before(function(done) {

    shoes = new Stock({

      reference: '1111111111',
      brand: '1111111111',
      size: {
        zone: 'europe',
        value: '35'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'girl'

    });

    shoes_same = new Stock({

      reference: '1111111111',
      brand: '1111111111',
      size: {
        zone: 'europe',
        value: '35'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'girl'

    });

    shoes_same_BSC_different_R = new Stock({

      reference: '1111111112',
      brand: '1111111111',
      size: {
        zone: 'europe',
        value: '35'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'girl'

    });

    shoes_same_RSC_different_B = new Stock({

      reference: '1111111111',
      brand: '1111111112',
      size: {
        zone: 'europe',
        value: '35'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'girl'

    });

    shoes_same_RBS_different_C = new Stock({

      reference: '1111111111',
      brand: '1111111111',
      size: {
        zone: 'europe',
        value: '35'
      },
      color: ['white', 'blue'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'girl'

    });

    shoes_same_RBC_different_S = new Stock({

      reference: '1111111111',
      brand: '1111111111',
      size: {
        zone: 'europe',
        value: '36'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'girl'

    });

    shoes_reference = new Stock({

      reference: 'referenceA',
      brand: '111111111',
      size: {
        zone: 'europe',
        value: '35.5'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'men'

    });

    shoes_brand = new Stock({

      reference: 'brand111111111',
      brand: '',
      size: {
        zone: 'europe',
        value: '35.5'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'men'

    });

    shoes_price = new Stock({

      reference: 'price111111111',
      brand: '1111111111',
      size: {
        zone: 'europe',
        value: '35.5'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'men'
    });

    shoes_quantity = new Stock({

      reference: 'quantity111111111',
      brand: '1111111111',
      size: {
        zone: 'europe',
        value: '35.5'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'men'
    });

    shoes_size = new Stock({

      reference: 'size111111111',
      brand: '1111111111',
      size: {
        zone: 'europe',
        value: '35.5'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'men'
    });

    shoes_color = new Stock({

      reference: 'color111111111',
      brand: '1111111111',
      size: {
        zone: 'europe',
        value: '35.5'
      },
      color: ['white', 'black'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'men'
    });

    shoes_color2 = new Stock({

      reference: 'color111111111',
      brand: '1111111111',
      size: {
        zone: 'europe',
        value: '35.5'
      },
      color: ['black', 'white'],
      price: {
        'EUR': 10
      },
      quantity: 1,
      category: 'men'
    });

    done();
  });

  describe('basics actions', function() {

    // basics
    it('should begin with empty stock', function(done) {
      return Stock.find({}, function(err, shoes) {
        shoes.should.have.length(0);
        done();
      });
    });

    it('should success to create a shoes stock if minimun required fields are provided and not existing before', function(
      done) {
      return shoes.save(done);
    });

    it('should fail to create an existing shoes stock(same reference, brand, color and size)', function(done) {
      return shoes_same.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should success when trying to create shoes with same brand, color and size but diferent reference',
      function(done) {
        return shoes_same_BSC_different_R.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

    it('should success when trying to create shoes with same reference, color and size but diferent brand',
      function(done) {
        return shoes_same_RSC_different_B.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

    it('should success when trying to create shoes with same reference, brand and size but diferent color',
      function(done) {
        return shoes_same_RBS_different_C.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

    it('should success when trying to create shoes with same reference, brand and color but diferent size',
      function(done) {
        return shoes_same_RBC_different_S.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

  });

  describe('Reference field', function() {

    it('should fail when trying to create shoes without reference',
      function(done) {
        shoes_reference.reference = null;
        return shoes_reference.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with empty reference',
      function(done) {
        shoes_reference.reference = '';
        return shoes_reference.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with wrong reference: Length < ReferenceMinLength',
      function(done) {
        shoes_reference.reference = '1';
        return shoes_reference.save(function(err, shoes) {
          should.exist(err);
          done();
        });
      });

    it('should success when trying to create shoes with right reference: Length >= ReferenceMinLength',
      function(done) {
        shoes_reference.reference = '1111';
        return shoes_reference.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

  });

  describe('Brand field', function() {

    it('should fail when trying to create shoes without brand',
      function(done) {
        shoes_brand.brand = null;
        return shoes_brand.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with empty brand',
      function(done) {
        shoes_brand.brand = '';
        return shoes_brand.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with wrong brand: Length < BrandMinLength',
      function(done) {
        shoes_brand.brand = '1';
        return shoes_brand.save(function(err, shoes) {
          should.exist(err);
          done();
        });
      });

    it('should success when trying to create shoes with right brand: Length >= BrandMinLength',
      function(done) {
        shoes_brand.brand = '1111';
        return shoes_brand.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

  });

  describe('Price field', function() {

    it('should fail when trying to create shoes without price',
      function(done) {
        shoes_price.price = null;
        return shoes_price.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with empty price',
      function(done) {
        shoes_price.price = '';
        return shoes_price.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with wrong price: value is a string, not a number',
      function(done) {
        shoes_price.price = {
          'EUR': '10asds2'
        };
        return shoes_price.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with wrong price: value is negative',
      function(done) {
        shoes_price.price = {
          'EUR': -10
        };
        return shoes_price.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should success when trying to create shoes with right price',
      function(done) {
        shoes_price.price = {
          'EUR': 10
        };
        return shoes_price.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

  });

  describe('Quantity field', function() {

    it('should fail when trying to create shoes without quantity',
      function(done) {
        shoes_quantity.quantity = null;
        return shoes_quantity.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with empty quantity',
      function(done) {
        shoes_quantity.quantity = '';
        return shoes_quantity.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with negative quantity',
      function(done) {
        shoes_quantity.quantity = -2;
        return shoes_quantity.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with float quantity',
      function(done) {
        shoes_quantity.quantity = 2.5;
        return shoes_quantity.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with wrong quantity: a not numbered string',
      function(done) {
        shoes_quantity.quantity = 'one';
        return shoes_quantity.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should success when trying to create shoes with right quantity: greater than zero',
      function(done) {
        shoes_quantity.reference = 'quantity0';
        shoes_quantity.quantity = 1;
        return shoes_quantity.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

    it('should success when trying to create shoes with right quantity: numbered string',
      function(done) {
        shoes_quantity.reference = 'quantity1';
        shoes_quantity.quantity = '1';
        return shoes_quantity.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

    it('should success when trying to create shoes with right quantity: zero',
      function(done) {
        shoes_quantity.reference = 'quantity2';
        shoes_quantity.quantity = 0;
        return shoes_quantity.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });
  });

  describe('Size field', function() {

    it('should fail when trying to create shoes without size',
      function(done) {
        shoes_size.size = null;
        return shoes_size.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with empty size',
      function(done) {
        shoes_size.size = '';
        return shoes_size.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with empty object as size',
      function(done) {
        shoes_size.size = {};
        return shoes_size.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with no zone',
      function(done) {
        shoes_size.size = {
          value: 35,
        };
        return shoes_size.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with negative size',
      function(done) {
        shoes_size.size = {
          value: -35,
          zone: 'europe'
        };
        return shoes_size.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with wrong size: size as string',
      function(done) {
        shoes_size.size = {
          value: 'ten',
          zone: 'europe'
        };
        return shoes_size.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should success when trying to create shoes with right size: positive string number',
      function(done) {
        shoes_size.size = {
          value: '35',
          zone: 'europe'
        };
        return shoes_size.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

    it('should success when trying to create shoes with right size: positive number',
      function(done) {
        shoes_size.size = {
          value: 35,
          zone: 'europe'
        };
        return shoes_size.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

  });

  describe('Color field', function() {

    it('should fail when trying to create shoes without color',
      function(done) {
        shoes_color.color = null;
        return shoes_color.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with empty color',
      function(done) {
        shoes_color.color = '';
        return shoes_color.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with wrong color format: a number',
      function(done) {
        shoes_color.color = 1;
        return shoes_color.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create shoes with unknown color',
      function(done) {
        shoes_color.color = ['unknown'];
        return shoes_color.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should success when trying to create shoes with right color format: array',
      function(done) {
        shoes_color.color = ['white', 'black', 'yellow'];
        return shoes_color.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

    it('should fail when trying to create shoes with same color but different order',
      function(done) {
        shoes_color2.color = ['black', 'yellow', 'white'];
        return shoes_color2.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should success when trying to create shoes with right color format and color is a subset of other already saved shoes',
      function(done) {
        shoes_color2.color = ['white', 'black'];
        return shoes_color2.save(function(err, shoes) {
          should.not.exist(err);
          should.exist(shoes);
          done();
        });
      });

  });

  after(function(done) {
    Stock.remove().exec();
    done();
  });
});