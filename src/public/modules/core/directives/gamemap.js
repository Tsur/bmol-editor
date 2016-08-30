'use strict';

function linkHandler(scope, element, attrs, $rootScope, CanvasManager){

  let lastDownTarget;
  let instantiated = false;
  let running = false;
  let left = 0;
  let top = 0;

  $(element[0]).click(e => {

    const gameContainer = document.querySelector('#game');
    const gameContainerCanvas = gameContainer.querySelector('.canvas');
    const canvas = gameContainer.querySelector('canvas');
    const context = canvas.getContext("2d");
    const player = CanvasManager.getMap().player;
    const scale = 1.6;

    canvas.width = 480*scale;
    canvas.height = 288*scale;

    gameContainerCanvas.style.width= (canvas.width+2)+"px";
    gameContainerCanvas.style.height= (canvas.height+2)+"px";

    player.ow = 0;
    player.oh = 0;

    // For using globally, but debugger freezes when using requestAnimationFrame
    // window.setSpeed = function(s){
    //
    //   player.speed = s;
    // }

    const Animator = {

      animate(player, init, frames, pos){

        if(player.animating){

            //if(player.animating != pos){

              this.nextAnimation = {init, frames, pos};
            //}

            return;
        }

        let x,y;

        switch(pos){

          case 'r':
            x = player.temple.x+1;
            y = player.temple.y;
            break;

          case 'l':
            x = player.temple.x-1;
            y = player.temple.y;
            break;

          case 'd':
            x = player.temple.x;
            y = player.temple.y+1;
            break;

          case 'u':
            x = player.temple.x;
            y = player.temple.y-1;
            break;

        }

        if(!CanvasManager.isTileWalkable(x, y)) return;

        player.animating = pos;
        player.ow = 0;
        player.oh = 0;

        var self = this;
        var countTotal = (Math.ceil(32/player.speed))/4;
        //var countTotal = (Math.ceil(32/player.speed))/4; // optimal for player.speed = 4

        const _animate = function(count){

          if(count >= 32/player.speed){

            player.outfit = init;
            player.ow = 0;
            player.oh = 0;

            player.temple.x = x;
            player.temple.y = y;

            // Update player coords
            // switch(pos){
            //
            //   case 'r':
            //     player.temple.x++;
            //     break;
            //
            //   case 'l':
            //     player.temple.x--;
            //     break;
            //
            //   case 'd':
            //     player.temple.y++;
            //     break;
            //
            //   case 'u':
            //     player.temple.y--;
            //     break;
            //
            // }

            player.animating = false;

            if(CanvasManager.runTileHover(x, y, (xl, yt) => {left = xl; top= yt;})) return;

            if(self.nextAnimation){

              Animator.animate(player, self.nextAnimation.init,  self.nextAnimation.frames, self.nextAnimation.pos);
              self.nextAnimation = null;
            }
            return;
          }

          player.outfit = frames[~~(count/countTotal) % frames.length];

          const speed = (count+1) * player.speed
          const increment =  speed > 32 ? 32 - (count * player.speed) : player.speed;

          switch(pos){

            case 'r':
              left += increment;
              player.ow += increment;
              break;

            case 'l':
              left -= increment;
              player.ow -= increment;
              break;

            case 'd':
              top += increment;
              break;

            case 'u':
              top -= increment;
              break;

          }

          setTimeout(() => _animate(count+1), 100);

        }

        _animate(0);

      }

    }

    const limitLoop = function (fn, fps) {

        // Use var then = Date.now(); if you
        // don't care about targetting < IE9
        var then = new Date().getTime();

        // custom fps, otherwise fallback to 60
        fps = fps || 60;
        var interval = 1000 / fps;

        return (function loop(time){
            requestAnimationFrame(loop);

            // again, Date.now() if it's available
            var now = new Date().getTime();
            var delta = now - then;

            if (delta > interval) {
                // Update time
                // now - (delta % interval) is an improvement over just
                // using then = now, which can end up lowering overall fps
                then = now - (delta % interval);

                // call the fn
                fn();
            }
        }(0));
    };

    const runGame = function(){

      running = true;

      limitLoop(loop, 10);

      // window.requestAnimationFrame(loop);

    };

    const loop = function(){

      if(!running) return;

      CanvasManager.paint(context, canvas.width, canvas.height, left, top, scale, true);
      // CanvasManager.paintPlayer(context, player.outfit, canvas.width, canvas.height, left, top, scale);

      // window.requestAnimationFrame(loop);

    };

    const restart = function(){

      gameContainer.style.display = 'block';

      runGame();

    }

    if(instantiated) return restart();

    instantiated = true;


    const destroyGame = function(){

      running = false;

      gameContainer.style.display = 'none';
    }

    canvas.addEventListener('mousedown', function(e) {

      lastDownTarget = event.target;

      $rootScope.$broadcast('game:scope');

    });

    document.addEventListener('keydown', e => {

      const key = e.keyCode;

      if(key === 27) destroyGame();

      if(lastDownTarget != canvas) return;

      if(e.keyIdentifier === "Right"){

        // if(scrollLeft >= 32000 - parent.offsetWidth) return;

        // Check if can move
        // if(!CanvasManager.isTileWalkable(player.temple.x+1, player.temple.y)){
        //
        //   return;
        // }

        Animator.animate(player, 322, [323, 324], 'r');

      }

      if(e.keyIdentifier === "Left"){

        if(left <= 0) return;

        // if(!CanvasManager.isTileWalkable(player.temple.x-1, player.temple.y)){
        //
        //   return;
        // }

        Animator.animate(player, 325, [326, 327], 'l');

      }

      if(e.keyIdentifier === "Down"){

        // if(scrollTop >= 32000 - parent.offsetHeight) return;

        // if(!CanvasManager.isTileWalkable(player.temple.x, player.temple.y+1)){
        //
        //   return;
        // }

        Animator.animate(player, 316, [317, 318], 'd');

      }

      if(e.keyIdentifier === "Up"){

        if(top <= 0) return;

        // if(!CanvasManager.isTileWalkable(player.temple.x, player.temple.y-1)){
        //
        //   return;
        // }

        Animator.animate(player, 319, [320, 321], 'u');

      }

    });

    gameContainer.style.display = 'block';

    runGame();

  });


}

function GameMap($rootScope, SpritesManager, CanvasManager){

    return {

      link: (scope, element, attrs) => linkHandler(scope, element, attrs, $rootScope, CanvasManager)

    };
}

GameMap.$inject = ['$rootScope', 'SpritesManager', 'CanvasManager'];

export default GameMap;
