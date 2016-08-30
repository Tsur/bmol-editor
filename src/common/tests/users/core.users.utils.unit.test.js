'use strict';

/**
 * Module dependencies.
 */
var should = require('should');
var utils = require('kalzate/server/lib/user_utils');
// var utils = require('../../lib/user_utils');
/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Utils', function() {

  before(function() {

  });

  describe('Method parseFullName', function() {

    it('should return empty object if no argument is given', function() {

      var fullname = utils.parseFullName();

      fullname.should.be.an.Object;
      fullname.should.be.empty;

    });

    it('should return empty object if null is given', function() {

      var fullname = utils.parseFullName(null);

      fullname.should.be.an.Object;
      fullname.should.be.empty;
    });

    it('should return empty object if empty string is given', function() {

      var fullname = utils.parseFullName('');

      fullname.should.be.an.Object;
      fullname.should.be.empty;
    });

    it('should not return empty object if one word string is given',
      function() {

        var fullname = utils.parseFullName('fullname');

        fullname.should.be.an.Object;
        fullname.should.not.be.empty;
      });

    it('should sucess if right data is given: at least two words', function() {

      var fullname = utils.parseFullName('full name');

      fullname.should.be.an.Object;
      fullname.should.not.be.empty;

      fullname.should.have.properties({
        firstname: 'Full',
        lastname: 'Name',
        username: 'full.name'
      });
    });

    it('should sucess if right data is given: more than two words',
      function() {

        var fullname = utils.parseFullName('full name1 name2');

        fullname.should.be.an.Object;
        fullname.should.not.be.empty;

        fullname.should.have.properties({
          firstname: 'Full',
          lastname: 'Name1 Name2',
          username: 'full.name1name2'
        });
      });

    it('should sucess if right data is given: lower & upper cases',
      function() {

        var fullname = utils.parseFullName('fUlL nAMe1 NamE2');

        fullname.should.be.an.Object;
        fullname.should.not.be.empty;

        fullname.should.have.properties({
          firstname: 'Full',
          lastname: 'Name1 Name2',
          username: 'full.name1name2'
        });
      });

    it('should sucess if right data is given: diacritics characters',
      function() {

        var fullname = utils.parseFullName('fÚlL nÁMé1 ŃämÊ2');

        fullname.should.be.an.Object;
        fullname.should.not.be.empty;

        fullname.should.have.properties({
          firstname: 'Full',
          lastname: 'Name1 Name2',
          username: 'full.name1name2'
        });
      });

    it(
      'should sucess if right data is given: comman separated firstname & lastname',
      function() {

        var fullname = utils.parseFullName('fÚlL nÁMé1, ŃämÊ2');

        fullname.should.be.an.Object;
        fullname.should.not.be.empty;

        fullname.should.have.properties({
          firstname: 'Full Name1',
          lastname: 'Name2',
          username: 'fullname1.name2'
        });
      });

  });

  describe('Method generateRandomCode', function() {

    it('should return random code according to pattern', function() {

      var pattern = 'nnn';
      var code = utils.generateRandomCode(pattern);

      code.should.be.type('string');
      code.should.have.length(3);
      parseInt(code).should.not.be.NaN;
    });

  });

  after(function() {

  });
});