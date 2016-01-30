'use strict';

function linkHandler(scope, element, attrs, $rootScope, CanvasManager){

  let lastDownTarget;
  let instantiated = false;
  let running = false;
  let left = 0;
  let top = 0;

  $(element[0]).click(e => {

    const gameContainer = document.querySelector('#game');
    const canvas = gameContainer.querySelector('canvas');
    const context = canvas.getContext("2d");

    const runGame = function(){

      running = true;

      window.requestAnimationFrame(loop);

    };

    const loop = function(){

      if(!running) return;

      CanvasManager.paint(context, 544, 544, left, top);
      CanvasManager.paintPlayer(context, 544, 544, left, top);

      window.requestAnimationFrame(loop);

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

        left += 4;

      }

      if(e.keyIdentifier === "Left"){

        if(left <= 0) return;

        left -= 4;

      }

      if(e.keyIdentifier === "Down"){

        // if(scrollTop >= 32000 - parent.offsetHeight) return;

        top += 4;

      }

      if(e.keyIdentifier === "Up"){

        if(top <= 0) return;

        top -= 4;

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
