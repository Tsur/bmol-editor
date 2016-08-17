'use strict';

import debounce from 'debounce';

function linkHandler(scope, element, attrs, $rootScope, CanvasManager){

  // const base_img = new Image();
  // base_img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAADxJREFUWEft0MEJACAMBEHt+rpXItZgfEzg3llmJlmj825ARTzf+S2AAAECBAgQIECAAAECBAh8IVARXdukCGAlxHjlDAAAAABJRU5ErkJggg==";

  // const wheight = window.innerHeight;
  //
  // element.bind('$destroy', function() {
  //
  //   //remove event listeners that might cause memory leaks; Listeners registered to the element are automatically cleaned up when this is removed(destroyed), but if you registered a listener on a service or on a DOM node that isn't being deleted, you'll have to clean it up yourself here
  //
  //   angular
  //     .element(window)
  //     .unbind('resize');
  //
  // });
  //
  const canvas = element[0];
  const parent = element.parent()[0];

  let scrollLeft = 0;
  let scrollTop = 0;
  let lastDownTarget;
  let increment = 0;
  let shift = false;
  let drag = false;

  $rootScope.$on('game:scope', e => {

    lastDownTarget = null;

  })

  // // Set Canvas Size Dynamically
  canvas.width = parent.offsetWidth;
  canvas.height = parent.offsetHeight;

  angular
  .element(window)
  .bind('resize', debounce(function(e) {

    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;

    // horizontalScroll.querySelector('div').style.width = ((32000 - 32) + horizontalScroll.clientWidth) + 'px';

    // CanvasManager.displayGrid(context, parent.offsetWidth, parent.offsetHeight);
    CanvasManager.paint(context, parent.offsetWidth, parent.offsetHeight, scrollLeft, scrollTop);

  }, 150));

  function getCoords(canvas, clientX, clientY, scrollLeft, scrollTop){

    var rect = canvas.getBoundingClientRect();

    const wo = Math.floor(scrollLeft/32);
    const ho = Math.floor(scrollTop/32);
    const wop = scrollLeft-(wo*32);
    const hop = scrollTop-(ho*32);

    // console.log(wo, ho, wop, hop);

    const x = Math.floor((clientX - rect.left + wop) / 32) + wo;
    const y = Math.floor((clientY - rect.top + hop) / 32) + ho;

    return {x, y};

  }

  element
  .unbind("mousedown")
  .bind("mousedown", function(e) {

    lastDownTarget = event.target;

    const coords = getCoords(canvas, e.clientX, e.clientY, scrollLeft, scrollTop);
    // console.log(x,y);

    shift ? CanvasManager.unset(context, coords.x, coords.y) : CanvasManager.set(context, coords.x, coords.y);

    CanvasManager.paint(context, parent.offsetWidth, parent.offsetHeight, scrollLeft, scrollTop);

    drag = true;

    return false;

  });

  element
  .unbind("mouseup")
  .bind("mouseup", function(e) {

    drag = false;

    return false;

  });


  element
  .unbind("mousemove")
  .bind("mousemove", debounce(function(e) {

    CanvasManager.setCoords(getCoords(canvas, e.clientX, e.clientY, scrollLeft, scrollTop));

    if(drag){

      const coords = getCoords(canvas, e.clientX, e.clientY, scrollLeft, scrollTop);

      shift ? CanvasManager.unset(context, coords.x, coords.y) : CanvasManager.set(context, coords.x, coords.y);

      CanvasManager.paint(context, parent.offsetWidth, parent.offsetHeight, scrollLeft, scrollTop);

    }

    // console.log(CanvasManager.coords.x, CanvasManager.coords.y);
    return false;

  }, 10));

  document.addEventListener('keydown', debounce(e => {

    if(lastDownTarget != canvas) return;

    if(e.keyIdentifier === "Right"){

      if(scrollLeft >= 32000 - parent.offsetWidth) return;

      scrollLeft += (10 + increment);

    }

    if(e.keyIdentifier === "Left"){

      if(scrollLeft <= 0) return;

      scrollLeft -= (10 + increment);

    }

    if(e.keyIdentifier === "Down"){

      if(scrollTop >= 32000 - parent.offsetHeight) return;

      scrollTop += (10 + increment);

    }

    if(e.keyIdentifier === "Up"){

      if(scrollTop <= 0) return;

      scrollTop -= (10 + increment);

    }

    if(e.keyIdentifier === "Shift"){

      shift = true;

    }

    horizontalScroll.scrollLeft = scrollLeft;
    verticalScroll.scrollTop = scrollTop;

    CanvasManager.paint(context, parent.offsetWidth, parent.offsetHeight, scrollLeft, scrollTop);

    increment += 10;

  }, 10));

  document.addEventListener('keyup', e => {

    if(lastDownTarget != canvas) return;

    if(e.keyIdentifier === "Shift"){

      shift = false;

    }

    // console.log(increment);

    increment = 0;

  });

  const horizontalScroll = $('.ui-map-horizontal-scrollbar')[0];
  const verticalScroll = $('.ui-map-vertical-scrollbar')[0];

  horizontalScroll.querySelector('div').style.width = '32000px';
  horizontalScroll.querySelector('div').style.height = '1px';

  verticalScroll.querySelector('div').style.height = '32000px';
  verticalScroll.querySelector('div').style.width = '1px';

  // console.log(parent.offsetWidth,(32000 + (parent.offsetWidth-(32*Math.floor(parent.offsetWidth/32)))));

  horizontalScroll.onscroll = debounce(e => {

    scrollLeft = horizontalScroll.scrollLeft;

    CanvasManager.paint(context, parent.offsetWidth, parent.offsetHeight, scrollLeft, scrollTop);

    return false;

  }, 10);

  verticalScroll.onscroll = debounce(e => {

    scrollTop = verticalScroll.scrollTop;

    CanvasManager.paint(context, parent.offsetWidth, parent.offsetHeight, scrollLeft, scrollTop);

    return false;

  }, 10);

  // var width = scope.size.width * 32;
  // var height = scope.size.height * 32;
  const context = canvas.getContext("2d");

  // CanvasManager.paint(context, parent.offsetWidth, parent.offsetHeight);

  // CanvasManager.displayGrid(context, parent.offsetWidth, parent.offsetHeight);


      // for (var i = 0; i < width; i++) {
      //   for (var j = 0; j < height; j++) {
      //     context.drawImage(base_img, 32 * i, 32 * j, 32, 32);
      //   }
      // }

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

function BaseMap($rootScope, SpritesManager, CanvasManager){

    return {

      link: (scope, element, attrs) => linkHandler(scope, element, attrs, $rootScope, CanvasManager)

    };
}

BaseMap.$inject = ['$rootScope', 'SpritesManager', 'CanvasManager'];

export default BaseMap;
