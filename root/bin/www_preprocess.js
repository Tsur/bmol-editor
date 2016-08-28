var pp = require('preprocess');

var src = __dirname + "/../www_main.html";
var dest = __dirname + "/../index.html";
var context = {NODE_ENV: process.env.NODE_ENV};
var options = {};

pp.preprocessFileSync(src, dest, context, options);
