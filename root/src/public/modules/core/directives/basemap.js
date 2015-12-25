'use strict';

class BaseMap {

  constructor(SpriteManager, CanvasManager){

  }

  link(scope, element, attrs){

    const base_img = new Image();
    base_img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAADxJREFUWEft0MEJACAMBEHt+rpXItZgfEzg3llmJlmj825ARTzf+S2AAAECBAgQIECAAAECBAh8IVARXdukCGAlxHjlDAAAAABJRU5ErkJggg==";

    const wheight = window.innerHeight;

    element.bind('$destroy', function() {

      //remove event listeners that might cause memory leaks; Listeners registered to the element are automatically cleaned up when this is removed(destroyed), but if you registered a listener on a service or on a DOM node that isn't being deleted, you'll have to clean it up yourself here

      angular
        .element(window)
        .unbind('resize');

    });

    var canvas = element[0];

    // Set Canvas Size Dynamically
    canvas.width = scope.size.width;
    canvas.height = scope.size.height;

    // Paint Canvas with grid image(base_img)
    var width = canvas.width / 32;
    var height = canvas.height / 32;
    var context = canvas.getContext("2d");

    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        context.drawImage(base_img, 32 * i, 32 * j, 32, 32);
      }
    }

    // Resize canvas size on windows resizing
    // var parent = element.parent()[0];
    //
    // parent.style.height = (wheight - 160) + 'px';
    //
    // angular
    //   .element(window)
    //   .bind('resize', function(e) {
    //
    //     var increment = window.innerHeight - wheight;
    //     var cheight = parseInt(parent.style.height);
    //
    //     wheight = window.innerHeight;
    //
    //     if (cheight < wheight - 160) {
    //       parent.style.height = (cheight + increment) + 'px';
    //     } else {
    //       parent.style.height = (wheight - 160) + 'px';
    //     }
    //
    //   });
    //
    // //Mouse Up -> Draw Sprite
    // element
    //   .unbind("mouseup")
    //   .bind("mouseup", function(e) {
    //
    //     if (scaling) {
    //       context.scale(1.2, 1.2);
    //       context.drawImage(canvas, 0, 0);
    //       return false;
    //     }
    //
    //     var img = new Image(),
    //       spr = SpriteManager.read()[CanvasManager.currentSprite]['spr'];
    //
    //     spr = (spr.length > 1) ? spr[Math.floor((Math.random() * (spr.length - 1)))] : spr[0];
    //     img.src = SpriteManager.get(spr);
    //     context.drawImage(img, 32 * CanvasManager.coords.x, 32 * CanvasManager.coords.y, 32, 32);
    //
    //     CanvasManager.dragging = false;
    //     // console.log('draggin off');
    //     return false;
    //   });
    //
    // var scaling = false;
    //
    // //Mouse Down
    // element
    //   .unbind("mousedown")
    //   .bind("mousedown", function(e) {
    //
    //     if (e.which == 2) {
    //       // context.scale(10,10);
    //       // CanvasManager.scalex = 2;
    //       // CanvasManager.scaley= 2;
    //       scaling = true;
    //       return false;
    //     }
    //
    //     CanvasManager.dragging = true;
    //     // console.log('draggin on');
    //
    //     // self.c_dragging = true;
    //     return false;
    //   });
    //
    // var mousePos = {};
    // var dragging = false;
    //
    // var spr;
    //
    // element
    //   .unbind("mousemove")
    //   .bind("mousemove", function(e) {
    //
    //     var rect = canvas.getBoundingClientRect();
    //
    //     mousePos.x = Math.floor((e.clientX - rect.left) / 32);
    //     mousePos.y = Math.floor((e.clientY - rect.top) / 32);
    //     // mousePos.x = mousePos.x < 0 ? 0 : mousePos.x;
    //     // mousePos.y = mousePos.y < 0 ? 0 : mousePos.y;
    //
    //     // CanvasManager.coords = mousePos;
    //
    //     if (CanvasManager.dragging) {
    //
    //
    //       if (CanvasManager.deleting) {
    //
    //       }
    //       // console.log('draggin runing');
    //       var img = new Image();
    //
    //       spr = SpriteManager.read()[CanvasManager.currentSprite]['spr'];
    //       spr = (spr.length > 1) ? spr[Math.floor((Math.random() * (spr.length - 1)))] : spr[0];
    //       img.src = SpriteManager.get(spr);
    //       context.drawImage(img, 32 * mousePos.x, 32 * mousePos.y, 32, 32);
    //     }
    //
    //     return false;
    //   });

  }

  static factory(SpriteManager, CanvasManager){

    BaseMap.instance = new BaseMap(SpriteManager, CanvasManager);

    return BaseMap.instance;

  }

}

BaseMap.factory.$inject = [];//['SpriteManager', 'CanvasManager'];

export default BaseMap;
