'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	GithubStrategy = require('passport-github').Strategy,
	settings = require('conftence'),
	users = require('../../app/controllers/users');

module.exports = function() {
	// Use github strategy
	passport.use(new GithubStrategy({
			clientID: settings.github.clientID,
			clientSecret: settings.github.clientSecret,
			callbackURL: settings.github.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'github',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};