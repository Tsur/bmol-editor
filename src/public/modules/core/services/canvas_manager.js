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
    this.gridEnabled = false;
    this.map = {

      version: '1.0',
      vendor: 'Bmol Map Editor',
      description: 'This is a map example',
      width: 1000,
      height: 1000,
      layer: 0,
      player: {
        temple: {x:7, y:4, z:0},
        speed: 4, //can be 2, 4, 8, 16: optimal seems to be 4
        life: 100,
        mana: 100,
        outfit: 316
      },
      tiles: [{}]
    }

    this.coords = {x:0, y:0};

    this.initMap();

    // Debugging purporse
    // @todo check if(DEBUG_MODE)
    // window.CanvasManager = this;

  }

  initMap(){

    // const tiles = [12929, 536, 9879, 10355];
    //
    // for (let i=0; i < this.map.width; i++){
    //
    //   this.map.layer[i] = [];
    //
    //   for (let j=0; j < this.map.height; j++){
    //
    //     this.map.layer[i][j] = 0; //tiles[Math.floor(Math.random() * tiles.length)];
    //
    //   }
    //
    // }

  }

  setCoords(coords){

    this.coords = coords;

    this.$rootScope.$broadcast('coords:updated', coords);

  }

  isTileWalkable(x, y){

    const wo = this.map.width;
    const ho = this.map.height;

    const pos = x%wo + (y%ho)*ho;

    if(!this.map.tiles[this.map.layer][pos]) return false;

    const isWalkable = item => settings.tiles.raw[item] && ((parseInt(settings.tiles.raw[item].flags, 2) & 4) === 4);

    return this.map.tiles[this.map.layer][pos].items.every(isWalkable);
  }

  setInMap(x, y, id, type){

    const wo = this.map.width;
    const ho = this.map.height;

    const pos = x%wo + (y%ho)*ho;

    if(!this.map.tiles[this.map.layer][pos]){

      return this.map.tiles[this.map.layer][pos] = {items: [id]};

    }

    switch(type){

      case settings.types.GROUND:
        this.map.tiles[this.map.layer][pos].items[0] = id;
        break;

      default:
        this.map.tiles[this.map.layer][pos].items.push(id);

    }

  }

  set(canvasContext, x, y){

    if(!this.SpritesManager.getID()) return;

    if(!this.SpritesManager.getID().paint)
      return this.setInMap(x, y, this.SpritesManager.getID().rep ? this.SpritesManager.getID().rep: this.SpritesManager.getID());

    this.SpritesManager.getID().paint(this.SpritesManager.getID(), this, x, y);

  }

  unset(canvasContext, x, y){

    const wo = this.map.width;
    const ho = this.map.height;

    const pos = x%wo + (y%ho)*ho;

    if(this.map.tiles[this.map.layer][pos]){
      return this.map.tiles[this.map.layer][pos].items.pop();
    }

  }

  getPos(x,y){

    return x%this.map.width + (y%this.map.height)*this.map.height;
  }

  runTileHover(x,y, cb){

    const wo = this.map.width;
    const ho = this.map.height;

    const pos = x%wo + (y%ho)*ho;
    const tile = this.map.tiles[this.map.layer][pos];

    if(!tile || !tile.items || !tile.items[0]) return;

    const hoverFunction = settings.tiles.raw[tile.items[0]].hover;

    if(!hoverFunction) return;

    hoverFunction({

      movePlayer: (x,y) => {

        this.map.player.temple.x = x;
        this.map.player.temple.y = y;

        cb(32*(x-7), 32*(y-4));
      }

    }, (tile.meta || {}).hover);

    return true;
  }

  /*
  * @todo split into next tasks:
  * Paint world
  * Paint Monsters & NPCs
  * Paint Player
  * @todo optimize paint world to use a single loop
  */
  paint(canvasContext, width, height, widthOffset=0, heightOffset=0, scale=1, player=false){

    if(!this.SpritesManager.isLoaded()) return;

    const wo = Math.floor(widthOffset/32);
    const ho = Math.floor(heightOffset/32);
    const wop = widthOffset-(wo*32);
    const hop = heightOffset-(ho*32);

    const verticalLines = Math.floor(width/32);
    const horizontalLines = Math.floor(height/32);

    // console.log(horizontalLines, verticalLines);
    const playerPos = this.getPos(this.map.player.temple.x, this.map.player.temple.y);

    let ip, jp;

    canvasUtil.clearTile(canvasContext, 0, 0, width, height);

    for (let i=0; i <= verticalLines+1; i++){

      for (let j=0; j <= horizontalLines+1; j++){

        const pos = (i+wo)%this.map.width + ((j+ho)%this.map.height)*this.map.height;

        if(!this.map.tiles[this.map.layer][pos]) {
            continue;
        }

        if(pos == playerPos){
          ip = i;
          jp= j;
        }

        this.map.tiles[this.map.layer][pos].items.forEach(
          id => canvasUtil.paintTile(canvasContext, ((i*32)-wop)*scale, ((j*32)-hop)*scale, this.SpritesManager.spr(id), scale))

      }
    }

    // Paint grid
    if(!player && this.gridEnabled){

      // Paint Vertical Lines
      for (let i=0; i <= verticalLines+1; i++){
          canvasUtil.paintLine(canvasContext, (i*32)-wop, 0, (i*32)-wop, height, "#bbb", 1);
      }

      // Paint Horizontal Lines
      for (let j=0; j <= horizontalLines+1; j++){
          canvasUtil.paintLine(canvasContext, 0, (j*32)-hop, width, (j*32)-hop, "#bbb", 1);
      }
    }

    //@todo most of time there is no overable items around(normally only trees) so try to optimize it fot the common case
    if(player){

      const posUp = this.getPos(this.map.player.temple.x, this.map.player.temple.y+1);
      const posDown = this.getPos(this.map.player.temple.x, this.map.player.temple.y-1);
      const posRight = this.getPos(this.map.player.temple.x+1, this.map.player.temple.y);
      const posLeft = this.getPos(this.map.player.temple.x-1, this.map.player.temple.y);

      const itemsUp = this.map.tiles[this.map.layer][posUp] ? this.map.tiles[this.map.layer][posUp].items : null;
      const itemsDown = this.map.tiles[this.map.layer][posDown] ? this.map.tiles[this.map.layer][posDown].items : null;
      const itemsRight = this.map.tiles[this.map.layer][posRight] ? this.map.tiles[this.map.layer][posRight].items : null;
      const itemsLeft = this.map.tiles[this.map.layer][posLeft] ? this.map.tiles[this.map.layer][posLeft].items : null;
      const items = this.map.tiles[this.map.layer][playerPos] ? this.map.tiles[this.map.layer][playerPos].items : null;

      const lastItemUp = itemsUp ? _.last(itemsUp) : null;
      const lastItemDown = itemsDown ? _.last(itemsDown) : null;
      const lastItemRight = itemsRight ? _.last(itemsRight) : null;
      const lastItemLeft = itemsLeft ? _.last(itemsLeft) : null;
      const lastItem = items ? _.last(items) : null;

      const isCurrentPosOverable = lastItem ? (parseInt(settings.tiles.raw[lastItem].flags, 2) & 16) == 16 : false;
      const isRightPosOverable = lastItemRight ? (parseInt(settings.tiles.raw[lastItemRight].flags, 2) & 16) == 16 : false;
      const isLeftPosOverable = lastItemLeft ? (parseInt(settings.tiles.raw[lastItemLeft].flags, 2) & 16) == 16 : false;
      const isUpPosOverable = lastItemUp ? (parseInt(settings.tiles.raw[lastItemUp].flags, 2) & 16) == 16 : false;
      const isDownPosOverable = lastItemDown ? (parseInt(settings.tiles.raw[lastItemDown].flags, 2) & 16) == 16 : false;

      //@todo check the todo above, this code below should go somehow on the top, just after if(player){ <here> ...}
      // if(!isCurrentPosOverable && !isRightPosOverable && !isLeftPosOverable && !isUpPosOverable && !isDownPosOverable){
      //
      //     return this.paintPlayer(canvasContext, width, height, scale);
      // }

      // Negative Current Position | Positive Next Position
      if(!isCurrentPosOverable && isRightPosOverable){

        this.paintPlayer(canvasContext, width, height, scale,
          {sx:0, sy:0, sw:32-this.map.player.ow, sh: 32, dx: 0});

        itemsRight.forEach((id, index) => {

            if(index == itemsRight.length-1){
              return;
            }

            canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(32))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(id), scale)

        });

        this.paintPlayer(canvasContext, width, height, scale,
          {sx:32-this.map.player.ow, sy:0, sw: this.map.player.ow, sh: 32, dx:32-this.map.player.ow});

        return canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(32))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(lastItemRight), scale)

      }

      // Positive Current Position | Positive Next Position
      if(isCurrentPosOverable && isRightPosOverable){

        items.forEach((id, index) => {

            if(index == items.length-1){
              return;
            }

            canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(0))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(id), scale)

        });

        this.paintPlayer(canvasContext, width, height, scale,
          {sx:0, sy:0, sw:32-this.map.player.ow, sh: 32, dx: 0});

        canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(0))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(lastItem), scale)

        itemsRight.forEach((id, index) => {

            if(index == itemsRight.length-1){
              return;
            }

            canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(32))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(id), scale)

        });

        this.paintPlayer(canvasContext, width, height, scale,
          {sx:32-this.map.player.ow, sy:0, sw: this.map.player.ow, sh: 32, dx:32-this.map.player.ow});

        return canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(32))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(lastItemRight), scale)

      }

      if(isCurrentPosOverable && isLeftPosOverable && this.map.player.animating == 'l'){

        items.forEach((id, index) => {

            if(index == items.length-1){
              return;
            }

            canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(0))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(id), scale)

        });

        this.paintPlayer(canvasContext, width, height, scale,
          {sx:-this.map.player.ow, sy:0, sw:32, sh: 32, dx: -this.map.player.ow});

        canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(0))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(lastItem), scale)

        itemsLeft.forEach((id, index) => {

            if(index == itemsLeft.length-1){
              return;
            }

            canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(-32))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(id), scale)

        });

        this.paintPlayer(canvasContext, width, height, scale,
          {sx:0, sy:0, sw: -this.map.player.ow, sh: 32, dx:0});

        return canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(-32))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(lastItemLeft), scale)

      }

      // Positive Current Position | Negative Next Position
      if(isCurrentPosOverable && !isRightPosOverable){

        const itemsCurrent = this.map.tiles[this.map.layer][playerPos].items;

        itemsRight.forEach((id, index) => {

            if(index == itemsRight.length-1){
              return;
            }

            canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(0))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(id), scale)

        });

        this.paintPlayer(canvasContext, width, height, scale,
          {sx:0, sy:0, sw:32-this.map.player.ow, sh: 32, dx: 0});

        canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(0))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(lastItem), scale)

        return this.paintPlayer(canvasContext, width, height, scale,
          {sx:32-this.map.player.ow, sy:0, sw: this.map.player.ow, sh: 32, dx:32-this.map.player.ow});

      }

      if(!isCurrentPosOverable && isLeftPosOverable && this.map.player.animating == 'l'){

        this.paintPlayer(canvasContext, width, height, scale,
          {sx:-this.map.player.ow, sy:0, sw:32, sh: 32, dx: -this.map.player.ow});

        itemsLeft.forEach((id, index) => {

            if(index == itemsLeft.length-1){
              return;
            }

            canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(-32))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(id), scale)

        });

        this.paintPlayer(canvasContext, width, height, scale,
          {sx:0, sy:0, sw: -this.map.player.ow, sh: 32, dx:0});

        return canvasUtil.paintTile(canvasContext, ((ip*32)-wop+(-32))*scale, ((jp*32)-hop)*scale, this.SpritesManager.spr(lastItemLeft), scale)

      }

      this.paintPlayer(canvasContext, width, height, scale);
    }

  }

  //Same but painting empty tiles too
  paintPlayer(canvasContext, width, height, scale=1, offset=false){

    const x = (width/2) - (16*scale);
    const y = (height/2) - (16*scale);

    if(offset) {

      return canvasUtil.paintTileOffset(canvasContext, offset.sx, offset.sy, offset.sw, offset.sh, x+(offset.dx*scale), y, offset.sw, offset.sh, this.SpritesManager.spr(this.map.player.outfit), scale);
    };

    canvasUtil.paintTile(canvasContext, x, y, this.SpritesManager.spr(this.map.player.outfit), scale);

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

  deserializeMap(map){

    // const serializedMap = {};
    //
    // serializedMap.version =  this.map.version;
    // serializedMap.info =  this.map.info;
    // serializedMap.desc =  this.map.desc;
    // serializedMap.width =  this.map.width;
    // serializedMap.height =  this.map.height;

    map.player.x = 7;
    map.player.y = 4;

    // return JSON.stringify(serializedMap);
    this.map = Object.assign(this.map, map);


  }

  static factory($rootScope, SpritesManager){

    return new CanvasManager($rootScope, SpritesManager);

  }

}

CanvasManager.factory.$inject = ['$rootScope', 'SpritesManager'];

export default CanvasManager;
