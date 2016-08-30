#!/usr/bin/env node

'use strict';

/**
 * @module encode
 * @version 1.0
 * @author Zurisadai Pabon < zurisadai.pabon@gmail.com >
 * @description You can use this module to generate a spr file with the graphics data stored within. This module encodes png images into a spr file. The structure of that file is depicted next. There are two major block within the spr file. The first one is the meta block and the second one is the images data block. The meta block has an overall size of 4 bytes for each sprite containing in those 4 bytes the image data startpoint address, plus 6 extra bytes. From those 6 bytes, the first 4 bytes is a tracking version signature. The next 2 bytes is the total number of sprites contained within the file, it gives us a max amount of 65k sprites, good enough. Let's have a look at an example of an spr file containing 10 sprites:
 *
 * 4 Bytes -> Version Number : 0x00000001
 * 2 Bytes -> Total number of Sprites: 0x0A (10 in hex)
 * 4 Bytes -> Address for 1st sprite: 0x2E (46 in hex, the whole meta block size)
 * 4 Bytes -> Address for 2nd sprite: .. (46 + 1st sprite length)
 * 4 Bytes -> Address for 3er sprite: .. (46 + 1st sprite length + 2nd sprite length)
 * 4 Bytes -> Address for 4th sprite: ....
 * 4 Bytes -> Address for 5th sprite: ....
 * 4 Bytes -> Address for 6th sprite: ....
 * 4 Bytes -> Address for 7th sprite: ....
 * 4 Bytes -> Address for 8th sprite: ....
 * 4 Bytes -> Address for 9th sprite: ....
 * 4 Bytes -> Address for 10th sprite: ....
 *
 * Total bytes for meta block: 10*4 +6 = 46 Bytes
 *
 * Now, the images data block comes just after the meta block and it contains the actual image data as png data format. It would have a shape as the next:
 *
 * 2178 Bytes -> 1st sprite data (The address for 1st sprite appoints here)
 * 1489 Bytes -> 2nd sprite data (The address for 2nd sprite appoints here)
 * ...
 *
 * To use this module, you need to provide a directory containing png images numbered from number 1 on (1.png, 2.png, ...etc). You can later use this number in the entities file to set the sprites belonging to the entities. You have below different usage examples.
 *
 * @example Look sprites on a dir named sprites in the current working directory and generated a spr file name bmol.spr in the current working directory
 * encode.js
 *
 * @example Look sprites on folder "mysprites" and generates a spr file with a custom name in the current working directory
 * encode.js mysprites mysprites.spr
 * encode.js --in mysprites --out mysprites.spr
 *
 * @example Ignore some files you want to skip (i.e. all files containing an underscore)
 * encode.js --ignore "/\_/g"
 *
 * @example Report info for entities file (generates an useful report which mappes file names with sprites ids to use in entities file)
 * encode.js --report
 *
 * @example Enable debug mode
 * encode.js --debug
 *
 * @example Enable recursive mode. It also looks up within directories inside the sprites directory. You should use report option if enabling recursive lookup
 * encode.js --in spritesStructures --recursive --report
 *
 * @todo ignore && recursive options
 */

(function() {

  var _ = require('lodash');
  var argv = require('minimist')(process.argv.slice(2));

  var printHelp = function(logger, exit) {

    logger = logger || console;
    exit = exit || true;

    logger.log(

      '\n',
      'Description:\tencode sprites',
      '\n\n Usage:',
      '\n\tencode help',
      '\n\tencode <sprites_folder> <spr_file_name>',
      '\n\tencode --in <sprites_folder> --out <spr_file_name>',
      '\n\tencode --ignore <regex>',
      '\n\tencode --in <sprites_folder> --recursive',
      '\n\tencode --debug',
      '\n\n Options:',
      '\n\t-i, --in\n\t\tThe directory containing the png images. Defaults to "sprites" dir in current working directory',
      '\n\t-o, --out\n\t\tThe name of the spr file generated. Defaults to "bmol.spr"',
      '\n\t-d, --debug\n\t\tEnable debug mode',
      '\n\t-r, --recursive\n\t\tEnable recursive lookup',
      '\n\t-g, --ignore\n\t\tIgnore files matched by the given regEx',
      '\n\t-e, --report\n\t\tEnable reporting mode',
      '\n\n'
    );

    if (exit) {

      process.exit(0);

    }

  };

  // Asking for help ?
  if (typeof argv._[0] === 'string' && argv._[0].toLowerCase() === 'help') {

    return printHelp();

  }

  // Dependences
  var fs = require('fs');

  var printError = function(logger) {

    var errors;

    if (typeof logger === 'string') {

      logger = console;
      errors = arguments;

    } else {

      logger = logger;
      errors = arguments.splice(1);
    }

    logger.trace.apply(this, errors);

    process.exit(0);

  };

  var debug = function(enable) {

    return function() {

      if (enable) {

        console.log.apply(null, _.toArray(arguments));

      }

    };

  };

  var generateSprFile = function(opt) {

    fs.realpath(opt.in, function(err, dir) {

      if (err) {

        return printError(opt.in + ' is not a valid directory');
      }

      opt.debug('Looking images into directory', dir);

      dir = dir + '/';

      fs.readdir(dir, function(err, files) {

        if (err) {

          return printError(dir + '" could not be read. Have you right permissions?');

        }

        var totalNumSprites, metaBlockSize, metaBuffer, metaBufferOffset, imagesData, imagesCount, outputDir, entitiesReport;

        totalNumSprites = files.length;

        opt.debug('Reading png images', files, '(' + files.length + ')');

        // 6 bytes: 4 for signature and 2 for total sprites. Then for each srpite 4 bytes to denote the address
        metaBlockSize = (totalNumSprites * 4) + 6;

        opt.debug('meta block has a size of', metaBlockSize, 'bytes');

        metaBuffer = new Buffer(metaBlockSize);
        metaBufferOffset = 0;

        //Signature
        metaBuffer.writeUInt32BE(0x77AA0001, metaBufferOffset);

        opt.debug('using version', 0x77AA0001);

        metaBufferOffset += 4;

        //Total Sprites
        metaBuffer.writeUInt16BE(totalNumSprites, metaBufferOffset);
        metaBufferOffset += 2;

        imagesCount = 0;
        imagesData = [];

        outputDir = fs.realpathSync(__dirname) + '/' + opt.out;

        if (fs.existsSync(outputDir)) {

          fs.unlinkSync(outputDir);

          opt.debug('removed older spr file', outputDir);

        }

        fs.open(outputDir, 'a', function(err, fd) {

          entitiesReport = [];

          var sortedFiles = files.sort(function(a, b) {

            return parseInt(a.replace('\.png', '')) - parseInt(b.replace('\.png', ''));

          });

          _.forEach(sortedFiles, function(image) {

            imagesCount++;

            fs.readFile(dir + image, function(err, bytes) {

              opt.debug('reading image', image);

              // Meta Block Size is also the first address for the first image. For example, if having 10 sprites, the meta block sizes 46 bytes (6 bytes for signature and total sprites and 4 bytes for each sprite address). After the block size it starts the data block containing the image bytes. The first image will start at address 46, just after the meta block ends.
              metaBuffer.writeUInt32BE(metaBlockSize, metaBufferOffset);
              metaBufferOffset += 4;

              // console.log('buffer length',img_parsed.length);

              metaBlockSize += bytes.length;

              imagesData.push(bytes);

              entitiesReport.push(image);

              imagesCount--;

              if (!imagesCount) {

                var imagesBuffer = Buffer.concat(imagesData),
                  buffer = Buffer.concat([metaBuffer, imagesBuffer]);

                fs.writeSync(fd, buffer, 0, buffer.length);

                fs.close(fd, function(err) {

                  opt.debug(outputDir + ' file has been generated successfully');

                  if (opt.report) {

                    _.forEach(entitiesReport, function(v, i) {

                      console.log('id:', i + 1, 'file:', v);

                    });

                  }

                });

              }

            });

          });

        });

      });

    });

  };

  // Run it!
  (function() {

    var options = {};

    // In directory
    options.in = argv['i'] || argv['in'] || argv['_'][0] || 'sprites';

    // Output file name
    options.out = argv['o'] || argv['out'] || argv['_'][1] || 'bmol.spr';

    // recursive lookup
    options.recursive = argv['r'] || argv['recursive'] || false;

    // report mode
    options.report = argv['e'] || argv['report'] || false;

    // ignore png images
    options.ignore = argv['g'] || argv['ignore'] || false;

    // debug mode
    options.debug = debug(argv['d'] || argv['debug'] || false);

    options.debug('options', options);

    generateSprFile(options);

  })();

})();