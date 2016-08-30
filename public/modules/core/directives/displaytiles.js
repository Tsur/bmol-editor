'use strict';

angular.module('bmol.core')
  .directive('displayTiles', ['SpriteManager', 'CanvasManager',
    function(SpriteManager, CanvasManager) {

      // initializing Directive work goes here
      var wheight = window.innerHeight;

      // return directive
      return {

        // scope:{

        //   displayTiles:'='
        // },
        link: function(scope, element, attrs) {

          element.bind('$destroy', function() {

            //remove event listeners that might cause memory leaks; Listeners registered to the element are automatically cleaned up when this is removed(destroyed), but if you registered a listener on a service or on a DOM node that isn't being deleted, you'll have to clean it up yourself here

            angular
              .element(window)
              .unbind('resize');

          });

          var list = element[0];

          list.style.height = (wheight - 317) + 'px';

          angular
            .element(window)
            .bind('resize', function(e) {

              var increment = window.innerHeight - wheight;
              var cheight = parseInt(list.style.height);

              wheight = window.innerHeight;

              if (cheight < wheight - 317) {
                list.style.height = (cheight + increment) + 'px';
              } else {
                list.style.height = (wheight - 317) + 'px';
              }

            });

          element.bind('click', function(e) {

            var el = $(e.target);

            if (el.is('li')) {
              CanvasManager.currentSprite = parseInt(el.attr('rel'));

              el.parent().find('li').removeClass('active');
              el.addClass('active');

              // console.log(CanvasManager.currentSprite);
            }

          });

          scope.$watch(attrs.displayTiles, function(range) {

            // Get Range
            if (!range) {
              return;
            }

            var from = range.from || 0;
            var to = range.to || from + 1;
            var id, i;

            if (range.type == 1) {
              for (i = from; i <= to; i++) {
                id = SpriteManager.read()[i].spr[0];

                element.append('<li rel="' + i + '"><img src="' + SpriteManager.get(id) + '" /><p>' + i + '</p></li>');
              }
            } else if (range.type == 2) {
              for (i = from; i <= to; i++) {
                id = SpriteManager.read()[i].spr[0];

                element.append('<li rel="' + i + '"><img src="' + SpriteManager.get(id) + '" /><p>' + i + '</p></li>');
              }
            }
          })

        }

      };

    }
  ]);