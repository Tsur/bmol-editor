'use strict';

var settings = require('config');
var should = require('should');
var mongoose = require('mongoose');
var User = mongoose.model('User');
//require('assert')
var request = require('supertest').agent('http://localhost:' + settings.get(
  'port')); //(app)

/**************************************************************************

Test Suite 
 
**************************************************************************/
describe('User REST API methods', function() {

  var forgot_url = '/api/user/password/forgot';
  var signup_url = '/api/user/signup';
  var signin_url = '/api/user/signin';
  var signout_url = '/api/user/signout';

  // Set max timeout to 20 seconds
  this.timeout(20000);

  before(function(done) {

    // Give it time to the server for kicking off
    setTimeout(function() {

      done();

    }, 3000);

  });

  describe('URL: /api/user/signup', function() {

    it('POST method: no data given', function(done) {

      request
        .post(signup_url)
        .expect(400, done);

    });

    it('POST method: no email given', function(done) {

      request
        .post(signup_url)
        .send({
          fullname: 'full name'
        })
        .expect(400, done);

    });

    it('POST method: no fullname given', function(done) {

      request
        .post(signup_url)
        .send({
          email: 'email@email.com'
        })
        .expect(400, done);

    });

    it('POST method: wrong fullname given: strange symbols', function(done) {

      request
        .post(signup_url)
        .send({
          email: 'email@email.com',
          fullname: 'f"$·&/_}2,;:ul 23l'
        })
        .expect(400, done);

    });

    it('POST method: no lastname required', function(done) {

      // Create new agent. Otherwise it will give 401 error as it keeps session cookie
      var agent = require('supertest').agent('http://localhost:' +
        settings.get('port'));

      agent
        .post(signup_url)
        .send({
          email: 'email_no_last_name@email.com',
          fullname: 'nolastname'
        })
        .expect(200, done);

    });

    it('POST method: right data given', function(done) {

      request
        .post(signup_url)
        .send({
          email: 'email@email.com',
          fullname: 'full name'
        })
        .end(function(err, res) {

          res.status.should.equal(200);

          should.exist(res.body);
          should.not.exist(res.body['password']);
          should.not.exist(res.body['_salt']);
          (res.text).should.not.containDeep('password');
          (res.text).should.not.containDeep('_salt');

          res.body['email'].should.eql('email@email.com');
          res.body['firstname'].should.eql('Full');
          res.body['lastname'].should.eql('Name');
          res.body['username'].should.eql('full.name');
          res.body['role'].should.eql('employee');

          done();

        });

    });

    it('should not allow signup after a signin', function(done) {

      //The last test signed up and at same time it was signed in
      request
        .post(signup_url)
        .send({
          email: 'email@email.com',
          fullname: 'full name'
        })
        .expect(401, done);

    });

    after(function() {

      User.remove().exec();

    });

  });

  describe('URLs: /api/user/signin , /api/user/signout', function() {

    var user;
    var user_credentials = {
      password: 'password',
      email: 'email@email.com'
    };

    before(function(done) {

      user = new User({
        firstname: 'User',
        lastname: 'Name',
        username: 'user.name',
        email: user_credentials.email,
        password: user_credentials.password,
        role: 'employee',
        _provider: 'local'
      });

      user.save(done);
    });

    it('POST method: no data given', function(done) {

      request
        .post(signin_url)
        .expect(400, done);

    });

    it('POST method: no email/username given', function(done) {

      request
        .post(signin_url)
        .send({
          password: user_credentials.password
        })
        .expect(400, done);

    });

    it('POST method: no password given', function(done) {

      request
        .post(signin_url)
        .send({
          email: user_credentials.email
        })
        .expect(400, done);

    });

    it(
      'POST method: wrong credentials given: right password and wrong email',
      function(done) {

        request
          .post(signin_url)
          .send({
            email: 'email2@email.com',
            password: user_credentials.password
          })
          .expect(400, done);

      });

    it(
      'POST method: wrong credentials given: right email and wrong password',
      function(done) {

        request
          .post(signin_url)
          .send({
            email: user_credentials.email,
            password: 'password2'
          })
          .expect(400, done);

      });

    it(
      'POST method: wrong credentials given: wrong email and wrong password',
      function(done) {

        request
          .post(signin_url)
          .send({
            email: 'email2@email.com',
            password: 'password2'
          })
          .expect(400, done);

      });

    it('POST method: right identifier and right password', function(done) {

      request
        .post(signin_url)
        .send(user_credentials)
        .set('user-agent', 'test-user-agent')
        .end(function(err, res) {

          res.status.should.equal(200);

          // Make sure no sensitive data is received
          should.exist(res.body);
          should.not.exist(res.body['password']);
          should.not.exist(res.body['_salt']);
          (res.text).should.not.containDeep('password');
          (res.text).should.not.containDeep('_salt');

          // Make 
          res.body['email'].should.eql('email@email.com');
          res.body['firstname'].should.eql('User');
          res.body['lastname'].should.eql('Name');
          res.body['username'].should.eql('user.name');
          res.body['role'].should.eql('employee');

          // Make sure signin date is update every time user gets logged in
          res.body['signin_ua'].should.eql('test-user-agent');

          done();
        });
    });

    it('should fail when trying to signin after user is already logged in',
      function(done) {

        request
          .post(signin_url)
          .send(user_credentials)
          .expect(401, done);

      });

    it('POST method: signout a logged in user', function(done) {

      request
        .post(signout_url)
        .expect(200, done);

    });

    it('POST method: shoudl fail if logging out a NOT logged in user',
      function(done) {

        request
          .post(signout_url)
          .expect(401, done);

      });

    it('POST method: signin same user again after logging out', function(
      done) {

      request
        .post(signin_url)
        .send(user_credentials)
        .expect(200, done);

    });

    after(function() {

      User.remove().exec();

    });

  });

  describe('URLs: /api/user/password/forgot', function() {

    var user, code, currentPassword;
    var user_credentials = {
      password: 'password',
      email: 'logged@email.com'
    };

    before(function(done) {

      user = new User({
        firstname: 'User',
        lastname: 'Name',
        username: 'user.name',
        email: user_credentials.email,
        password: user_credentials.password,
        role: 'employee',
        _provider: 'local'
      });

      user.save(function() {

        request
          .post(signin_url)
          .send(user_credentials)
          .end(function(err, res) {

            res.status.should.equal(200);
            done();
          });

      });
    });

    it('POST method: should fail when logged in', function(done) {

      request
        .post(forgot_url)
        .send({
          data: user_credentials.email
        })
        .end(function(err, res) {

          res.status.should.equal(401);

          request
            .post(signout_url)
            .end(function(err, res) {

              res.status.should.equal(200);
              done();
            });

        });
    });

    it('POST method: should fail when no data', function(done) {

      request
        .post(forgot_url)
        .send()
        .expect(400, done);

    });

    it('POST method: should fail when wrong data: empty email', function(
      done) {

      request
        .post(forgot_url)
        .send({
          data: ''
        })
        .expect(400, done);

    });

    it(
      'POST method: should fail when wrong data is given: not existing email',
      function(done) {

        request
          .post(forgot_url)
          .send({
            data: 'void@void.com'
          })
          .expect(400, done);

      });

    it('POST method: should success when right data is given: step1',
      function(done) {

        (user._forgot_code === undefined).should.be.true;
        (user._forgot_code_expire === undefined).should.be.true;

        request
          .post(forgot_url)
          .send({
            data: user_credentials.email
          })
          .end(function(err, res) {

            res.status.should.equal(200);

            User.findOne({
              email: user_credentials.email
            }, function(err, user) {

              if (err) {
                done(err);
              }

              user._forgot_code.should.be.ok;
              user._forgot_code.should.not.be.empty;

              user._forgot_code_expire.should.be.ok;
              user._forgot_code_expire.should.be.an.instanceOf(Date);

              currentPassword = user.password;
              code = user._forgot_code;

              done();
            });
          });
      });

    it('POST method: should success when right data is given: step2',
      function(done) {

        request
          .post(forgot_url)
          .send({
            step: 'send_password',
            data: user_credentials.email,
            code: code
          })
          .end(function(err, res) {

            res.status.should.equal(200);

            User.findOne({
              email: user_credentials.email
            }, function(err, user) {

              if (err) {
                done(err);
              }

              currentPassword.should.not.be.eql(user.password);

              done();
            });
          });
      });

    after(function() {

      User.remove().exec();

    });

  });
});