'use strict';

module.exports = function(grunt) {
  // Unified Watch Object
  var watchFiles = {

    serverViews: ['server/views/**/*.html'],
    serverJS: ['gruntfile.js', 'server.js', './config/**/*.js', 'server/**/*.js'],
    clientViews: ['public/modules/**/partials/**/*.html'],
    clientJS: ['public/modules/**/*.js', 'public/modules/*/*[!tests]*/*.js'],
    clientCSS: ['public/modules/**/css/*.css'],
    mochaTests: ['server/tests/**/*.test.js'],
    mochaUnitTests: ['server/tests/**/*.unit.test.js']
  };

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      serverViews: {
        files: watchFiles.serverViews,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: watchFiles.clientViews,
        tasks: ['ngtemplates'],
        options: {
          livereload: true,
        }
      },
      clientJS: {
        files: watchFiles.clientJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientCSS: {
        files: watchFiles.clientCSS,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: watchFiles.clientJS.concat(watchFiles.serverJS),
        options: {
          jshintrc: true
        }
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc',
      },
      all: {
        src: watchFiles.clientCSS
      }
    },
    // concat: {
    //           options: {
    //               // define a string to put between each file in the concatenated output
    //               separator: ';'
    //           },
    //           dist: {
    //               // the files to concatenate
    //               src: ['app/js/config.js', 'app/js/app.js', 'app/js/services.js','app/js/controllers.js','app/js/filters.js','app/js/directives.js', 'app/js/templates.js'],
    //               // the location of the resulting JS file
    //               dest: 'public/dist/application.js'
    //           }
    //   	},
    uglify: {
      production: {
        options: {
          mangle: false,
          // the banner is inserted at the top of the output
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },

        files: {
          'public/dist/application.min.js': 'public/dist/application.js'
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/dist/application.min.css': '<%= applicationCSSFiles %>'
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: watchFiles.serverViews.concat(watchFiles.serverJS)
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    ngmin: {
      production: {
        files: {
          'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      server: ['nodemon', 'watch:clientViews'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {

      test: {
        NODE_ENV: 'testing'
      },

      dev: {
        NODE_ENV: 'development'
      }
    },
    mochaTest: {
      // src: watchFiles.mochaTests,

      // options: {
      // 	reporter: 'spec'
      // },

      all: {
        options: {
          require: ['server.js'],
          reporter: 'spec'
        },
        src: watchFiles.mochaTests,
      },

      unit: {
        options: {
          //bail: true,
          reporter: 'spec'
        },
        src: watchFiles.mochaUnitTests,
      },

    },
    // mochacli: {
    //        options: {
    //            require: ['server.js'],
    //            reporter: 'spec',
    //            //bail: true,
    //        },
    //        all: { 

    //        	options: {
    //               	files: watchFiles.mochaTests
    //           	}
    //           }
    //    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    jsdoc: {

      dist: {
        src: ['config/**.js', 'server/**.js', 'public/**.js', 'tools/*.js', './../README.md'],
        options: {
          destination: 'docs/html',
          tutorials: 'docs/source',
          configure: 'docs/conf.json'
        }
      },

      docstrap: {
        src: ['config/**.js', 'server/**.js', 'public/**.js', 'tools/*.js', './../README.md'],
        options: {
          destination: 'docs/html',
          tutorials: 'docs/source',
          template: "node_modules/ink-docstrap/template",
          configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
        }
      }
    },
    ngtemplates: {
      app: {
        cwd: 'public/modules',
        src: '**/partials/**/*.html',
        dest: 'public/dist/templates.js',
        options: {
          module: 'kalzate',
          url: function(url) {
            return '/static/' + url;
          },
          htmlmin: {

            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }
      }
    },
  });

  // Load NPM tasks 
  require('load-grunt-tasks')(grunt);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {

    var assets = require('./public/config/assets').development;

    grunt.config.set('applicationJavaScriptFiles', assets.js);
    grunt.config.set('applicationCSSFiles', assets.css);
  });

  // Default task(s).
  grunt.registerTask('default', ['lint', 'concurrent:default']);

  // Server task(s).
  grunt.registerTask('server', ['concurrent:server']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'concurrent:debug']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint', 'csslint']);

  // Build task(s).
  grunt.registerTask('build', ['lint', 'loadConfig', 'ngmin', 'uglify', 'cssmin']);

  // Templates task(s)
  grunt.registerTask('templates', ['ngtemplates']);

  // Test task.
  grunt.registerTask('test-server', ['env:test', 'mochaTest:all']);
  //grunt.registerTask('test-server', ['env:test', 'mochacli:all']);

  // Test task.
  grunt.registerTask('test-client', ['karma:unit']);

  // Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

  // Test task.
  grunt.registerTask('docs', ['jsdoc:docstrap']);
};