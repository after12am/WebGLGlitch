
var fps = 20, theta = 0;
var ui, glitchParam;
var canvas;
var texture;
var glitch;
var video, videoCanvas;

function init() {
	
	if (texture) texture.destroy();
	texture = null;
	glitch = null;
	videoCanvas = null;
	$('#canvas video').remove();
};

function loadImage(src) {
	
	var image = new Image();
	image.src = src;
	
	image.onload = function(e) {
		
		$('#drop-zone').hide();
		//$('#canvas img').remove();
		//$('#canvas').append($(image));
		
		$(canvas).css('margin-top', - image.height / 2);
		$(canvas).css('margin-left', - image.width / 2);
		
		texture = canvas.texture(image);
		glitch = canvas.glitch(texture);
	};
};

function loadVideo(src) {
	
	video = document.createElement('video');
	video.src = src;
	
	video.addEventListener('loadeddata', function() {
		
		$('#drop-zone').hide();
		$('#canvas').append($(video));
		$(video).hide();
		
		videoCanvas = document.createElement('canvas');
		videoCanvas.width = $(video).width();
		videoCanvas.height = $(video).height();
		
		texture = canvas.texture(video);
		glitch = canvas.glitch(texture);
		
		video.play();
	});
};

function animate() {
	
	setTimeout(animate, 1000 / fps);
	
	// update video glitching
	if (videoCanvas) {
		var videoContext2d = videoCanvas.getContext('2d');
		videoContext2d.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
		
		var src = videoCanvas.toDataURL('image/jpeg');
		
		var image = new Image();
		image.src = src;
		loadImage(src);
	}
	
	if (glitch)
	{
		var d = new Date();
		
		glitchParam.width = Math.cos(theta / Math.PI * 180);
		//glitchParam.height = Math.sin(theta / Math.PI * 180) * 10 + 90;
		
		//glitchParam.width = Math.cos(theta / Math.PI * 180) * 50 + 50;
		//glitchParam.height = Math.sin(theta / Math.PI * 180) * 50 + 50;
		
		// Iterate over all controllers
		for (var i in ui.__controllers) {
			ui.__controllers[i].updateDisplay();
		}
		
		setGlitchFormat(ui.__controllers[1].getValue());
		setGlitchType(ui.__controllers[2].getValue());
		setGlitchWidth(ui.__controllers[3].getValue());
		setGlitchHeight(ui.__controllers[4].getValue());
		setGlitchOffset(ui.__controllers[5].getValue());
		glitch.update();
		
		theta++;
		if (theta > 360) theta = 0;
	}
};

function setGlitchFormat(v) {
	
	if (!glitch) return;
	glitch.format(parseInt(v));
};

function setGlitchType(v) {
	
	if (!glitch) return;
	glitch.type(parseInt(v));
};

function setGlitchWidth(v) {
	
	if (!glitch) return;
	glitch.shortenX(parseInt(texture._.width * (100 - v) / 100));
};

function setGlitchHeight(v) {
	
	if (!glitch) return;
	glitch.shortenY(parseInt(texture._.height * (100 - v) / 100));
};

function setGlitchOffset(v) {
	
	if (!glitch) return;
	glitch.offset(parseInt(v));
};

function saveImage() {
	
	if (!canvas) return;
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
	
	if (typeof(FileReader) == "undefined") {
		
		alert('Sorry, but this browser doesn\'t support FileReader.');
		return;
	}
	
	// add canvas to stage
	$('#canvas canvas').remove();
	$('#canvas').append($(canvas));
	
	var gl = canvas._.gl;
	
	////////////////////////////////////////////////////////////////////////////////
	// SET GLITCH GUI
	////////////////////////////////////////////////////////////////////////////////
	
	function Parameter() {
		this.title = 'This is WebGL Glitch';
		this.format = gl.RGBA;
		this.type = gl.UNSIGNED_BYTE;
		this.width = 100;
		this.height = 100;
		this.offset = 0;
		this.saveImage = saveImage;
	};
	
	ui = new dat.GUI({ autoPlace: false, width: 320 });
	glitchParam = new Parameter();
	var format = {'ALPHA':gl.ALPHA, 'LUMINANCE':gl.LUMINANCE, 'LUMINANCE_ALPHA':gl.LUMINANCE_ALPHA, 'RGB':gl.RGB, 'RGBA':gl.RGBA};
	var type = {'UNSIGNED_BYTE':gl.UNSIGNED_BYTE, 'UNSIGNED_SHORT_5_6_5':gl.UNSIGNED_SHORT_5_6_5, 'UNSIGNED_SHORT_4_4_4_4':gl.UNSIGNED_SHORT_4_4_4_4, 'UNSIGNED_SHORT_5_5_5_1':gl.UNSIGNED_SHORT_5_5_5_1};
	
	ui.add(glitchParam, 'title');
	ui.add(glitchParam, 'format', format).onChange(setGlitchFormat);
	ui.add(glitchParam, 'type', type).onChange(setGlitchType);
	ui.add(glitchParam, 'width', 0, 100, .1).onChange(setGlitchWidth);
	ui.add(glitchParam, 'height', 0, 100, .1).onChange(setGlitchHeight);
	ui.add(glitchParam, 'offset', 0, 100, .1).onChange(setGlitchOffset);
	ui.add(glitchParam, 'saveImage').name('save image');
	
	$(ui.domElement).find('input[type=text]:first').attr('readonly', 'true');
	
	var container = document.getElementById('gui-container');
	container.appendChild(ui.domElement);
	
	
	////////////////////////////////////////////////////////////////////////////////
	// SET FILE LISTENER
	////////////////////////////////////////////////////////////////////////////////
	
	window.addEventListener('dragover', function(e) {
		
		// off default blower action
		e.preventDefault();
		
	}, false);

	window.addEventListener('drop', function(e) {
		
		// initialize
		init();
		
		
		// off default blower action
		e.preventDefault();
		
		var file = event.dataTransfer.files[0];
		var fileType = file.type;
		var reader;
		
		if (fileType.match(/image\/\w+/)) {
			
			reader = new FileReader();
			reader.onload = function(e) {
				loadImage(e.target.result);
			};
			reader.readAsDataURL(file);
			
		} else if (fileType.match(/video\/\w+/)) {
			
			reader = new FileReader();
			reader.onload = function(e) {
				loadVideo(e.target.result);
			};
			reader.readAsDataURL(file);
			
		} else {
			alert('only image and video file supported');
			return;
		}
		
	}, false);
	
	animate();
}