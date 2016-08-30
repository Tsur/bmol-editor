'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	TwitterStrategy = require('passport-twitter').Strategy,
	settings = require('conftence'),
	users = require('../../app/controllers/users');

module.exports = function() {
	// Use twitter strategy
	passport.use(new TwitterStrategy({
			consumerKey: settings.twitter.clientID,
			consumerSecret: settings.twitter.clientSecret,
			callbackURL: settings.twitter.callbackURL,
			passReqToCallback: true
		},
		function(req, token, tokenSecret, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.token = token;
			providerData.tokenSecret = tokenSecret;

			// Create the user OAuth profile
			var providerUserProfile = {
				displayName: profile.displayName,
				username: profile.username,
				provider: 'twitter',
				providerIdentifierField: 'id_str',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};