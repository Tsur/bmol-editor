'use strict';

import settings from '../../../../settings/init';
import * as canvasUtil from '../../../../common/lib/canvas';
import _ from 'lodash';

class CanvasManager {

  constructor(){

    this.currentSprite = 0;
    this.dragging = false;
    this.deleting = false;
    this.out = false;
    this.coords = {};

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

  static factory(){

    return new CanvasManager();

  }

}

CanvasManager.factory.$inject = [];

export default CanvasManager;
