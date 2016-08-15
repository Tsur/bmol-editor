'use strict';

import settings from '../../../../settings/init';
import * as canvasUtil from '../../../../common/lib/canvas';
import _ from 'lodash';

class CanvasManager {

  constructor($rootScope, SpritesManager){

    this.$rootScope = $rootScope;
    this.SpritesManager = SpritesManager;
    this.currentSprite = 0;
    this.dragging = false;
    this.deleting = false;
    this.out = false;
    this.map = {

      version: '1.0',
      info: 'Bmol Map Editor',
      desc: 'This is a map example',
      width: 1000,
      height: 1000,
      temple: {x:8, y:8, z:4},
      layer: []
    }

    this.coords = {x:0, y:0};

    this.initMap();

  }

  initMap(){

    const tiles = [12929, 536, 9879, 10355];

    for (let i=0; i < this.map.width; i++){

      this.map.layer[i] = [];

      for (let j=0; j < this.map.height; j++){

        this.map.layer[i][j] = 0; //tiles[Math.floor(Math.random() * tiles.length)];

      }

    }

  }

  setCoords(coords){

    this.coords = coords;

    this.$rootScope.$broadcast('coords:updated', coords);

  }

  set(canvasContext, x, y){

    if(!this.SpritesManager.getID()) return;

    // const wo = Math.floor(widthOffset/32);
    // const ho = Math.floor(heightOffset/32);

    // console.log(x+wo, y+ho);

    // console.log(this.SpritesManager.getID())

    // this.map.layer[x][y] = this.SpritesManager.getID();
    if(!this.SpritesManager.getID().paint)
      return this.map.layer[x][y] = this.SpritesManager.getID().rep;

    this.SpritesManager.getID().paint(this.SpritesManager.getID(), this.map, x, y);


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

    // console.log(horizontalLines, verticalLines);

    canvasUtil.clearTile(canvasContext, 0, 0, width, height);

    for (let i=0; i <= verticalLines+1; i++){

      for (let j=0; j <= horizontalLines+1; j++){

        if(!this.map.layer[i+wo] || !this.map.layer[i+wo][j+ho]) {
            continue;
        }

        canvasUtil.paintTile(canvasContext, (i*32)-wop, (j*32)-hop, this.SpritesManager.spr(this.map.layer[i+wo][j+ho]));

      }
    }

  }

  //Same but painting empty tiles too
  paintPlayer(canvasContext, width, height, widthOffset=0, heightOffset=0){

    const x = (width/2) - 16;
    const y = (height/2) - 16;

    canvasUtil.paintTile(canvasContext, x, y, this.SpritesManager.spr(128));


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

    return { x: this.currentX, y: this.currentY};

  }

  getMap(){

    return this.map;
  }

  serializeMap(){

    // const serializedMap = {};
    //
    // serializedMap.version =  this.map.version;
    // serializedMap.info =  this.map.info;
    // serializedMap.desc =  this.map.desc;
    // serializedMap.width =  this.map.width;
    // serializedMap.height =  this.map.height;

    // return JSON.stringify(serializedMap);
    return this.map;
  }

  static factory($rootScope, SpritesManager){

    return new CanvasManager($rootScope, SpritesManager);

  }

}

CanvasManager.factory.$inject = ['$rootScope', 'SpritesManager'];

export default CanvasManager;
