'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    sys = require('sys'),
    exec = require('child_process').exec,
    archiver = require('archiver'),
    moment = require('moment'),
    coreLogger = require('./../../../../config/loggers')('core');

exports.upload = function(req, res, next) {

    if(req.user && req.user.role == 'employee') {

        var img = req.body,
            data = img['data'].substr(img['data'].indexOf('base64') + 7),//regex = /^data:.+\/(.+);base64,(.*)$/
            //, matches = img['data'].match(regex)
            decodedImage = new Buffer(data, 'base64'),//decodedImage = new Buffer(matches[2], 'base64')
            name = (new Date().getTime()).toString(36)+'_'+img['name'],
            relative = '/static/uploaded/'+name,
            absolute = __dirname + '/../../../client/app/uploaded/'+name;

            //var data = img['data'].substr(img['data'].indexOf('base64') + 7);
            //decodedImage = new Buffer(data, 'base64')
        fs.writeFile(absolute, decodedImage, function(err) {
        
            if(err) {

                coreLogger.error('Error upload method', err);
                return next(err);
            }
        
            res.send(relative);
        });
    }
    else {

        coreLogger.debug('User not authorised in method upload');
        res.send(401);
    }
};

exports.backup = function (req, res, next) {

    if(req.user && req.user.role == 'employee') {

        var args = ['--db', 'kalzate'],
            mongodump = childProcess.spawn('/usr/bin/mongodump', args);

        mongodump.stderr.on('data', function (err) {
            
            coreLogger.error('Error backup method', err);
            res.send(404);
        });

        mongodump.on('close', function (code) {

            var filename = 'kalzate_'+(moment().format('DD_MM_YYYY'))+'.zip',
                path = __dirname+'/../../../client/app/db_backup/'+filename,
                output = fs.createWriteStream(path),
                archive = archiver('zip');

            output.on('close', function() {
            
                coreLogger.debug('archiver has been finalized and the output file descriptor was closed successfully');
                //res.attachment('backup.zip');
                //res.setHeader('Content-Type', 'application/zip');
                res.sendfile(filename, {'root': __dirname+'/../../../client/app/db_backup/'});
            });

            archive.on('error', function(err) {
            
                coreLogger.error('Error backup method', err);
                res.send(404);
            });

            archive.pipe(output);

            archive
            .append(fs.createReadStream(__dirname + '/../../dump/kalzate/shoes.bson'), { name: 'shoes.bson' })
            .append(fs.createReadStream(__dirname + '/../../dump/kalzate/shoes.metadata.json'), { name: 'shoes.metadata.json' })
            .append(fs.createReadStream(__dirname + '/../../dump/kalzate/tickets.bson'), { name: 'tickets.bson' })
            .append(fs.createReadStream(__dirname + '/../../dump/kalzate/tickets.metadata.json'), { name: 'tickets.metadata.json' })
            .append(fs.createReadStream(__dirname + '/../../dump/kalzate/users.bson'), { name: 'users.bson' })
            .append(fs.createReadStream(__dirname + '/../../dump/kalzate/users.metadata.json'), { name: 'users.metadata.json' })
            ;
            
            archive.finalize(function (err, bytes) {
                
                if (err) {

                    coreLogger.error('Error backup method', err);
                    res.send(404);
                }
            });
        });
    }
    else {

        coreLogger.debug('User not authorised in method backup');
        res.send(401);
    }
};

exports.shutdown = function (req, res, next) {

    if(req.user && req.user.role == 'employee') {
        
        exec('shutdown -h now', function (error, stdout, stderr) { 

            sys.puts(stdout); 
            res.send(true); 

        });
    }
    else {

        coreLogger.debug('User not authorised in method shutdown');
        res.send(401);
    }
};