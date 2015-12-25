(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jade=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  if (arguments.length === 1) {
    var attrs = a[0];
    for (var i = 1; i < a.length; i++) {
      attrs = merge(attrs, a[i]);
    }
    return attrs;
  }
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    a['class'] = ac.concat(bc).filter(nulls);
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {*} val
 * @return {Boolean}
 * @api private
 */

function nulls(val) {
  return val != null && val !== '';
}

/**
 * join array as classes.
 *
 * @param {*} val
 * @return {String}
 */
exports.joinClasses = joinClasses;
function joinClasses(val) {
  return (Array.isArray(val) ? val.map(joinClasses) :
    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
    [val]).filter(nulls).join(' ');
}

/**
 * Render the given classes.
 *
 * @param {Array} classes
 * @param {Array.<Boolean>} escaped
 * @return {String}
 */
exports.cls = function cls(classes, escaped) {
  var buf = [];
  for (var i = 0; i < classes.length; i++) {
    if (escaped && escaped[i]) {
      buf.push(exports.escape(joinClasses([classes[i]])));
    } else {
      buf.push(joinClasses(classes[i]));
    }
  }
  var text = joinClasses(buf);
  if (text.length) {
    return ' class="' + text + '"';
  } else {
    return '';
  }
};


exports.style = function (val) {
  if (val && typeof val === 'object') {
    return Object.keys(val).map(function (style) {
      return style + ':' + val[style];
    }).join(';');
  } else {
    return val;
  }
};
/**
 * Render the given attribute.
 *
 * @param {String} key
 * @param {String} val
 * @param {Boolean} escaped
 * @param {Boolean} terse
 * @return {String}
 */
exports.attr = function attr(key, val, escaped, terse) {
  if (key === 'style') {
    val = exports.style(val);
  }
  if ('boolean' == typeof val || null == val) {
    if (val) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    } else {
      return '';
    }
  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
    if (JSON.stringify(val).indexOf('&') !== -1) {
      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
                   'will be escaped to `&amp;`');
    };
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will eliminate the double quotes around dates in ' +
                   'ISO form after 2.0.0');
    }
    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
  } else if (escaped) {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + exports.escape(val) + '"';
  } else {
    if (val && typeof val.toISOString === 'function') {
      console.warn('Jade will stringify dates in ISO form after 2.0.0');
    }
    return ' ' + key + '="' + val + '"';
  }
};

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 */
exports.attrs = function attrs(obj, terse){
  var buf = [];

  var keys = Object.keys(obj);

  if (keys.length) {
    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('class' == key) {
        if (val = joinClasses(val)) {
          buf.push(' ' + key + '="' + val + '"');
        }
      } else {
        buf.push(exports.attr(key, val, false, terse));
      }
    }
  }

  return buf.join('');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  var result = String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  if (result === '' + html) return html;
  else return result;
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno, str){
  if (!(err instanceof Error)) throw err;
  if ((typeof window != 'undefined' || !filename) && !str) {
    err.message += ' on line ' + lineno;
    throw err;
  }
  try {
    str = str || require('fs').readFileSync(filename, 'utf8')
  } catch (ex) {
    rethrow(err, null, lineno)
  }
  var context = 3
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"fs":1}],3:[function(require,module,exports){
'use strict';
// Do not use this: require('kalzate/public/src/application');
require('../src/application');
require('../src/core/application');
require('../src/stock/application');
},{"../src/application":4,"../src/core/application":5,"../src/stock/application":21}],4:[function(require,module,exports){
'use strict';

var app = require('./utils/app');

//Start by defining the main module and adding the module dependencies
angular.module(app.applicationModuleName, app.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(app.applicationModuleName).config([
  '$locationProvider', '$httpProvider',
  function($locationProvider, $httpProvider) {

    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(true);

    var interceptor = ['$location', '$q',
      function($location, $q) {

        function success(response) {
          return response;
        }

        function error(response) {

          if (response.status === 401) {
            $location.path('/signin');
          }

          return $q.reject(response);
        }

        return function(promise) {

          return promise.then(success, error);
        }
      }
    ];

    $httpProvider.responseInterceptors.push(interceptor);
  }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {

  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') {

    window.location.hash = '#!';

  }

  //Then init the app
  angular.bootstrap(document, [app.applicationModuleName]);

});
},{"./utils/app":26}],5:[function(require,module,exports){
'use strict';

var app = require('../utils/app');

// Use Applicaion configuration module to register a new module
app.registerModule('core');

// Load controllers
require('./controllers/footer');
require('./controllers/forgot');
require('./controllers/header');
require('./controllers/me');
require('./controllers/signin');
require('./controllers/signup');

// Load directives
require('./directives/active_nav');
require('./directives/animation');
require('./directives/file');
require('./directives/submit');
require('./directives/visible_to_role');

// Load filters
require('./filters/interpolate');

// Load services
require('./services/auth');
require('./services/colors');

// Load routes
require('./config/routes');
},{"../utils/app":26,"./config/routes":6,"./controllers/footer":7,"./controllers/forgot":8,"./controllers/header":9,"./controllers/me":10,"./controllers/signin":11,"./controllers/signup":12,"./directives/active_nav":13,"./directives/animation":14,"./directives/file":15,"./directives/submit":16,"./directives/visible_to_role":17,"./filters/interpolate":18,"./services/auth":19,"./services/colors":20}],6:[function(require,module,exports){
'use strict';

var globalRoles = require('../../utils/roles');

// Note: You cannot inject services instances in the config, just providers. From angular docs: Configuration blocks - get executed during the provider registrations and configuration phase. Only providers and constants can be injected into configuration blocks. This is to prevent accidental instantiation of services before they have been fully configured
angular.module('kalzate')
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      var access = globalRoles.accessLevels;

      $stateProvider
        .state('index', {
          url: '/',
          access: access.employee,
          views: {
            'menu': {
              templateUrl: '/static/src/core/partials/menu.html'
            },
            'section': {
              templateUrl: '/static/src/core/partials/index.html'
            }
          }
        })
      // .state('me', {
      //   templateUrl: '/static/src/core/partials/me.html',
      //   access: access['employee']
      // })
      // .state('me.profile', {
      //   url: "/me",
      //   templateUrl: '/static/src/core/partials/me_profile.html',
      //   access: access['employee']
      // })
      // .state('me.notifications', {
      //   url: "/me/notifications",
      //   templateUrl: '/static/src/core/partials/me_notifications.html',
      //   access: access['employee']
      // })
      // .state('me.design', {
      //   url: "/me/notifications",
      //   templateUrl: '/static/src/core/partials/me_design.html',
      //   access: access['employee']
      // })
      .state('identify', {
        // templateUrl: '/static/src/core/partials/security_check.html',
        access: access.anon,
        views: {
          section: {
            templateUrl: '/static/src/core/partials/security_check.html'
          }
        },
        controller: ['$scope',
          function($scope) {
            $scope.error = false;
            $scope.loading = false;
          }
        ],
        onExit: function() {

          //Processing library still keeps a copy a "p", so p = undefined will not work because it is also referenced by processing
          window.animationData.p.noLoop();

          //Free global unused memory
          window.animationData = undefined;
        }
      })
        .state('signin', {
          url: '/signin',
          parent: 'identify',
          templateUrl: '/static/src/core/partials/signin.html',
          controller: 'SigninCtrl',
          access: access.anon,
          // views: {
          //   '': {
          //     templateUrl: '/static/src/core/partials/signin.html'
          //   },
          //   'section': {
          //     templateUrl: '/static/src/core/partials/signin.html'
          //   },
          //   'menu': {
          //     templateUrl: '/static/src/core/partials/signin.html'
          //   }
          // }
        })
        .state('signup', {
          url: '/signup',
          parent: 'identify',
          templateUrl: '/static/src/core/partials/signup.html',
          controller: 'SignupCtrl',
          access: access.anon
        })
        .state('forgot', {
          url: '/forgot',
          parent: 'identify',
          templateUrl: '/static/src/core/partials/forgot.html',
          controller: 'ForgotCtrl',
          access: access.anon
        })
        .state('forgot_secure', {
          url: '/forgot',
          parent: 'identify',
          templateUrl: '/static/src/core/partials/forgot_secure.html',
          controller: 'ForgotCtrl',
          access: access.anon
        })
        .state('error404', {
          url: '/404',
          // templateUrl: '/static/src/core/partials/404.html',
          access: access['public'],
          views: {
            'section': {
              templateUrl: '/static/src/core/partials/404.html'
            }
          }
        });

      $urlRouterProvider.otherwise('/404');

    }
  ]);

// Note: You cannot inject services providers in the config, just instances. From angular docs: Run blocks - get executed after the injector is created and are used to kickstart the application. Only instances and constants can be injected into run blocks. This is to prevent further system configuration during application run time.

/**
* Note: checkout https://github.com/angular-ui/ui-router/issues/64
http://stackoverflow.com/questions/23585065/angularjs-ui-router-change-url-without-reloading-state
* 
*/
angular.module('kalzate')
  .run(['$rootScope', '$location', 'Auth',
    function($rootScope, $location, Auth) {

      $rootScope.$on("$stateChangeStart", function(event, toState, toParams,
        fromState, fromParams) {

        $rootScope.error = null;

        //console.log('toState', toState);
        //If client is not authorize to visit the "next" url, check if logged in
        //access variable in next.access is given by the $routeProvider.when({...access:});
        if (!Auth.authorize(toState.access)) {

          if (!Auth.isLoggedIn()) {

            //Keep track of the current path to redirect then to it
            $rootScope.transition = $location.path();
            //$state.go('signin');
            $location.path('/signin');
          }
          //If user is already logged in and try to enter to login page
          else {

            $location.path('/');
          }

          //event.preventDefault();
        }
      });
    }
  ]);
},{"../../utils/roles":27}],7:[function(require,module,exports){
/* Controllers */

angular.module('core')
.controller('FooterCtrl', ['$http', '$scope', '$location', 'Auth', '$modal', function ($http, $scope, $location, Auth, $modal) {
    
    $scope.user = Auth.user;
    //$scope.userRoles = Auth.userRoles;
    //$scope.accessLevels = Auth.accessLevels;
    $scope.shutdown = function() {
        
        $http
        .post('/api/manage/shutdown')
        .success(function (response) 
        {
            //console.log('Apagando');
            delete localStorage.sessTickets;
            delete localStorage.boxes;
            $location.path('/login');
        })
        .error(function (err){

            //console.log('error al apagar')
        });
    };

    $scope.logout = function() {
        Auth.logout(function() {

            delete localStorage.sessTickets;
            delete localStorage.boxes;

            $location.path('/login');
        }, function() {
        });
    };

    $scope.openEdit = function()
    {
        var modalInstance = $modal.open({
          
          templateUrl: 'ModalEditUser.html',
          controller: 'ModalEditUserCtrl',
          backdrop: 'static',
          keyboard: false

        });

        modalInstance.result.then(function (data) {

            if(data.username)
            {
                Auth.setUserName(data);
            }
        });
    };

}]);
},{}],8:[function(require,module,exports){
/* Controllers */

angular.module('core')
.controller('ForgotCtrl', ['$scope', '$http', '$state',
    
    function ($scope, $http, $state) 
    {

        $scope.step1 = function() {
        
            $scope.$parent.error = false;
            //Set loading to false for deactivate the entire loading animation
            $scope.$parent.loading = true;

            $http
            .post('/api/user/password/forgot', {step: 'request_code', data: $scope.identifier})
            .success(function (response) 
            {
                $scope.$parent.error = false;
                $scope.$parent.loading = false;
                $scope.$parent.forgot_identifier = $scope.identifier;
                $state.go('forgot_secure', {}, {location: false});
            })
            .error(function (err){
                $scope.$parent.error = true;
                $scope.$parent.loading = false;
            });

        };

        $scope.step2 = function() {
        
            $scope.$parent.error = false;
            //Set loading to false for deactivate the entire loading animation
            $scope.$parent.loading = true;

            $http
            .post('/api/user/password/forgot',{step: 'send_password', data: $scope.$parent.forgot_identifier, code: $scope.code})
            .success(function (response) 
            {
                $scope.$parent.error = false;
                $scope.$parent.loading = false;
                $scope.$parent.forgot_identifier = undefined;
                $state.go('signin');
            })
            .error(function (err){
                $scope.$parent.error = true;
                $scope.$parent.loading = false;
            });
        };
    }
]);
},{}],9:[function(require,module,exports){
/* Controllers */

angular.module('core')
.controller('HeaderCtrl', ['$scope', '$window', function ($scope, $window) {
    
    $scope.navCollapsed = false;

    $scope.toTickets = function()
    {
        $window.location.href = '/tickets';//Solucion temporal
    }

    $scope.genID = 1;

    $scope.updateID = function()
    {
        $scope.genID = Math.floor((Math.random()*1000)+1);
        //console.log('here');
    }

}]);
},{}],10:[function(require,module,exports){
/* Controllers */

angular.module('core')
.controller('MeProfile', ['$scope', 'Auth', 
    
    function ($scope, Auth) {

        
    }
]);
},{}],11:[function(require,module,exports){
/* Controllers */

angular.module('core')
.controller('SigninCtrl', ['$rootScope', '$scope', '$location', '$window', '$timeout', 'Auth', 
    
    function ($rootScope, $scope, $location, $window, $timeout, Auth) {

        $scope.display_forgot_icon = false;

        $scope.hideForgotIconOnBlur = function () {

            // How long it takes to process the click event ~ 200ms
            $timeout( function () {

                $scope.display_forgot_icon = false;

            }, 200);
        };

        $scope.signin = function() {

            $scope.$parent.error = false;
            //Set loading to false for deactivate the entire loading animation
            $scope.$parent.loading = true;

            Auth.login({
                email: $scope.username,
                password: $scope.password
            },function (res) {
                $scope.$parent.error = false;
                $scope.$parent.loading = false;
                $location.path($rootScope.transition || '/');
            },function (err) {
                $scope.$parent.error = true;
                $scope.$parent.loading = false;
            });

         };

        $scope.loginOauth = function (provider) {
            $window.location.href = '/auth/' + provider;
        };
    }
]);
},{}],12:[function(require,module,exports){
/* Controllers */

angular.module('core')
.controller('SignupCtrl', ['$scope', '$location', 'Auth', 
    
    function ($scope, $location, Auth) 
    {

        $scope.signup = function() {
        
            $scope.$parent.error = false;
            $scope.$parent.loading = true;

            Auth.register({
                fullname: $scope.fullname,
                email: $scope.email
            },function (res) {
                $scope.$parent.error = false;
                $scope.$parent.loading = false;
                $location.path('/');
            },function (err) {
                $scope.$parent.error = true;
                $scope.$parent.loading = false;
            });

         };
    }
]);
},{}],13:[function(require,module,exports){
//'use strict';

angular.module('core')
.directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            
            var path = attrs.activeNav;

            scope.location = $location;
            scope.$watch('location.path()', function(newPath) {
                if (newPath.indexOf(path) > -1) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

}]);
},{}],14:[function(require,module,exports){
/*
* TODO: Analysis of memory leakage(objects not used that still remain in memory)
* replace all "window.animationData" for "data", but will be data automatically removed by garbage collector?  
*/
(function () {

    Array.prototype.remove = function(from, to) {
      if (typeof from != "number") return this.remove(this.indexOf(from));
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
    };

    window.animationData = {

        pauseAnimation          : false,
        p                       : null,
        sketch                  : null, 
        el                      : null, 
        i                       : 0,
        numParticles            : 77,
        width                   : window.innerWidth,
        height                  : window.innerHeight,
        mx                      : 0,
        my                      : 0,
        impulsX                 : 0,
        impulsY                 : 0,
        impulsToX               : 0,
        impulsToY               : 0,
        startedAt               : null,
        timeFlow                : [],
        timeIndex               : 0,
        events                  : [],
        play                    : false,
        focusedParticleIndex    : null,
        theTweets               : null,
        transRepeatIndex        : 0,
        transRepeatTimes        : 0,
        components              : [],
        pixels                  : []
    }

    window.animationData['timeFlow'] =  [7132, 12624, 19629, 24140, 28728, 34656, 39152, 43596, 48147, 54220, 58617, 60118, 64549, 70573, 76604, 81125, 84161, 90194, 96147, 102242, 106636, 111148, 114060, 118042, 124577, 132052, 135179, 139609, 142571, 144084, 147180, 151820, 154567, 159110, 160595, 166565, 173446, 177048, 184604, 192782, 198787];

    window.animationData['circle_colors_white'] = null;
    window.animationData['circle_colors'] = [

        // {r:function(){return Math.random()*255}, g:function(){return 0}, b:function(){return 0}},
        {r:function(){return 0}, g:function(){return 0}, b:function(){return Math.random()*255}},
        //{r:function(){return Math.random()*255}, g:function(){return Math.random()*255}, b:function(){return Math.random()*255}},
        // {r:function(){return Math.random()*255}, g:function(){return 0}, b:function(){return Math.random()*255}},
        {r:function(){return window.animationData['circle_colors_white'] = Math.random()*255}, g:function(){return window.animationData['circle_colors_white']}, b:function(){return window.animationData['circle_colors_white']}}
    ];

    window.animationData['figure'] = [

        // Heart
        {
            'size': [{w:350,h:-50}, {w:350,h:-100}, {w:-350,h:-80}],
            'data':[[507,112],[492,121],[491,134],[490,153],[490,171],[490,189],[491,213],[496,232],[500,247],[509,264],[513,272],[520,282],[536,299],[543,312],[551,324],[563,338],[569,346],[573,350],[583,360],[590,368],[594,372],[610,382],[623,382],[633,371],[642,361],[649,353],[658,343],[668,332],[673,324],[685,314],[694,300],[698,293],[706,280],[707,273],[713,261],[721,253],[725,243],[729,229],[731,219],[735,204],[736,193],[740,179],[739,171],[742,158],[743,144],[743,141],[743,130],[743,119],[501,108],[514,101],[526,87],[540,87],[546,85],[558,86],[566,101],[579,110],[589,124],[596,132],[599,142],[600,148],[604,160],[605,164],[606,178],[617,176],[617,166],[620,152],[623,133],[626,115],[632,103],[637,92],[645,88],[656,85],[670,79],[685,81],[694,84],[709,88],[720,94],[730,100],[738,112],[742,122]]
        }
    ];

    window.animationData['init'] = function ()
    {
        for(i = 0; i<window.animationData['numParticles']; i++ ) 
        {
            var white_color_grade = (Math.random()*125)+130;

            window.animationData['pixels'][i] = 
            {
                x           : Math.random()*window.animationData['width'],
                y           : window.animationData['height']/2,
                toX         : 0,
                toY         : window.animationData['height']/2 + 25,
                color       : Math.random()*200 + 55,
                angle       : Math.random()*Math.PI*2,
                size        : 0,
                toSize      : Math.random()*4+1,
                fixedSize   : false,
                r           : 0,
                g           : 0,
                b           : 0,
                toR         : white_color_grade,
                toG         : white_color_grade,
                toB         : white_color_grade,
                flightMode  : 0
            };

            window.animationData['pixels'][i].toX = window.animationData['pixels'][i].x;
            window.animationData['pixels'][i].speedX = 0;
            window.animationData['pixels'][i].speedY = 0;
        }
    }

    window.animationData['transitions'] = [

        // random position
        function() 
        {
            for(i = 0; i<window.animationData['pixels'].length; i++ ) 
            {
                var p = window.animationData['pixels'][i];
          
                if(p.flightMode != 2)
                {
                    p.toX = Math.random()*window.animationData['width'];
                    p.toY = Math.random()*window.animationData['height'];
                    p.speedX = Math.cos(p.angle) * Math.random() * 2;
                    p.speedY = Math.sin(p.angle) * Math.random() * 2;
                    p.fixedSize = false;
                }
            }
        },
      
        //white flash
        function() 
        {
            for(i = 0; i<window.animationData['pixels'].length; i++ ) 
            {
                var p = window.animationData['pixels'][i];
          
                if(p.flightMode != 2) 
                {
                    p.r = 255;
                    p.g = 255;
                    p.b = 255;
                    p.size = Math.random()*50 + 50;
                    p.fixedSize = false;
                }
            }
        },
      
        // change size
        function() 
        {
            for(i = 0; i<window.animationData['pixels'].length; i++ ) 
            {
                var p = window.animationData['pixels'][i];
          
                if(p.flightMode != 2) 
                {
                    p.toSize = Math.random()*10+1;
                    p.fixedSize = false;
                }
            }
        },
      
        // circle shape
        // function() 
        // {
        //     var r = 200,
        //         rgb_circle = window.animationData['circle_colors'][Math.floor(Math.random() * window.animationData['circle_colors'].length)];

        //     for(i = 0; i<window.animationData['pixels'].length; i++ ) 
        //     {
        //         var p = window.animationData['pixels'][i];
          
        //         if(p.flightMode != 2) 
        //         {
        //             p.toSize = Math.random()*4+1;
        //             p.toX = window.animationData['width']/2 + Math.cos(i*3.6*Math.PI/180) * r;
        //             p.toY = window.animationData['height']/2 + Math.sin(i*3.6*Math.PI/180) * r;
        //             p.speedX = (Math.random() - 0.5)/2;
        //             p.speedY = (Math.random() - 0.5)/2;
        //             p.toR = rgb_circle.r();
        //             p.toG = rgb_circle.g();
        //             p.toB = rgb_circle.b();
        //             p.fixedSize = false;

        //             window.animationData['impulsX'] = 0;
        //             window.animationData['impulsY'] = 0;
        //         }
        //     }
        // },

        // Figure
        function() 
        {
            window.animationData['impulsX'] = 0;
            window.animationData['impulsY'] = 0;

            var figure, size;

            if(window.animationData['transRepeatTimes'])
            {
                window.animationData['transFigureIndex'] = Math.floor(Math.random() * window.animationData['figure'].length);
                figure = window.animationData['figure'][window.animationData['transFigureIndex']];
                
                window.animationData['transFigureSize'] = Math.floor(Math.random() * figure['size'].length);
                size = figure['size'][window.animationData['transFigureSize']];
            }
            else
            {
                figure = window.animationData['figure'][window.animationData['transFigureIndex']];
                size = figure['size'][window.animationData['transFigureSize']];
            }
 
            for(i = 0; i<window.animationData['pixels'].length; i++ ) 
            {
                var p = window.animationData['pixels'][i];
                
                if(p.flightMode != 2) 
                {
                    
                    p.toX = figure['data'][Math.floor(i*3.6) % figure['data'].length][0]-size['w'];
                    p.toY = figure['data'][Math.floor(i*3.6) % figure['data'].length][1]-size['h'];
                    p.speedX = (Math.random() - 0.5)/2;
                    p.speedY = (Math.random() - 0.5)/2;
                    p.fixedSize = false;
                }
            }
        }
    ];

    window.animationData['universe'] = {
        
        framecount : 0,

        update: function (p) 
        {
            window.animationData['impulsX'] = window.animationData['impulsX'] + (window.animationData['impulsToX'] - window.animationData['impulsX']) / 30;
            window.animationData['impulsY'] = window.animationData['impulsY'] + (window.animationData['impulsToY'] - window.animationData['impulsY']) / 30;

            // move to tox
            for(i = 0; i<window.animationData['pixels'].length; i++ ) 
            {
                var p = window.animationData['pixels'][i],
                    a = Math.abs(p.toX - window.animationData['mx']) *  Math.abs(p.toX - window.animationData['mx']),
                    b = Math.abs(p.toY - window.animationData['my']) *  Math.abs(p.toY - window.animationData['my']),
                    c = Math.sqrt(a+b);

                p.x = p.x + (p.toX - p.x) / 10;
                p.y = p.y + (p.toY - p.y) / 10;
                p.size = p.size + (p.toSize - p.size) / 10;

                p.r = p.r + (p.toR - p.r) / 10;
                p.g = p.g + (p.toG - p.g) / 10;
                p.b = p.b + (p.toB - p.b) / 10;

                if(p.flightMode != 2) 
                {
                    if(c < 120) 
                    {
                        if(p.flightMode == 0) 
                        {
                            
                            p.degree = Math.atan2(p.y - window.animationData['my'], p.x - window.animationData['mx']) * 180 / Math.PI + Math.random()*180-90;
                            p.degreeSpeed = Math.random()*1+0.5;
                            p.frame = 0;
                        }
                
                        p.flightMode = 1;
                    } 
                    else 
                    {
                        p.flightMode = 0;
                    }
                }

                // random movement
                if(p.flightMode == 0) 
                {
                    // change position
                    p.toX += p.speedX;
                    p.toY += p.speedY;

                    // check for bounds
                    if(p.x < 0) 
                    {
                        p.x = window.animationData['width'];
                        p.toX = window.animationData['width'];
                    }
              
                    if(p.x > window.animationData['width']) 
                    {
                        p.x = 0;
                        p.toX = 0;
                    }

                    if(p.y < 0) 
                    {
                        p.y = window.animationData['height'];
                        p.toY = window.animationData['height'];
                    }
              
                    if(p.y > window.animationData['height']) 
                    {
                        p.y = 0;
                        p.toY = 0;
                    }
                }

                // seek mouse
                if(p.flightMode == 1) 
                {
                    p.toX = window.animationData['mx'] + Math.cos((p.degree + p.frame ) % 360 * Math.PI /180)*c;

                    p.toY = window.animationData['my'] + Math.sin((p.degree + p.frame ) % 360 * Math.PI /180)*c;
              
                    p.frame += p.degreeSpeed;
                    p.degreeSpeed += 0.01;
                }

                if(p.flightMode != 2) 
                {
                    // add impuls
                    p.toX += Math.floor(window.animationData['impulsX'] * p.size/30);
                    p.toY += Math.floor(window.animationData['impulsY'] * p.size/30);
                }
            }

            // set an choord
            var r1 = Math.floor(Math.random() * window.animationData['pixels'].length),
                r2 = Math.floor(Math.random() * window.animationData['pixels'].length);

            if(!window.animationData['pixels'][r1].fixedSize && window.animationData['pixels'][r1].flightMode != 2)
            {
                window.animationData['pixels'][r1].size = Math.random()*30;
            }

            if(!window.animationData['pixels'][r2].fixedSize && window.animationData['pixels'][r2].flightMode != 2)
            {
                window.animationData['pixels'][r2].size = Math.random()*30;
            } 

            window.animationData['universe']['framecount']++;

            //Waits during window.animationData['machine'][0] miliseconds
            if((new Date()).getTime() - window.animationData['startedAt'].getTime() >= window.animationData['timeFlow'][window.animationData['timeIndex']])
            {
                window.animationData['timeIndex']++;

                window.animationData['impulsX'] = Math.random()*400-400;
                window.animationData['impulsY'] = -Math.random()*400;

                if(!window.animationData['transRepeatTimes'])
                {
                    var transIndex = Math.floor(Math.random()*window.animationData['transitions'].length);

                    if(transIndex == 3)
                    {
                        window.animationData['transRepeatIndex'] = transIndex;
                        window.animationData['transRepeatTimes'] = 1;
                    }
                }
                else
                {
                    var transIndex = window.animationData['transRepeatIndex'];
                    window.animationData['transRepeatTimes']--;
                }

                window.animationData['transitions'][transIndex]();
            }

            window.animationData['fixedSize'] = false;
        },
        draw: function (p) 
        {

            for(i = 0; i<window.animationData['pixels'].length; i++ ) 
            {
                var px = window.animationData['pixels'][i];

                p.fill(Math.floor(px.r), Math.floor(px.g), Math.floor(px.b));
                
                p.ellipse(px.x, px.y, px.size, px.size);
            }

            if(window.animationData['focusedParticleIndex'] != null) 
            {
                var px = window.animationData['pixels'][window.animationData['focusedParticleIndex']];

                p.fill(Math.floor(px.r), Math.floor(px.g), Math.floor(px.b));
                
                p.ellipse(px.x, px.y, px.size, px.size);
            }
        }
    };

    window.animationData['components'].push(window.animationData['universe']);

    window.animationData['sketchProc'] = function (p) 
    {
        // var clarendon;

        p.setup = function() 
        {
            p.size(window.animationData['width'], window.animationData['height']);
            p.background(0,0);
            p.fill(0,0,0);
            p.noStroke();
            p.frameRate(60);
            window.animationData['startedAt'] = new Date();
            // clarendon = p.createFont("clarendon"); 
            // p.textFont(clarendon, 18); 
        }

        p.mouseMoved = function()
        {
            window.animationData['mx'] = p.mouseX;
            window.animationData['my'] = p.mouseY;
        }

        p.mousePressed = function(e)
        {
            //Make it double click
            if (p.mouseButton != 39) {

                return;
            }
            //Play
            if(window.animationData['pauseAnimation'])
            {
                window.animationData['pauseAnimation'] = false;
                window.animationData['play'] = true;
                window.animationData['startedAt'] = new Date();
                
                if(window.animationData['audio'])
                {
                    window.animationData['audio'].currentTime = 0;
                    window.animationData['audio'].play();
                }
            }
            //Stop
            else
            {
                window.animationData['pauseAnimation'] = true;
                window.animationData['play'] = false;

                /*TODO: it will display a white screen between the first and the second rect method call. Better paints the image in background as remove the second background block, only this would be necessary:

                window.animationData['p'].background(image);
                window.animationData['p'].fill(0,0);
                window.animationData['p'].rect(0, 0, window.animationData['width'], window.animationData['height']);

                */
                window.animationData['p'].background('#fff');
                window.animationData['p'].fill(0,0);
                window.animationData['p'].rect(0, 0, window.animationData['width'], window.animationData['height']);

                window.animationData['p'].background(0,0);
                window.animationData['p'].fill(0,0);
                window.animationData['p'].rect(0, 0, window.animationData['width'], window.animationData['height']);
                
                if(window.animationData['audio'])
                {
                    window.animationData['audio'].pause();
                }
            }
        }

        p.draw=function()
        {

            if(window.animationData['pauseAnimation'] == false) 
            {
                if(window.animationData['play']) 
                {
                    // p.size(window.animationData['width'], window.animationData['height']);

                    for (var i=0; i<window.animationData['components'].length; i++) 
                    {
                        window.animationData['components'][i].update(p);
                    }
                    
                    p.background(0,0);

                    for (var i=0; i<window.animationData['components'].length; i++) 
                    {
                        window.animationData['components'][i].draw(p);
                    }
              
                    // p.fill(65,148,184);
                    // p.textSize(44);
                    // p.text("Scriptures OS", window.animationData['width']/2 -95, window.animationData['height']/2 +220); 
                }
            }
        }

    };

    angular.module('core').directive('canvasAnimation', ['$timeout', function($timeout) {

        return {

            replace: false,
            
            link: function (scope, canvas, attrs) {

                window.animationData['init']();

                window.animationData['p'] = new Processing(canvas[0], window.animationData['sketchProc']);
                    //audio = new Audio(),
                    //canPlayType = audio.canPlayType("audio/ogg");

                window.animationData['p']['externals']['sketch']['options']['crispLines'] = true;

                //Resize options
                angular.element(window).bind('resize', function(e){

                    if(window.animationData)
                    {
                        window.animationData['width'] = window.innerWidth;
                        window.animationData['height'] = window.innerHeight;
                        window.animationData['p'].size(window.animationData['width'], window.animationData['height']);
                    }
                    
                });

                // if(typeof HTMLAudioElement == 'object' || typeof HTMLAudioElement == 'function') 
                // {
                  
                //     if(canPlayType.match(/maybe|probably/i)) 
                //     {
                //       // $('#audio').attr('src', 'animation/ogg');
                //       audio.src = 'assets/sound/alive.ogg';
                //     } 
                //     else
                //     {
                //       // $('#audio').attr('src', 'animation/mp3');
                //       audio.src = 'assets/sound/alive.mp3';
                //     }

                //     audio.addEventListener('canplay', function() {

                //         audio.play();

                //         $timeout(function() {

                //             window.animationData['startedAt'] = new Date();
                //             window.animationData['play'] = true;
                //             window.animationData['audio'] = audio;

                //         }, 100);
                //     });

                //     audio.addEventListener('ended', function() {

                //         audio.currentTime = 0;
                //         audio.play();

                //     });
                // } 
                // else 
                // {
                //     window.animationData['startedAt'] = new Date();
                //     window.animationData['play'] = true;
                //     scope.$emit('animationStart', true);
                // }    

                window.animationData['startedAt'] = new Date();
                window.animationData['play'] = true;
            }
        };
    }]);

    // return { 

    //     stop: function()
    //     {
    //         window.animationData['pause'] = true;
    //         window.animationData['play'] = false;

    //         window.animationData['p'].fill(0);
    //         window.animationData['p'].rect(0, 0, window.animationData['width'], window.animationData['height']);
            
    //         if(window.animationData['audio'])
    //         {
    //             window.animationData['audio'].pause();
    //         }
        
    //     },

    //     start: function()
    //     {
    //         window.animationData['pause'] = false;
    //         window.animationData['play'] = true;
    //         window.animationData['startedAt'] = new Date();
            
    //         if(window.animationData['audio'])
    //         {
    //             window.animationData['audio'].currentTime = 0;
    //             window.animationData['audio'].play();
    //         }
        
    //     }
    // };
})();


},{}],15:[function(require,module,exports){
//'use strict';

angular.module('core')
.directive('fileDropzone', ['$compile', function ($compile) {
    return {
      replace: false,
      terminal:true,
      scope: {
          uploadFileText: '@',
          uploadFileTextClass: '@',
          //fileList:'=',
          fileError: '=',
          fileLoading: '=',
          onFileChange: '&onFileChange'
      },
      //template: '<label class="{{uploadFileTextClass}}">{{uploadFileText}}</label><input type="file" style="display:none;"/>',
      //scope: true,
      link: function (scope, element, attrs) {
        
        var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes, processFile
            ,template = element.html();

        if(attrs.fileInput)
        {
          var fileId = 'filedropzone'+Math.random().toString(16);

          if(attrs.uploadFileWrapperClass) {

            var wrapper = attrs.uploadFileWrapperClass.split('.');
            template = '<'+wrapper[0]+' class="'+wrapper[1]+'"><label class="{{uploadFileTextClass}}" for="'+fileId+'">{{uploadFileText}}</label><input id="'+fileId+'" type="file" style="display:none;"/></'+wrapper[0]+'>' + template;

            template = angular.element(template);

            element.children().remove();
        
            element.append(template);

            var fileLabel = angular.element(angular.element(element.children()[0]).children()[0])
                ,fileInput = angular.element(angular.element(element.children()[0]).children()[1])
                ;
          }
          else {

            template = '<label class="{{uploadFileTextClass}}" for="'+fileId+'">{{uploadFileText}}</label><input id="'+fileId+'" type="file" style="display:none;"/>' + template;

            template = angular.element(template);

            element.children().remove();
        
            element.append(template);

            var fileLabel = angular.element(element.children()[0])
                ,fileInput = angular.element(element.children()[1])
                ;
          }

          var resetFileInput = function () {

              fileInput.unbind('click');
              fileInput.remove();

              fileId = 'filedropzone'+Math.random().toString(16);
              
              fileInput = angular.element(document.createElement("input"));
              fileInput.attr('type', 'file');
              fileInput.attr('id', fileId);
              fileInput.css('display', 'none');
              fileInput.bind('change', function (e) {
                processFile(e,true);
              });

              fileLabel.after(fileInput);
              fileLabel.attr("for", fileId);
          };

          fileInput.bind('change', function (e) {
              processFile(e,true);
          });

        }
        else
        {
          template = '<label class="{{uploadFileTextClass}}">{{uploadFileText}}</label>' + template;

          template = angular.element(template);

          element.children().remove();
        
          element.append(template);
          
        }

        if(!attrs.uploadFileText) 
        {
            attrs.uploadFileText = 'ARRASTRA TUS FICHEROS AQUÍ';
        }

        if(!attrs.uploadFileTextClass) 
        {
            attrs.uploadFileTextClass = 'dropzone-label';
        }

        $compile(template)(scope);

        processDragOverOrEnter = function (event) 
        {         
          if (event) 
          {
            event.preventDefault();
          }

          event.dataTransfer.effectAllowed = 'copy';
          return false;
        };

        validMimeTypes = attrs.fileDropzone;

        checkSize = function (size) 
        {
          var _ref;

          if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) 
          {
            return true;
          } 
          else 
          {
            
            scope.$apply(function () 
            {
                //scope.fileError = 'size';
                //scope.fileError = 1;
                scope.fileLoading = false;
                scope.fileError['code']= 1;
                scope.fileError['visible']= true;
                //toFn(scope);
            });

            return false;
          }

        };

        isTypeValid = function(type) 
        {

          //Temporal solution for those cases when the browser set no mime type on file
          if(type == '')
          {
            return true;
          }

          if(((validMimeTypes === (void 0) || validMimeTypes === '') 
            || !type 
            || validMimeTypes.indexOf(type) > -1)
            && type.replace(/\ /g,'') != '') 
          {
            return true;
          } 
          else 
          {
            
            scope.$apply(function () 
            {
                //scope.fileError = 'mime';
                scope.fileLoading = false;
                scope.fileError['code']= 2;
                scope.fileError['visible']= true;
                //toFn(scope);
            });

            return false;
          }
        };

        processFile = function(event, input)
        {
            scope.fileLoading = true;

            var file, name, reader, size, type;

            if (event) 
            {
                event.preventDefault();
            }

            file = (input) ? fileInput[0].files[0] : event.dataTransfer.files[0];
            name = file.name;
            type = file.type;
            size = file.size;

            reader = new FileReader();

            reader.onload = function(evt) 
            {
              
              if (checkSize(size) && isTypeValid(type)) 
              {

                var file = {};

                file['data'] = evt.target.result;
                file['name'] = name;
                file['size'] = size;
                file['type'] = type;

                if(input)
                {
                  resetFileInput();
                }

                return scope.$apply(function () 
                {
                  //scope.fileError = false;
                  scope.fileError['visible']= false;

                  scope.onFileChange({file:file});

                  scope.fileLoading = false;

                });
              }

            };

            if(attrs.readFileAs == 'text')
            {
              reader.readAsText(file);
            }
            else
            {
              reader.readAsDataURL(file);
            }

            return false;
        };

        var container = element.parent().parent().parent().parent().parent();

        container.bind('drop', function(e){
          event.preventDefault();
        });

        container.bind('dragover', function(e){
          event.preventDefault();
        });

        container.bind('dragenter', function(e){
          event.preventDefault();
        });

        element.bind('dragover', processDragOverOrEnter);

        element.bind('dragenter', processDragOverOrEnter);

        element.bind('drop', function (event) {
          
            processFile(event,false);
        });
      }
    };
}])
},{}],16:[function(require,module,exports){
//'use strict';

angular.module('core')
.directive('kzSubmit', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        require: ['kzSubmit', '?form'],
        controller: ['$scope', function ($scope) {
            
            this.attempted = false;

            this.setAttempted = function() {
                this.attempted = true;
            };

            var formController = null;

            this.setFormController = function(controller) {
                formController = controller;
            };

            this.needsAttention = function (fieldModelController) {
                if (!formController) return false;

                if (fieldModelController) {
                    return fieldModelController.$invalid && 
                           (fieldModelController.$dirty || this.attempted);
                } else {
                    return formController && formController.$invalid && 
                          (formController.$dirty || this.attempted);
                }
            };
        }],
        compile: function (cElement, cAttributes, transclude) {
            return {
                pre: function(scope, formElement, attributes, controllers) 
                {
                    var submitController = controllers[0];

                    var formController = (controllers.length > 1) ? 
                                         controllers[1] : null;
                    submitController.setFormController(formController);

                    scope.kz = scope.kz || {};
                    scope.kz[attributes.name] = submitController;
                },
                post: function(scope, formElement, attributes, controllers) 
                {

                    var submitController = controllers[0];
                    var formController = (controllers.length > 1) ? 
                                         controllers[1] : null;

                    var fn = $parse(attributes.kzSubmit);

                    formElement.bind('submit', function (event) {
                        submitController.setAttempted();
                        if (!scope.$$phase) scope.$apply();

                        if (!formController.$valid) return false;
                        
                        if(scope.safeApply)
                        {
                            scope.safeApply(function() {
                                fn(scope, {$event:event});
                            });
                        }
                        else
                        {
                            scope.$apply(function() {
                                fn(scope, {$event:event});
                            });
                        }
                    });
                }
            };
        }
    }   
}]);
},{}],17:[function(require,module,exports){
//'use strict';

angular.module('core')
.directive('visibleToRole', ['Auth', function(Auth) {
    
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {
            
            var currentDisplayValue = element.css('display') || 'block';
            var roleAccessLevel = Auth.accessLevels[attrs.visibleToRole];

            if (!roleAccessLevel) {

                return;
            }

            currentDisplayValue = currentDisplayValue == 'none' ? 'block' : currentDisplayValue;
            
            $scope.user = Auth.user;
            $scope.$watch('user', function (user) {

                if (!user.role) {

                    return;
                }

                element.css('display', !Auth.authorize(roleAccessLevel, user.role) ? 'none' : currentDisplayValue);

            }, true);
        }
    };
}]);
},{}],18:[function(require,module,exports){
'use strict';

/* Filters */

angular.module('core').
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);

},{}],19:[function(require,module,exports){
'use strict';

var globalRoles = require('../../utils/roles');

/* Services */
angular.module('core')
  .factory('Auth', ['$http', '$rootScope',
    function($http, $rootScope) {

      var userRoles = globalRoles.userRoles,
        me = {};

      var updateUser = function(user) {

        user = user || {
          username: '',
          role: 'public'
        };

        user.role = userRoles[user.role];

        angular.extend(me, user);
      };

      updateUser(window.__user);

      if (window.__user) {

        window.__user = undefined;
      }

      return {

        //Make binary AND operation i.e. role.bitMask = 010b (2), accessLevel.bitMask = 110b (6)
        //010 AND 110 = 010
        authorize: function(accessLevel, role) {

          role = role || me.role;

          return accessLevel.bitMask & role.bitMask;
        },

        isLoggedIn: function() {

          //if user is an employee or an admin then is logged in, otherwise not
          return me.role.title == userRoles.employee.title || me.role.title ==
            userRoles.admin.title;
        },

        register: function(user, success, error) {
          $http
            .post('/api/user/signup', user)
            .success(function(user) {
              updateUser(user);
              success();
            })
            .error(error);
        },

        login: function(user, success, error) {
          //console.log(user);

          $http
            .post('/api/user/signin', user)
            .success(function(user) {
              updateUser(user);
              success();
            })
            .error(error);
        },

        logout: function(success, error) {
          $http
            .post('/api/user/signout')
            .success(function() {
              updateUser();
              success();
            })
            .error(error);
        },

        setUserName: function(username) {
          var data = {
            before: me.username,
            current: me.username = username
          };
          $rootScope.$broadcast('usernameChanged', data);
          //Note: If Changin EditUser to a new State(removing it from the Modal), delete $rootScope from
          //Auth service arguments and only keep changeUser(username); in this function
        },

        accessLevels: globalRoles.accessLevels,

        userRoles: userRoles,

        user: me
      };
    }
  ]);
},{"../../utils/roles":27}],20:[function(require,module,exports){
//'use strict';

/* Services */
angular.module('core')
.factory('Colors', function (){

    var colorList = [

        /*{color:'AZUL', code:'#0000FF'},
        {color:'AZUL MARINO', code:'#120A8F'},
        {color:'AZUL OSCURO', code:'#000080'},
        {color:'BEIS', code:'#F5DEB3'},
        {color:'BLANCO', code:'#FFF'},
        {color:'BORGOÑA', code:'#800020'},
        {color:'CAFE', code:'#964B00'},
        {color:'CHOCOLATE', code:'#964B00'},
        {color:'CAMELLO', code:'#C19A6B'},
        {color:'FUCSIA', code:'#FD3F92'},
        {color:'GRIS', code:'#bebebe'},
        {color:'HIELO', code:'#A5F2F3'},
        {color:'JEANS', code:'#343f51'},
        {color:'CAQUI', code:'#f0e68c'},
        {color:'MARRON', code:'#964B00'},
        {color:'NEGRO', code:'#000'},
        {color:'NAVY', code:'#000080'},
        {color:'ORO', code:'#ffd700'},
        {color:'PLATA', code:'#C0C0C0'},
        {color:'PURPURA', code:'#660099'},
        {color:'ROSA', code:'#FFC0CB'},
        {color:'ROJO', code:'#FF0000'},
        {color:'TAUPE', code:'#483C32'},
        {color:'VERDE', code:'#00FF00'},
        {color:'VERDE OSCURO', code:'#006400'},


        {color:'CARMESI', code:'#DC143C'},
        {color:'BERMELLON', code:'#E34233'},
        {color:'ESCARLATA', code:'#FF2400'},
        {color:'GRANATE', code:'#800000'},
        {color:'CARMIN', code:'#960018'},
        {color:'AMARANTO', code:'#E52B50'},
        {color:'CHARTREUSE', code:'#7FFF00'},
        {color:'VERDE KELLY', code:'#4CBB17'},
        {color:'ESMERALDA', code:'#50C878'},
        {color:'JADE', code:'#00A86B'},
        {color:'VERDE VERONES', code:'#40826D'},
        {color:'ARLEQUIN', code:'#44944A'},
        {color:'ESPARRAGO', code:'#7BA05B'},
        {color:'VERDE OLIVA', code:'#6B8E23'},
        {color:'VERDE CAZADOR', code:'#355E3B'}*/

        {color:'AZUL', code:'#0000FF'},
        {color:'AZUL MARINO', code:'#120A8F'},
        {color:'BEIS', code:'#F5DEB3'},
        {color:'BLANCO', code:'#FFF'},
        {color:'CAFE', code:'#964B00'},
        {color:'CHOCOLATE', code:'#845331'},
        {color:'CAMELLO', code:'#C19A6B'},
        {color:'FUCSIA', code:'#FD3F92'},
        {color:'GRIS', code:'#bebebe'},
        {color:'HIELO', code:'#A5F2F3'},
        {color:'KAQUI', code:'#f0e68c'},
        {color:'MARRON', code:'#964B00'},
        {color:'NEGRO', code:'#000'},
        {color:'ORO', code:'#ffd700'},
        {color:'PLATA', code:'#C0C0C0'},
        {color:'PURPURA', code:'#660099'},
        {color:'ROSA', code:'#FFC0CB'},
        {color:'ROJO', code:'#FF0000'},
        {color:'TAUPE', code:'#483C32'},
        {color:'VERDE', code:'#00FF00'},
        {color:'VERDE OSCURO', code:'#006400'},
        {color:'NEGRO/FUCSIA', code:'#000', code2:'#FD3F92'},
        {color:'NARANJA', code:'#DF7D00'},
        {color:'AZUL/BLANCO', code:'#0000FF', code2:'#FFF'},
        {color:'NEGRO/GRIS', code:'#000', code2:'#bebebe'}

    ];

    var getColorCode = function(color)
    {
        for(var i=0; i< colorList.length;i++)
        {
            if(colorList[i].color == color)
            {
                return colorList[i].code; 
            }   
        }
    };

    return {

        colorList: colorList,
        getColorCode : getColorCode
    };

});

},{}],21:[function(require,module,exports){
'use strict';

var app = require('../utils/app');

// Use Applicaion configuration module to register a new module
app.registerModule('stock');

// Load controllers
require('./controllers/add_stock');
require('./controllers/stock');

// Load directives

// Load filters

// Load services

// Load routes
require('./config/routes');
},{"../utils/app":26,"./config/routes":22,"./controllers/add_stock":23,"./controllers/stock":24}],22:[function(require,module,exports){
'use strict';

var globalRoles = require('../../utils/roles');

// Note: You cannot inject services instances in the config, just providers. From angular docs: Configuration blocks - get executed during the provider registrations and configuration phase. Only providers and constants can be injected into configuration blocks. This is to prevent accidental instantiation of services before they have been fully configured
angular.module('stock')
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      var access = globalRoles.accessLevels;

      $stateProvider
        .state('stock', {
          url: '/stock',
          // templateUrl: '/static/src/stock/templates/index.html',
          // template: require('../templates/index.jade')(),
          controller: 'StockCtrl',
          access: access.employee,
          views: {
            'section': {
              template: require('../templates/index.jade')()
            },
          }
        })
        .state('stock.addquick', {
          url: '/add',
          templateUrl: '/static/src/stock/templates/addquick.html',
          controller: 'AddStockCtrl',
          access: access.employee
        });
    }
  ]);
},{"../../utils/roles":27,"../templates/index.jade":25}],23:[function(require,module,exports){
/* Controllers */

angular.module('stock')
  .controller('AddStockCtrl', ['$scope', '$http', '$cookieStore', '$location',
    'Colors', '$modal',
    function($scope, $http, $cookieStore, $location, Colors, $modal) {

      var API_URL = '/api/stock/'
        //var pageNo = $stateParams.pageNo || 1;
      var searchingPage;

      $scope.progress = false;
      $scope.pagination = {

        totalItems: 0,
        currentPage: 1, //pageNo,
        maxSize: 5,
        itemsPerPage: parseInt(localStorage['kz-stock-ipp']) || 10,
        setPage: function(page) {
          //console.log('page is '+page)
          //$location.path('/shoes/page/'+page);
          $scope.pagination.currentPage = page;

          for (var offset = 0, limit = $scope.pagination['itemsPerPage'], i =
            1; i < page; i++, offset += limit);

          //console.log(pageNo,offset,limit);
          $scope.pagination.getItems(offset, limit);
        },
        setItemsPerPage: function() {
          localStorage['kz-stock-ipp'] = $scope.pagination['itemsPerPage'];

          $scope.pagination.setPage($scope.pagination.currentPage);
          //reloadOnSearch: true -> NO FUNCIONA AUN CON UI-ROUTER
          //$location.search('display',$scope.pagination['itemsPerPage']);
          //$window.location.href = '/shoes';
        },
        getItems: function(offset, limit) {
          $scope.progress = true;

          $http
            .post(API_URL + 'get', {
              search: $scope.searching,
              order: $scope.order,
              offset: offset,
              limit: limit
            })
            .success(function(shoes) {
              //console.log(shoes);
              $scope.pagination['totalItems'] = shoes.count;
              $scope.items = shoes.items;
              $scope.progress = false;
            });
          /*
            .error(function (err){

                $location.path('/404');
            });
            */
        },
        search: function() {
          var page = 1;

          if ($scope.query.reference == '' &&
            $scope.query.brand == '' &&
            $scope.query.size == '' &&
            $scope.query.reference == '' &&
            $scope.query.category == '' &&
            $scope.query.color == '') {
            $scope.searching = false
            page = searchingPage;
          } else {
            $scope.searching = {};

            if ($scope.query.reference) {
              $scope.searching['reference'] = $scope.query.reference;
            }

            if ($scope.query.brand) {
              //console.log('brand!!!');
              $scope.searching['brand'] = $scope.query.brand;
            }

            if ($scope.query.size) {
              $scope.searching['size'] = $scope.query.size;
            }

            if ($scope.query.category) {
              $scope.searching['category'] = $scope.query.category;
            }

            if ($scope.query.color) {
              //console.log($scope.query.color);
              if (typeof $scope.query.color === 'object') {
                $scope.searching['color'] = $scope.query.color['color'];
              } else {
                $scope.searching['color'] = $scope.query.color;
              }
            }

            searchingPage = $scope.pagination.currentPage;
          }

          $scope.pagination.setPage(page);
        },
      };

      $scope.searching = false;
      $scope.query = {

        reference: '',
        size: '',
        brand: '',
        category: '',
        color: ''
      };
      $scope.colors = Colors.colorList;
      $scope.getColorCode = Colors.getColorCode;
      $scope.items_modified = true;
      //Tiene la desventaja de que si añadimos uno nuevo tenemos que refrescar par que aparezca, pero solo hace una request!
      $scope.references = [];
      $http.post(API_URL + 'fields', {
        field: 'reference'
      })
        .success(function(response) {
          //console.log(response);
          $scope.references = response;
        });

      /*
    //Tiene la ventaja de que si añadimos uno nuevo automaticamente aparecera, pero hace muchas requests!
    $scope.references = function(code)
    {
        return $http.post('/api/shoes/references',{ref:code})
        .then(function (response) 
        {
            return response.data;
        });
    }
    */

      $scope.delSearch = function() {
        $scope.query = {

          reference: '',
          size: '',
          brand: '',
          category: '',
          color: ''
        };

        $scope.pagination.search();
      };

      $scope.updateSearch = function(t) {

        if ($scope.query[t] == '' && $scope.searching) {
          var empty = false;

          for (var key in $scope.query) {
            if (key != t && $scope.query[key] != '') {
              empty = true;
              break;
            }
          }

          if (!empty) {
            $scope.searching = false;
            $scope.pagination.setPage(searchingPage);
          } else {
            $scope.pagination.search();
          }
        }
        /*
        if( $scope.query.reference == '' && 
            $scope.query.brand == '' && 
            $scope.query.size == '' &&
            $scope.query.reference == '' && 
            $scope.query.category == '' && 
            $scope.query.color == '' &&
            $scope.searching)
        {
            $scope.searching = false;
            $scope.pagination.setPage(searchingPage);
            return;
        }*/
      };

      $scope.caret = {

        'reference': true,
        'size': true,
        'brand': true,
        'quantity': true,
        'color': true,
        'price': true,
        'category': true
      }
      $scope.order = {
        '_id': -1
      };
      $scope.orderShoes = function(order) {

        if (order in $scope.order) {
          $scope.order[order] *= -1;
        } else {
          $scope.order = {};
          $scope.order[order] = -1;

        }

        $scope.caret[order] = !$scope.caret[order];
        $scope.pagination.setPage($scope.pagination.currentPage);
      };

      $scope.removeShoe = function(id) {
        $http.post(API_URL + 'remove', {
          id: id
        })
          .success(function(references) {
            //$scope.references = references;
            $scope.pagination.setPage($scope.pagination.currentPage);
          });
      };

      $scope.editShoe = function(id) {
        $location.path(API_URL + 'edit/' + id);
      };

      $scope.barCode = function(barcode) {

        $modal.open({

          templateUrl: 'ModalBCShoes.html',
          controller: 'ModalBCShoesCtrl',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            barcode: function() {
              return barcode;
            }
          }
        });
      };

      $scope.qrCode = function(id, has_qr, index) {
        var modalInstance = $modal.open({

          templateUrl: 'ModalQRShoes.html',
          controller: 'ModalQRShoesCtrl',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            info: function() {
              return {
                id: id,
                has_qr: has_qr
              };
            }
          }

        });

        modalInstance.result.then(function(data) {

          $scope.items[index]['has_qr'] = true;
        });
      };

      $scope.openPrint = function() {
        var modalInstance = $modal.open({

          templateUrl: 'ModalPrintShoes.html',
          controller: 'ModalPrintShoesCtrl',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            modified: function() {
              return $scope.items_modified;
            }
          }

        });

        modalInstance.result.then(function() {

          $scope.items_modified = false;
        });
      };

      $scope.openImport = function() {

        var modalInstance = $modal.open({

          templateUrl: 'ModalImportShoes.html',
          controller: 'ModalImportShoesCtrl',
          backdrop: 'static',
          keyboard: false

        });

        modalInstance.result.then(function(data) {

          /*if(data.remove)
            {
                $scope.items = data.items.slice(0, $scope.pagination['itemsPerPage']);
                $scope.pagination['totalItems'] = data.count;
            }
            else
            {
                $scope.items = $scope.items.concat(data.items).slice(0, $scope.pagination['itemsPerPage']);
                $scope.pagination['totalItems'] += data.count;
            }
            
            $scope.items_modified = true;
            */
          $http.post(API_URL + 'fields', {
            field: 'reference'
          })
            .success(function(response) {
              //console.log(response);
              $scope.references = response;
              $scope.items_modified = true;

              $scope.pagination.setPage(1);
            });
        });
      };

      if ($location.path().indexOf('page') == -1)
        $scope.pagination.getItems(0, $scope.pagination['itemsPerPage']);

    }
  ]);
},{}],24:[function(require,module,exports){
/* Controllers */

angular.module('stock')
  .controller('StockCtrl', ['$scope', '$http', '$cookieStore', '$location',
    'Colors', '$modal',
    function($scope, $http, $cookieStore, $location, Colors, $modal) {

      var API_URL = '/api/stock/'
        //var pageNo = $stateParams.pageNo || 1;
      var searchingPage;

      $scope.progress = false;
      $scope.pagination = {

        totalItems: 0,
        currentPage: 1, //pageNo,
        maxSize: 5,
        itemsPerPage: parseInt(localStorage['kz-stock-ipp']) || 10,
        setPage: function(page) {
          //console.log('page is '+page)
          //$location.path('/shoes/page/'+page);
          $scope.pagination.currentPage = page;

          for (var offset = 0, limit = $scope.pagination['itemsPerPage'], i =
            1; i < page; i++, offset += limit);

          //console.log(pageNo,offset,limit);
          $scope.pagination.getItems(offset, limit);
        },
        setItemsPerPage: function() {
          localStorage['kz-stock-ipp'] = $scope.pagination['itemsPerPage'];

          $scope.pagination.setPage($scope.pagination.currentPage);
          //reloadOnSearch: true -> NO FUNCIONA AUN CON UI-ROUTER
          //$location.search('display',$scope.pagination['itemsPerPage']);
          //$window.location.href = '/shoes';
        },
        getItems: function(offset, limit) {
          $scope.progress = true;

          $http
            .post(API_URL + 'get', {
              search: $scope.searching,
              order: $scope.order,
              offset: offset,
              limit: limit
            })
            .success(function(shoes) {
              //console.log(shoes);
              $scope.pagination['totalItems'] = shoes.count;
              $scope.items = shoes.items;
              $scope.progress = false;
            });
          /*
            .error(function (err){

                $location.path('/404');
            });
            */
        },
        search: function() {
          var page = 1;

          if ($scope.query.reference == '' &&
            $scope.query.brand == '' &&
            $scope.query.size == '' &&
            $scope.query.reference == '' &&
            $scope.query.category == '' &&
            $scope.query.color == '') {
            $scope.searching = false
            page = searchingPage;
          } else {
            $scope.searching = {};

            if ($scope.query.reference) {
              $scope.searching['reference'] = $scope.query.reference;
            }

            if ($scope.query.brand) {
              //console.log('brand!!!');
              $scope.searching['brand'] = $scope.query.brand;
            }

            if ($scope.query.size) {
              $scope.searching['size'] = $scope.query.size;
            }

            if ($scope.query.category) {
              $scope.searching['category'] = $scope.query.category;
            }

            if ($scope.query.color) {
              //console.log($scope.query.color);
              if (typeof $scope.query.color === 'object') {
                $scope.searching['color'] = $scope.query.color['color'];
              } else {
                $scope.searching['color'] = $scope.query.color;
              }
            }

            searchingPage = $scope.pagination.currentPage;
          }

          $scope.pagination.setPage(page);
        },
      };

      $scope.searching = false;
      $scope.query = {

        reference: '',
        size: '',
        brand: '',
        category: '',
        color: ''
      };
      $scope.colors = Colors.colorList;
      $scope.getColorCode = Colors.getColorCode;
      $scope.items_modified = true;
      //Tiene la desventaja de que si añadimos uno nuevo tenemos que refrescar par que aparezca, pero solo hace una request!
      $scope.references = [];
      $http.post(API_URL + 'fields', {
        field: 'reference'
      })
        .success(function(response) {
          //console.log(response);
          $scope.references = response;
        });

      /*
    //Tiene la ventaja de que si añadimos uno nuevo automaticamente aparecera, pero hace muchas requests!
    $scope.references = function(code)
    {
        return $http.post('/api/shoes/references',{ref:code})
        .then(function (response) 
        {
            return response.data;
        });
    }
    */

      $scope.delSearch = function() {
        $scope.query = {

          reference: '',
          size: '',
          brand: '',
          category: '',
          color: ''
        };

        $scope.pagination.search();
      };

      $scope.updateSearch = function(t) {

        if ($scope.query[t] == '' && $scope.searching) {
          var empty = false;

          for (var key in $scope.query) {
            if (key != t && $scope.query[key] != '') {
              empty = true;
              break;
            }
          }

          if (!empty) {
            $scope.searching = false;
            $scope.pagination.setPage(searchingPage);
          } else {
            $scope.pagination.search();
          }
        }
        /*
        if( $scope.query.reference == '' && 
            $scope.query.brand == '' && 
            $scope.query.size == '' &&
            $scope.query.reference == '' && 
            $scope.query.category == '' && 
            $scope.query.color == '' &&
            $scope.searching)
        {
            $scope.searching = false;
            $scope.pagination.setPage(searchingPage);
            return;
        }*/
      };

      $scope.caret = {

        'reference': true,
        'size': true,
        'brand': true,
        'quantity': true,
        'color': true,
        'price': true,
        'category': true
      }
      $scope.order = {
        '_id': -1
      };
      $scope.orderShoes = function(order) {

        if (order in $scope.order) {
          $scope.order[order] *= -1;
        } else {
          $scope.order = {};
          $scope.order[order] = -1;

        }

        $scope.caret[order] = !$scope.caret[order];
        $scope.pagination.setPage($scope.pagination.currentPage);
      };

      $scope.removeShoe = function(id) {
        $http.post(API_URL + 'remove', {
          id: id
        })
          .success(function(references) {
            //$scope.references = references;
            $scope.pagination.setPage($scope.pagination.currentPage);
          });
      };

      $scope.editShoe = function(id) {
        $location.path(API_URL + 'edit/' + id);
      };

      $scope.barCode = function(barcode) {

        $modal.open({

          templateUrl: 'ModalBCShoes.html',
          controller: 'ModalBCShoesCtrl',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            barcode: function() {
              return barcode;
            }
          }
        });
      };

      $scope.qrCode = function(id, has_qr, index) {
        var modalInstance = $modal.open({

          templateUrl: 'ModalQRShoes.html',
          controller: 'ModalQRShoesCtrl',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            info: function() {
              return {
                id: id,
                has_qr: has_qr
              };
            }
          }

        });

        modalInstance.result.then(function(data) {

          $scope.items[index]['has_qr'] = true;
        });
      };

      $scope.openPrint = function() {
        var modalInstance = $modal.open({

          templateUrl: 'ModalPrintShoes.html',
          controller: 'ModalPrintShoesCtrl',
          backdrop: 'static',
          keyboard: false,
          resolve: {
            modified: function() {
              return $scope.items_modified;
            }
          }

        });

        modalInstance.result.then(function() {

          $scope.items_modified = false;
        });
      };

      $scope.openImport = function() {

        var modalInstance = $modal.open({

          templateUrl: 'ModalImportShoes.html',
          controller: 'ModalImportShoesCtrl',
          backdrop: 'static',
          keyboard: false

        });

        modalInstance.result.then(function(data) {

          /*if(data.remove)
            {
                $scope.items = data.items.slice(0, $scope.pagination['itemsPerPage']);
                $scope.pagination['totalItems'] = data.count;
            }
            else
            {
                $scope.items = $scope.items.concat(data.items).slice(0, $scope.pagination['itemsPerPage']);
                $scope.pagination['totalItems'] += data.count;
            }
            
            $scope.items_modified = true;
            */
          $http.post(API_URL + 'fields', {
            field: 'reference'
          })
            .success(function(response) {
              //console.log(response);
              $scope.references = response;
              $scope.items_modified = true;

              $scope.pagination.setPage(1);
            });
        });
      };

      if ($location.path().indexOf('page') == -1)
        $scope.pagination.getItems(0, $scope.pagination['itemsPerPage']);

    }
  ]);
},{}],25:[function(require,module,exports){
var jade = require("jade/runtime");

module.exports = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("\n<section id=\"app-section\">\n  <div id=\"app-stock\" class=\"content-page\">\n    <div class=\"panel panel-default panel-custom\">\n      <div class=\"panel-heading clearfix\">\n        <h3 class=\"panel-title pull-left\">Stock de Zapatos</h3>        \n        <div class=\"btn-group pull-right\">\n          <button data-ui-sref=\"newShoe\" class=\"btn btn-default btn-custom-default\">A&ntilde;adir Nuevo</button>          \n          <button data-ui-sref=\"stock.addquick\" class=\"btn btn-default btn-custom-default\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n        </div>\n      </div>\n      <!-- end panel-heading-->\n      <div class=\"panel-heading clearfix\">\n        <div class=\"row\">\n          <div class=\"col-md-6\">\n            <div class=\"input-group input-group-sm\"><span class=\"input-group-addon\">Mostrar</span>              \n              <select data-ng-model=\"pagination.itemsPerPage\" data-ng-options=\"v for v in [10,20,40,80]\" data-ng-click=\"pagination.setItemsPerPage()\" data-ng-disabled=\"pagination.totalItems &lt; 1\" style=\"width:70px;\" class=\"form-control\"></select>              \n              <div style=\"margin-left:10px;\" class=\"btn-group pull-left\">\n                <button data-ng-click=\"openPrint()\" data-ng-disabled=\"pagination.totalItems &lt; 1\" class=\"btn btn-default btn-sm btn-custom-default\"><span class=\"glyphicon glyphicon-print\"></span></button>                \n                <button type=\"button\" data-ng-click=\"openImport()\" class=\"btn btn-default btn-sm btn-custom-default\">Importar</button>                \n                <button data-ng-disabled=\"pagination.totalItems &lt; 1\" data-ng-href=\"/api/shoes/export/csv\" download=\"zapatos.csv\" target=\"_self\" class=\"btn btn-default btn-sm btn-custom-default\">Exportar</button>\n              </div>\n            </div>\n          </div>          \n          <div class=\"col-md-6\">\n            <div class=\"pull-right\">\n              <div class=\"input-group input-group-sm\">\n                <input type=\"text\" data-ng-model=\"query.reference\" data-typeahead=\"item for item in references | filter:$viewValue | limitTo:10\" autocomplete=\"off\" placeholder=\"Buscar Zapatos\" data-ng-disabled=\"pagination.totalItems &lt; 1 &amp;&amp; !searching\" data-typeahead-on-select=\"pagination.search()\" data-ng-change=\"updateSearch('reference')\" class=\"form-control\"/>                <span class=\"input-group-btn\">\n                  <button type=\"button\" data-ng-disabled=\"!searching\" data-ng-click=\"delSearch()\" class=\"btn btn-default btn-sm btn-custom-default\"><span class=\"glyphicon glyphicon-trash\"></span></button>                  \n                  <button type=\"button\" data-ng-disabled=\"pagination.totalItems &lt; 1 &amp;&amp; !searching\" data-ui-sref=\"shoes.search\" class=\"btn btn-default btn-sm btn-custom-default\"><span class=\"glyphicon glyphicon-zoom-in\"></span></button></span>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n      <!-- end panel-heading-->\n      <div data-ui-view=\"\"></div>      \n      <div class=\"panel-body\">\n        <div data-ng-show=\"pagination.totalItems &gt; 0 &amp;&amp; !progress\" class=\"table-responsive\">\n          <table class=\"table text-center\">\n            <thead>\n              <tr>\n                <th>Referencia <a data-ng-click=\"orderShoes('reference')\"><span data-ng-show=\"caret['reference']\" class=\"caret\"></span></a>\n                  <div data-ng-show=\"!caret['reference']\" data-ng-click=\"orderShoes('reference')\" class=\"dropup\"><span class=\"caret\"></span></div>\n                </th>              \n                <th>Marca <a data-ng-click=\"orderShoes('brand')\"><span data-ng-show=\"caret['brand']\" class=\"caret\"></span></a>\n                  <div data-ng-show=\"!caret['brand']\" data-ng-click=\"orderShoes('brand')\" class=\"dropup\"><span class=\"caret\"></span></div>\n                </th>              \n                <th>Categor&iacute;a <a data-ng-click=\"orderShoes('category')\"><span data-ng-show=\"caret['category']\" class=\"caret\"></span></a>\n                  <div data-ng-show=\"!caret['category']\" data-ng-click=\"orderShoes('category')\" class=\"dropup\"><span class=\"caret\"></span></div>\n                </th>              \n                <th>Color <a data-ng-click=\"orderShoes('color')\"><span data-ng-show=\"caret['color']\" class=\"caret\"></span></a>\n                  <div data-ng-show=\"!caret['color']\" data-ng-click=\"orderShoes('color')\" class=\"dropup\"><span class=\"caret\"></span></div>\n                </th>              \n                <th>Talla <a data-ng-click=\"orderShoes('size')\"><span data-ng-show=\"caret['size']\" class=\"caret\"></span></a>\n                  <div data-ng-show=\"!caret['size']\" data-ng-click=\"orderShoes('size')\" class=\"dropup\"><span class=\"caret\"></span></div>\n                </th>              \n                <th>Precio <a data-ng-click=\"orderShoes('price')\"><span data-ng-show=\"caret['price']\" class=\"caret\"></span></a>\n                  <div data-ng-show=\"!caret['price']\" data-ng-click=\"orderShoes('price')\" class=\"dropup\"><span class=\"caret\"></span></div>\n                </th>              \n                <th>Cantidad <a ng-click=\"orderShoes('quantity')\"><span ng-show=\"caret['quantity']\" class=\"caret\"></span></a>\n                  <div ng-show=\"!caret['quantity']\" ng-click=\"orderShoes('quantity')\" class=\"dropup\"><span class=\"caret\"></span></div>\n                </th>              \n                <th>Acci&oacute;n</th>\n              </tr>\n            </thead>          \n            <tbody>\n              <tr data-ng-repeat=\"item in items\" data-ng-class=\"{active: ($index%2)==0}\">\n                <td>{{item.reference}}</td>              \n                <td>{{item.brand}}</td>              \n                <td>{{item.category}}</td>              \n                <td><span style=\"background-color:{{getColorCode(item.color)}};\" class=\"color_circle\"></span> {{item.color}}</td>              \n                <td>{{item.size}}</td>              \n                <td>{{item.price}} &euro;</td>              \n                <td>{{item.quantity}} <span ng-pluralize=\"\" count=\"item.quantity\" when=\"{'1': 'ud.','other': 'uds.'}\"></span></td>              \n                <td><a data-ng-click=\"editShoe(item['_id'])\" title=\"Ver Detalle\" class=\"btn btn-success btn-sm\"><span class=\"glyphicon glyphicon-edit\"></span></a>                <a data-ng-click=\"removeShoe(item['_id'])\" title=\"Borrar\" class=\"btn btn-danger btn-sm\"><span class=\"glyphicon glyphicon-remove\"></span></a>                <a ng-class=\"{'btn-info':item['has_qr'],'btn-warning':!item['has_qr']}\" data-ng-click=\"qrCode(item['_id'], item['has_qr'], $index)\" title=\"Código QR\" class=\"btn btn-sm\"><span class=\"glyphicon glyphicon-qrcode\"></span></a>                <a data-ng-click=\"barCode(item['barcode'])\" title=\"Código de Barras\" class=\"btn btn-primary btn-sm\"><span class=\"glyphicon glyphicon-barcode\"></span></a></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>      \n        <div data-ng-show=\"pagination.totalItems &lt; 1 &amp;&amp; !searching &amp;&amp; !progress\" style=\"margin:50px;\">\n          <p class=\"text-center\">Vaya tela, tienes una tienda en la que ... <strong>!No hay ning&uacute;n zapato!</strong></p>\n          <p class=\"text-center\">Deber&iacute;as incluir alguno. Si quieres, tambi&eacute;n puedes importarlos desde un fichero CSV.</p>\n        </div>      \n        <div data-ng-show=\"pagination.totalItems &lt; 1 &amp;&amp; searching\" style=\"margin:50px\" class=\"alert alert-warning\">\n          <p class=\"text-center\"><strong>!No hay ning&uacute;n zapato con los criterios de b&uacute;squeda dados!</strong></p>\n        </div>      \n        <div ng-show=\"progress\" style=\"width:300px;margin:20px auto;\">\n          <div class=\"progress progress-striped active\">\n            <div style=\"width: 100%\" class=\"progress-bar\"></div>\n          </div>\n        </div>\n      </div>    \n      <div data-ng-show=\"pagination.numPages &gt; 1 &amp;&amp; !progress\" class=\"panel-footer\">\n        <div class=\"text-center\">\n          <pagination boundary-links=\"true\" total-items=\"pagination.totalItems\" max-size=\"pagination.maxSize\" items-per-page=\"pagination.itemsPerPage\" ng-model=\"pagination.currentPage\" num-pages=\"pagination.numPages\" previous-text=\"‹\" next-text=\"›\" first-text=\"«\" last-text=\"»\" on-select-page=\"pagination.setPage(page)\" class=\"pagination-sm\"></pagination>\n        </div>      <small ng-show=\"pagination.itemsPerPage*pagination.currentPage&gt;pagination.totalItems\" class=\"pull-left\">Mostrados {{pagination.itemsPerPage*(pagination.currentPage-1)}} al {{pagination.totalItems}} ({{pagination.totalItems}} resultados en {{pagination.numPages}} p&aacute;ginas)</small>      <small ng-show=\"pagination.itemsPerPage*pagination.currentPage&lt;=pagination.totalItems\" class=\"pull-left\">Mostrados {{pagination.itemsPerPage*(pagination.currentPage-1)}} al {{pagination.itemsPerPage*pagination.currentPage}} ({{pagination.totalItems}} resultados en {{pagination.numPages}} p&aacute;ginas)</small>\n      </div>    \n      <div data-ng-show=\"pagination.numPages &lt;= 1\" class=\"panel-footer\"></div>\n    </div>\n  </div>\n  <script type=\"text/ng-template\" id=\"ModalImportShoes.html\">\n    <div class=\"modal-content\">\n    <div class=\"modal-header\">\n    <button type=\"button\" class=\"close\" ng-click=\"cancel()\">&times;</button>\n    <h4 class=\"modal-title\">Importar Zapatos</h4>\n    </div>\n    <div class=\"modal-body\">\n    <div data-file-dropzone=\"['text/csv', 'text/plain']\" data-max-file-size=\"3\" data-on-file-change=\"newFile(file)\" data-file-input=\"true\" data-upload-file-text=\"Arrastra tus ficheros CSV aquí &hellip;\" data-file-error=\"fileError\" data-file-loading=\"progress\" data-read-file-as=\"text\" style=\"margin-top:20px\">\n    </div>\n    <div ng-switch=\"fileError.code\" ng-show=\"fileError.visible\" class=\"alert alert-danger\" style=\"margin-top:10px;\">\n    <p ng-switch-when=\"1\" class=\"text-center\">El fichero supera los 3 MBytes</p>\n    <p ng-switch-when=\"2\" class=\"text-center\">¡Selecciona un fichero CSV!</p>\n    <p ng-switch-when=\"3\" class=\"text-center\">¡Algunos datos estan duplicados o estan mal formateados!</p>\n    <p ng-switch-default class=\"text-center\">{{fileError.msg}}</p>\n    </div>\n    <div ng-show=\"progress\" class=\"progress progress-striped active\">\n    <div class=\"progress-bar\" style=\"width: 100%\"></div>\n    </div>\n    <div ng-show=\"files.length > 0\" style=\"margin-top:20px;\">\n    <div class=\"input-group\" style=\"width:350px;margin:auto;\">\n    <span class=\"input-group-addon\">\n    <input type=\"checkbox\" ng-model=\"$parent.remove\" >\n    </span>\n    <p class=\"form-control text-center\">Borrar todos los zapatos antiguos</p>\n    </div>\n    </div>\n    <div ng-show=\"displayCSV\" style=\"margin-top:20px;\">\n    <tabset>\n    <tab ng-repeat=\"file in files\" active=\"tab.active\" disabled=\"tab.disabled\">\n    <tab-heading>{{file.name}}<span class=\"close\" style=\"margin-left:15px;\" ng-click=\"closeTab($index)\">&times;</span></tab-heading>\n    <div json-table=\"{{$index}}\" json-table-data=\"$parent.files\" json-table-loaded=\"$parent.progress\" json-table-active=\"$parent.displayCSV\" style=\"overflow:auto;height:220px;\"></div>\n    </tab>\n    </tabset>\n    </div>\n    </div>\n    <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cancelar</button>\n    <button type=\"button\" class=\"btn btn-info\" ng-show=\"files.length > 0 && !displayCSV\" ng-click=\"display()\">Ver</button>\n    <button type=\"button\" class=\"btn btn-primary\" ng-show=\"files.length > 0\" ng-click=\"ok()\">Importar Zapatos</button>\n    </div>\n    </div><!-- /.modal-content -->\n  </script>\n  <script type=\"text/ng-template\" id=\"ModalQRShoes.html\">\n    <div class=\"modal-content\">\n    <div class=\"modal-header\">\n    <h4 class=\"modal-title\">Código QR</h4>\n    </div>\n    <div class=\"modal-body\">\n    <p ng-show=\"progress\" class=\"text-center\">Espere por favor &hellip;</p>\n    <div ng-show=\"progress\" class=\"progress progress-striped active\">\n    <div class=\"progress-bar\" style=\"width: 100%\"></div>\n    </div>\n    <p ng-show=\"!progress && !error\">Ahora puedes imprimir o copiar su código QR y comenzar a leerlo con su lector QR preferido</p>\n    <div ng-show=\"error\" class=\"alert alert-danger\" style=\"margin-top:10px;\">\n    <p class=\"text-center\">Ha ocurrido un error mientras obteníamos el código QR. ¡Ya hemos avisado a Zuri!</p>\n    </div>\n    <div class=\"text-center\"><img ng-show=\"!progress && !error\" src=\"{{qr}}\"/></div>\n    </div>\n    <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-info\" ng-show=\"!progress && !error\" ng-click=\"print()\">Imprimir</button>\n    <button type=\"button\" class=\"btn btn-info\" ng-show=\"!progress\" ng-click=\"ok()\">Salir</button>\n    </div>\n    </div><!-- /.modal-content -->\n  </script>\n  <script type=\"text/ng-template\" id=\"ModalBCShoes.html\">\n    <div class=\"modal-content\">\n    <div class=\"modal-header\">\n    <h4 class=\"modal-title\">Código de Barras</h4>\n    </div>\n    <div class=\"modal-body\">\n    <p ng-show=\"progress\" class=\"text-center\">Espere por favor &hellip;</p>\n    <div ng-show=\"progress\" class=\"progress progress-striped active\">\n    <div class=\"progress-bar\" style=\"width: 100%\"></div>\n    </div>\n    <p ng-show=\"!progress && !error\" style=\"margin-bottom:30px;\">Ahora puedes imprimir o copiar el código de barras que se muestra a continuación. Nota: El código de barras sigue el modelo <stron>Code 128</strong>.</p>\n    <div ng-show=\"error\" class=\"alert alert-danger\" style=\"margin-top:10px;\">\n    <p class=\"text-center\">Ha ocurrido un error mientras obteníamos el código de barras. ¡Ya hemos avisado a Zuri!</p>\n    </div>\n    <div class=\"text-center\">\n    <img img-load=\"barcode\" img-load-error=\"onError(index)\" img-load-success=\"progress = false\" ng-show=\"!progress && !error\" />\n    </div>\n    </div>\n    <div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-info\" ng-show=\"!progress && !error\" ng-click=\"print()\">Imprimir</button>\n    <button type=\"button\" class=\"btn btn-info\" ng-show=\"!progress\" ng-click=\"ok()\">Salir</button>\n    </div>\n    </div><!-- /.modal-content -->\n  </script>\n  <script type=\"text/ng-template\" id=\"ModalPrintShoes.html\">\n    <div class=\"modal-content\">\n    <div class=\"modal-header\">\n    <h4 class=\"modal-title\">Impresión Códigos de Barras</h4>\n    </div>\n    <div class=\"modal-body\">\n    <p ng-show=\"progress\" class=\"text-center\">Espere por favor &hellip;</p>\n    <div ng-show=\"progress\" class=\"progress progress-striped active\">\n    <div class=\"progress-bar\" style=\"width: 100%\"></div>\n    </div>\n    <p ng-show=\"!progress && !error\" style=\"margin-bottom:30px;\">Ya puedes descargar una copia con todos los códigos de barra de tus zapatos e imprimirla. Nota: El documento generado está en formato pdf, con estilo de página A4.</p>\n    <div ng-show=\"error\" class=\"alert alert-danger\" style=\"margin-top:10px;\">\n    <p class=\"text-center\">Ha ocurrido un error mientras obteníamos el código de barras. ¡Ya hemos avisado a Zuri!</p>\n    </div>\n    </div>\n    <div class=\"modal-footer\">\n    <a class=\"btn btn-info\" ng-show=\"!progress && !error\" ng-href=\"{{pdf}}\" download=\"zapatos_barcodes.pdf\" target=\"_self\">Descargar</a>\n    <button type=\"button\" class=\"btn btn-info\" ng-show=\"!progress\" ng-click=\"ok()\">Salir</button>\n    </div>\n    </div><!-- /.modal-content -->\n  </script>\n</section>");;return buf.join("");
};
},{"jade/runtime":2}],26:[function(require,module,exports){
'use strict';

// Init the application configuration module for AngularJS application

// Init module configuration options
var applicationModuleName = 'kalzate';
var applicationModuleVendorDependencies = ['ngCookies', 'ngResource',
  'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap',
  'ui.utils'
];

// Add a new vertical module
var registerModule = function(moduleName, dependencies) {
  // Create angular module
  angular.module(moduleName, dependencies || []);

  // Add the module to the AngularJS configuration file
  angular.module(applicationModuleName).requires.push(moduleName);

};

module.exports = {

  applicationModuleName: applicationModuleName,
  applicationModuleVendorDependencies: applicationModuleVendorDependencies,
  registerModule: registerModule

};
},{}],27:[function(require,module,exports){
(function(exports) {

  var config = {

    /* List all the roles you wish to use in the app
     * You have a max of 31 before the bit shift pushes the accompanying integer out of
     * the memory footprint for an integer
     */
    roles: [
      'public', //01b
      'employee', //10b
      'admin'
    ], //100b

    /*
        Build out all the access levels you want referencing the roles listed above
        You can use the "*" symbol to represent access to all roles
         */
    accessLevels: {
      'public': "*", //111b
      'anon': ['public'], //01b, only public, employee and admin not awolled
      'employee': ['employee', 'admin'], //110b
      'admin': ['admin'] //100b
    }

  }

  exports.userRoles = buildRoles(config.roles);
  exports.accessLevels = buildAccessLevels(config.accessLevels, exports.userRoles);
  /*
        Method to build a distinct bit mask for each role
        It starts off with "1" and shifts the bit to the left for each element in the
        roles array parameter
     */

  function buildRoles(roles) {

    var bitMask = "01";
    var userRoles = {};

    for (var role in roles) {
      var intCode = parseInt(bitMask, 2);
      userRoles[roles[role]] = {
        bitMask: intCode,
        title: roles[role]
      };
      bitMask = (intCode << 1).toString(2)
    }

    return userRoles;
  }

  /*
    This method builds access level bit masks based on the accessLevelDeclaration parameter which must
    contain an array for each access level containing the allowed user roles.
     */
  function buildAccessLevels(accessLevelDeclarations, userRoles) {

    var accessLevels = {};
    for (var level in accessLevelDeclarations) {

      if (typeof accessLevelDeclarations[level] == 'string') {
        if (accessLevelDeclarations[level] == '*') {

          var resultBitMask = '';

          for (var role in userRoles) {
            resultBitMask += "1"
          }
          //accessLevels[level] = parseInt(resultBitMask, 2);
          accessLevels[level] = {
            bitMask: parseInt(resultBitMask, 2),
            title: accessLevelDeclarations[level]
          };
        } else console.log("Access Control Error: Could not parse '" +
          accessLevelDeclarations[level] +
          "' as access definition for level '" + level + "'")

      } else {

        var resultBitMask = 0;
        for (var role in accessLevelDeclarations[level]) {
          if (userRoles.hasOwnProperty(accessLevelDeclarations[level][role]))
            resultBitMask = resultBitMask | userRoles[accessLevelDeclarations[
              level][role]].bitMask
          else console.log("Access Control Error: Could not find role '" +
            accessLevelDeclarations[level][role] +
            "' in registered roles while building access for '" + level +
            "'")
        }
        accessLevels[level] = {
          bitMask: resultBitMask,
          title: accessLevelDeclarations[level][role]
        };
      }
    }

    return accessLevels;
  }

})(module.exports);
},{}]},{},[3]);
