export function paintLine(canvasCtx, x, y, x2, y2, color, lineWidth){

	canvasCtx.beginPath();
	canvasCtx.moveTo(x, y);
	canvasCtx.lineTo(x2, y2);
	canvasCtx.strokeStyle = color ? color: canvasCtx.strokeStyle;
	canvasCtx.lineWidth = lineWidth ? lineWidth: canvasCtx.lineWidth;
	canvasCtx.stroke();

}
