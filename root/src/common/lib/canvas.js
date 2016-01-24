export function paintLine(canvasCtx, x, y, x2, y2, color, lineWidth){

	canvasCtx.beginPath();
	canvasCtx.moveTo(x, y);
	canvasCtx.lineTo(x2, y2);
	canvasCtx.strokeStyle = color ? color: canvasCtx.strokeStyle;
	canvasCtx.lineWidth = lineWidth ? lineWidth: canvasCtx.lineWidth;
	canvasCtx.stroke();

}

export function paintTile(canvasCtx, x, y, image){

	const img = new Image();

	img.src = image;

	canvasCtx.drawImage(img, x, y, 32, 32);

}

export function clearTile(canvasCtx, x, y, x2, y2){

	canvasCtx.clearRect(x, y, x2, y2);

}
