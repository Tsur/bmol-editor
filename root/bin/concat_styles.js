var concat = require('concat-files');
var path = require('path');

concat([
  path.join(__dirname, '..', 'media', 'css', 'animate.min.css'),
  path.join(__dirname, '..', 'media', 'css', 'styles.css')
], path.join(__dirname, '..', 'dist', 'styles.css'), function() {
  console.log('done');
});
