var canvas;
var texture;
var glitch;

function loadImage(src) {
	
	var image = new Image();
	image.src = src;
	
	image.onload = function(e) {
		
		$(image).attr('default-width', image.width);
		$(image).attr('default-height', image.height);
		
		$('#drop-zone').hide();
		//$('#canvas img').remove();
		//$('#canvas').append($(image));
		
		if (texture) texture.destroy();
		$(canvas).css('margin-top', - image.height / 2);
		$(canvas).css('margin-left', - image.width / 2);
		texture = canvas.texture(image);
		glitch = canvas.glitch(texture);
		glitch.update();
	};
};

function setGlitchFormat(v) {
	
	if (!glitch) return;
	glitch.format(parseInt(v)).update();
};

function setGlitchType(v) {
	
	if (!glitch) return;
	glitch.type(parseInt(v)).update();
};

function setGlitchWidth(v) {
	
	if (!glitch) return;
	glitch.shortenX(parseInt(texture._.width * (100 - v) / 100)).update();
};

function setGlitchHeight(v) {
	
	if (!glitch) return;
	glitch.shortenY(parseInt(texture._.height * (100 - v) / 100)).update();
};

function setGlitchOffset(v) {
	
	if (!glitch) return;
	glitch.offset(parseInt(v)).update();
};

function saveImage() {
	try {
		window.open(canvas.toDataURL("image/jpeg"));
	} catch (e) {
		console.log(e);
	}
};

window.onload = function() {
	
	try {
		canvas = fx.canvas();
		
	} catch (e) {
		
		alert('Sorry, but this browser doesn\'t support WebGL.');
		return;
	}
	
	$('#canvas canvas').remove();
	$('#canvas').append($(canvas));
	
	var gl = canvas._.gl;
	
	////////////////////////////////////////////////////////////////////////////////
	// SET GLITCH GUI
	////////////////////////////////////////////////////////////////////////////////
	
	function Parameter() {
		this.title = 'This is WebGL Glitch';
		this.format = gl.RGBA;
		this.type = 'UNSIGNED_BYTE';
		this.width = 100;
		this.height = 100;
		this.offset = 0;
		this.saveImage = saveImage;
	};
	
	var ui = new dat.GUI({ autoPlace: false, width: 320 });
	var param = new Parameter();
	var format = {'ALPHA':gl.ALPHA, 'LUMINANCE':gl.LUMINANCE, 'LUMINANCE_ALPHA':gl.LUMINANCE_ALPHA, 'RGB':gl.RGB, 'RGBA':gl.RGBA};
	var type = {'UNSIGNED_BYTE':gl.UNSIGNED_BYTE, 'UNSIGNED_SHORT_5_6_5':gl.UNSIGNED_SHORT_5_6_5, 'UNSIGNED_SHORT_4_4_4_4':gl.UNSIGNED_SHORT_4_4_4_4, 'UNSIGNED_SHORT_5_5_5_1':gl.UNSIGNED_SHORT_5_5_5_1};
	
	ui.add(param, 'title');
	ui.add(param, 'format', format).onChange(setGlitchFormat);
	ui.add(param, 'type', type).onChange(setGlitchType);
	ui.add(param, 'width', 0, 100, .1).onChange(setGlitchWidth);
	ui.add(param, 'height', 0, 100, .1).onChange(setGlitchHeight);
	ui.add(param, 'offset', 0, 100, .1).onChange(setGlitchOffset);
	ui.add(param, 'saveImage').name('save image');
	
	$(ui.domElement).find('input[type=text]:first').attr('readonly', 'true');
	
	var container = document.getElementById('gui-container');
	container.appendChild(ui.domElement);
	
	
	////////////////////////////////////////////////////////////////////////////////
	// SET FILE LISTENER
	////////////////////////////////////////////////////////////////////////////////
	
	if (typeof(FileReader) == "undefined") {
		
		alert('Sorry, but this browser doesn\'t support FileReader.');
		return;
		
	} else {
		
		window.addEventListener('dragover', function(e) {
			
			// off default blower action
			e.preventDefault();
			
		}, false);

		window.addEventListener('drop', function(e) {
			
			// off default blower action
			e.preventDefault();
			
			var file = event.dataTransfer.files[0];
			var fileType = file.type;
			var reader;
			
			if (!fileType.match(/image\/\w+/)) {
				alert('only image file supported');
				return;
			}
			
			reader = new FileReader();
			reader.onload = function(e) {
				console.log(e);
				loadImage(e.target.result);
			};
			reader.readAsDataURL(file);
			
		}, false);
	}
}