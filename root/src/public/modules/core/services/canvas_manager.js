'use strict';

import settings from '../../../../settings/init';
import * as canvasUtil from '../../../../common/lib/canvas';
import _ from 'lodash';

class CanvasManager {

  constructor(SpritesManager){

    this.SpritesManager = SpritesManager;
    this.currentSprite = 0;
    this.dragging = false;
    this.deleting = false;
    this.out = false;
    this.coords = {};
    this.map = {

      version: '1.0',
      info: 'Bmol Map Editor',
      desc: 'This is a map example',
      width: 1000,
      height: 1000,
      layer: []
    }

    this.currentX = 0;
    this.currentY = 0;

    this.initMap();

  }

  initMap(){

    for (let i=0; i < this.map.width; i++){

      this.map.layer[i] = [];

      for (let j=0; j < this.map.height; j++){

        this.map.layer[i][j] = 0;

      }
    }

  }

  set(canvasContext, x, y, widthOffset=0, heightOffset=0){

    if(!this.SpritesManager.getID()) return;

    const wo = Math.floor(widthOffset/32);
    const ho = Math.floor(heightOffset/32);

    console.log(x+wo, y+ho);

    this.map.layer[x+wo][y+ho] = this.SpritesManager.getID();

    // const image = this.SpritesManager.spr(this.map.layer[x][y]);
    //
    // if(image) canvasUtil.paintTile(canvasContext, x*32, y*32, image);

  }

  paint(canvasContext, width, height, widthOffset=0, heightOffset=0){

    if(!this.SpritesManager.isLoaded()) return;

    const wo = Math.floor(widthOffset/32);
    const ho = Math.floor(heightOffset/32);
    const wop = widthOffset-(wo*32);
    const hop = heightOffset-(ho*32);

    const verticalLines = Math.floor(width/32);
    const horizontalLines = Math.floor(height/32);

    console.log(wo, widthOffset, wop);

    canvasUtil.clearTile(canvasContext, 0, 0, width, height);

    for (let i=0; i <= horizontalLines ; i++){

      for (let j=0; j <= verticalLines; j++){

        if(!this.map.layer[i+wo][j+ho]) {
            continue;
        }

        canvasUtil.paintTile(canvasContext, (i*32)-wop, (j*32)-hop, this.SpritesManager.spr(this.map.layer[i+wo][j+ho]));

      }
    }

  }

  displayGrid(canvasContext, width, height){

    const verticalLines = Math.floor(width/32);
    const horizontalLines = Math.floor(height/32);

    // Draw vertical lines
    _.forEach(_.range(1, verticalLines+1), line => canvasUtil.paintLine(canvasContext, line*32, 0, line*32, height, "#FFF", 0.5));

    // Draw horizontal lines
    _.forEach(_.range(1, horizontalLines+1), line => canvasUtil.paintLine(canvasContext, 0, line*32, width, line*32, "#FFF", 0.5));


  }

  getCoords(i) {

    return { x: i % 80, y: i / 80};

  }

  static factory(SpritesManager){

    return new CanvasManager(SpritesManager);

  }

}

CanvasManager.factory.$inject = ['SpritesManager'];

export default CanvasManager;
