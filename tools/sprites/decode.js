define([], function() {

var cache = {},
	_load = function(buffer)
	{
		var 	view = new DataView(buffer),
				offset_count = 2,
				total = view.getUint16(0),
				id,
				offset,
				img_len,
				img_data,
				img_64,
				i,
				img_temp;

		console.log('total: '+total);

		for(id = 0; id<total; id++)
		{
			offset = view.getUint32(offset_count);
			img_len = view.getUint32(offset_count+4) - offset;

			/*
			imgData = buffer.slice(offset,img_len+offset);

			var pngReader = new PNGReader(imgData);
			pngReader.parse(function(err, png){
			    if (err) throw err;
			    console.log('image is <' + png.width + ',' + png.height +'>');
			    console.log(png);
			});
			*/
		
			img_data = new Uint8Array(buffer.slice(offset,img_len+offset));
	    	img_64 = '';

			for(i = 0; i<img_data.byteLength; i++)
			{
				img_64 += String.fromCharCode(img_data[i]);
			}

			//console.log(imgToString);

			//img_64=btoa(img_64); //Binary to ASCII, where it probably stands for

	      	//console.log(imgData, imgData.byteLength, b64imgData);
	      	//img.attr("src","data:image/png;base64,"+b64imgData);
	      	//img_temp = new Image();
	      	//img_temp.src = 'data:image/png;base64,'+btoa(img_64);
	      	cache[id] = 'data:image/png;base64,'+btoa(img_64);

	      	offset_count+=4;
		}
	},
	loadFile = function(file, onload)
	{
		var reader = new FileReader();

		reader.onload = function(data) 
		{
	      
			var buffer = reader.result;
			
			_load(buffer);

			if(onload) onload();
	    };

	    reader.readAsArrayBuffer(file);
	},
	loadData = function(buffer, onload)
	{
		_load(buffer);

		if(onload) onload();
	}

	return {

		'init':loadFile,
		'load':loadData,
		'cache':cache
	};
});