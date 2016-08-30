'use strict';

/**
 * Module dependencies.
 */
var should = require('should');
var mongoose = require('mongoose');
var settings = require('config');
var User = mongoose.model('User');

/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Model', function() {

  before(function(done) {

    user = new User({
      firstname: 'user',
      lastname: 'name',
      username: 'user.name',
      email: 'test@test.com',
      password: 'password',
      role: 'role',
      _provider: 'local'
    });

    user2 = new User({
      firstname: 'user',
      lastname: 'name',
      username: 'user.name',
      email: 'test@test.com',
      password: 'password',
      role: 'role',
      _provider: 'local'
    });

    done();
  });

  describe('Method Save(aka create)', function() {

    // basics
    it('should begin with no users', function(done) {
      return User.find({}, function(err, users) {
        users.should.have.length(0);
        done();
      });
    });

    it('should success to create an user if not existing before', function(
      done) {
      return user.save(done);
    });

    it('should fail to create an existing user', function(done) {
      return user2.save(function(err) {
        should.exist(err);
        done();
      });
    });

    // firstname field
    it('should fail when trying to create an user without firstname',
      function(done) {
        user.firstname = null;
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create an user with empty firstname',
      function(done) {
        user.firstname = '';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong firstname: LETTERS AND NUMBERS',
      function(done) {
        user.firstname = '97firstname12312';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong firstname: STRANGE SYMBOLS',
      function(done) {
        user.firstname = '|@#~|@.casd';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should success when trying to create an user with right firstname: ONE WORD',
      function(done) {
        user.firstname = 'firstname';
        return user.save(function(err, user_saved) {
          should.not.exist(err);
          should.exist(user_saved);
          done();
        });
      });

    it(
      'should success when trying to create an user with right firstname: SEVERAL WORDS',
      function(done) {
        user.firstname = 'first name';
        return user.save(function(err, user_saved) {
          should.not.exist(err);
          should.exist(user_saved);
          done();
        });
      });

    // lastname field
    // it('should fail when trying to create an user without lastname',
    //   function(done) {
    //     user.lastname = null;
    //     return user.save(function(err) {
    //       should.exist(err);
    //       done();
    //     });
    //   });

    // it('should fail when trying to create an user with empty lastname',
    //   function(done) {
    //     user.lastname = '';
    //     return user.save(function(err) {
    //       should.exist(err);
    //       done();
    //     });
    //   });

    it(
      'should fail when trying to create an user with wrong lastname: LETTERS AND NUMBERS',
      function(done) {
        user.lastname = '97lastname12312';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong lastname: STRANGE SYMBOLS',
      function(done) {
        user.lastname = '|@#~|@.casd';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should success when trying to create an user with right lastname: ONE WORD',
      function(done) {
        user.lastname = 'lastname';
        return user.save(function(err, user_saved) {
          should.not.exist(err);
          should.exist(user_saved);
          done();
        });
      });

    it(
      'should success when trying to create an user with right lastname: SEVERAL WORDS',
      function(done) {
        user.lastname = 'last name';
        return user.save(function(err, user_saved) {
          should.not.exist(err);
          should.exist(user_saved);
          done();
        });
      });

    // username field
    it('should fail when trying to create an user without username',
      function(done) {
        user.username = null;
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create an user with empty username',
      function(done) {
        user.username = '';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    // it('should fail when trying to create an user with wrong username: NO DOT', function(done) {
    //     user.username = 'username';
    //     return user.save(function(err) {
    //         should.exist(err);
    //         done();
    //     });
    // });

    it(
      'should fail when trying to create an user with wrong username: STRANGE SYMBOLS',
      function(done) {
        user.username = '#~|@#.#~@#~';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong username: NOTHING AFTER DOT',
      function(done) {
        user.username = 'name.';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong username: NOTHING BEFORE DOT',
      function(done) {
        user.username = '.surname';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong username: JUST A DOT',
      function(done) {
        user.username = '.';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong username: MORE THAN ONE DOT',
      function(done) {
        user.username = 'user.nam.e';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong username: LETTERS AND NUMBERS',
      function(done) {
        user.username = 'user57.name009';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should success when trying to create an user with right username: ONLY LETTERS',
      function(done) {
        user.username = 'user.name';
        return user.save(function(err, user_saved) {
          should.not.exist(err);
          should.exist(user_saved);
          (user_saved.username).should.eql(user.username);
          done();
        });
      });

    // email field
    it('should fail when trying to create an user without email', function(
      done) {
      user.email = null;
      return user.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should fail when trying to create an user with empty email',
      function(done) {
        user.email = '';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong email: NO DOMAIN',
      function(done) {
        user.email = 'email@email';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should success when trying to create an user with right email',
      function(done) {
        user.email = 'email@email.com';
        return user.save(function(err, user) {
          should.not.exist(err);
          should.exist(user);
          done();
        });
      });

    // password field
    it('should fail when trying to create an user without password',
      function(done) {
        user.password = null;
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it('should fail when trying to create an user with empty password',
      function(done) {
        user.password = '';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong password: LESS THAN ' +
      settings.get('user.signup.minimunPasswordLength') + ' CHARACTERS',
      function(done) {
        user.password = '1234567';
        return user.save(function(err, user_saved) {
          should.exist(err);
          done();
        });
      });

    it('should success when trying to create an user with right password',
      function(done) {
        user.password = '12345678';
        return user.save(function(err, user_saved) {
          should.not.exist(err);
          should.exist(user_saved);
          (user_saved.password).should.not.eql('12345678');
          done();
        });
      });

    // role field
    it('should fail when trying to create an user without role', function(
      done) {
      user.role = null;
      return user.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should fail when trying to create an user with empty role',
      function(done) {
        user.role = '';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong role: LETTERS AND NUMBERS',
      function(done) {
        user.role = '97role12312';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong role: STRANGE SYMBOLS',
      function(done) {
        user.role = '|@#~|@.casd';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should fail when trying to create an user with wrong role: SEVERAL WORDS',
      function(done) {
        user.role = 'role1 role2';
        return user.save(function(err) {
          should.exist(err);
          done();
        });
      });

    it(
      'should success when trying to create an user with right role: ONE WORD',
      function(done) {
        user.role = 'role';
        return user.save(function(err, user_saved) {
          should.not.exist(err);
          should.exist(user_saved);
          done();
        });
      });
  });

  after(function(done) {
    User.remove().exec();
    done();
  });
});