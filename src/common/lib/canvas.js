export function paintLine(canvasCtx, x, y, x2, y2, color, lineWidth){

	canvasCtx.beginPath();
	canvasCtx.moveTo(x, y);
	canvasCtx.lineTo(x2, y2);
	canvasCtx.strokeStyle = color ? color: canvasCtx.strokeStyle;
	canvasCtx.lineWidth = lineWidth ? lineWidth: canvasCtx.lineWidth;
	canvasCtx.stroke();

}

export function paintTileOffset(canvasCtx, sx, sy, sw, sh, dx, dy, dw, dh, image, scale = 1){

	const img = new Image();

	img.src = image;

	canvasCtx.drawImage(img, sx, sy, sw, sh, dx, dy, dw*scale, dh*scale);

}

export function paintTile(canvasCtx, x, y, image, scale = 1){

	const img = new Image();

	img.src = image;

	canvasCtx.drawImage(img, x, y, 32*scale, 32*scale);

}

/*
If given i.e. [1137, 1138, 1139, 1140], this will work like this:

---------------            ---------------
|      |      |            | 1137 |      |
---------------     ==>    ---------------      ==>
|      |      |            |      |      |
---------------            ---------------

---------------            ---------------
| 1137 | 1138 |            | 1137 | 1138 |
---------------     ==>    ---------------     ==>
|      |      |            | 1139 |      |
---------------            ---------------

---------------
| 1137 | 1138 |
---------------
| 1139 | 1140 |
---------------
*/
export function joinImages(ids, spritesManager){

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const scale = 0.5;

	canvas.width = 64*scale;
	canvas.height = 64*scale;

	ids.forEach((id, i) => paintTile(ctx, 0+((i%2)*32*scale), 0+((~~(i/2))*32*scale), spritesManager.spr(id), scale));

	return canvas.toDataURL();

}

export function clearTile(canvasCtx, x, y, x2, y2){

	canvasCtx.clearRect(x, y, x2, y2);

}
