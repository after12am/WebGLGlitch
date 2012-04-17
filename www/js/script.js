
var VIDEO_MAX_WIDTH = 640;
var VIDEO_MAX_HEIGHT = 360;

// glitch update frequency
var fps = 10
var theta = 0;
var glitchGui, glitchParam;
var canvas;
var texture;
var glitch;
var video;


/*  extend dat.gui
    get controller by name
-------------------------------------------------*/
dat.GUI.prototype.get = function(property_name) {
	var c;
	this.__controllers.forEach(function(d) {
		if (d.property == property_name) {
			c = d;
			return;
		}
	});
	for (key in this.__folders) {
		this.__folders[key].__controllers.forEach(function(d) {
			if (d.property == property_name) {
				c = d;
				return;
			}
		});
	}
	return c;
};

function clamp(lo, value, hi) {
	
	return Math.max(lo, Math.min(value, hi));
}

function init() {
	
	if (texture) {
	    texture.destroy();
	}
	texture = null;
	
	if ($('#canvas video').size() > 0) {
	    $('#canvas video').remove();
	}
	video = null;
	
	glitch = null;
};

function loadImage(src) {
	
	var image = new Image();
	image.src = src;
	
	image.onload = function(e) {
		
		$('#drop-zone').hide();
		$(canvas).css('margin-top', - image.height / 2);
		$(canvas).css('margin-left', - image.width / 2);
		$(canvas).show();
		
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
		
		var videoCanvas = document.createElement('canvas');
		
		width = $(video).width();
		height = $(video).height()
		
		if ($(video).width() > VIDEO_MAX_WIDTH) {
			
			width = VIDEO_MAX_WIDTH;
			height = parseInt(height * VIDEO_MAX_WIDTH / $(video).width());
			
		} else if ($(video).height() > VIDEO_MAX_HEIGHT) {
			
			width = parseInt(width * VIDEO_MAX_HEIGHT / $(video).height());
			height = VIDEO_MAX_HEIGHT;
		}
		
		
		videoCanvas.width = width;
		videoCanvas.height = height;
		
		video.videoCanvas = videoCanvas;
		texture = canvas.texture(video);
		glitch = canvas.glitch(texture);
		video.play();
		
	}, false);
	
	video.addEventListener('ended', function() {
		
		if ($('#canvas video').size() > 0) {
		    $('#canvas video').remove();
		}
		
		video = null;
		glitch = null;
		
		console.log("video ended");
	}, false);
};

function animate() {
	
	setTimeout(animate, 1000 / fps);
	
	
	// update controller
	var lo = glitchGui.get('minWidth');
	var v = glitchGui.get('width');
	var hi = glitchGui.get('maxWidth');
	if (lo.getValue() > hi.getValue()) lo.setValue(hi.getValue());
	if (lo.getValue() > v.getValue()) v.setValue(lo.getValue());
	if (hi.getValue() < v.getValue()) v.setValue(hi.getValue());
	if (glitchGui.get('animateWidth').getValue()) {
		var range = (hi.getValue() - lo.getValue());
		glitchParam.width = Math.cos(theta / Math.PI * 180) * range / 2 + range / 2 + lo.getValue();
	}
	
	var lo = glitchGui.get('minHeight');
	var v = glitchGui.get('height');
	var hi = glitchGui.get('maxHeight');
	if (lo.getValue() > hi.getValue()) lo.setValue(hi.getValue());
	if (lo.getValue() > v.getValue()) v.setValue(lo.getValue());
	if (hi.getValue() < v.getValue()) v.setValue(hi.getValue());
	if (glitchGui.get('animateHeight').getValue()) {
		var range = (hi.getValue() - lo.getValue());
		glitchParam.height = Math.cos(theta / Math.PI * 180) * range / 2 + range / 2 + lo.getValue();
	}
	
	var lo = glitchGui.get('minOffset');
	var v = glitchGui.get('offset');
	var hi = glitchGui.get('maxOffset');
	if (lo.getValue() > hi.getValue()) lo.setValue(hi.getValue());
	if (lo.getValue() > v.getValue()) v.setValue(lo.getValue());
	if (hi.getValue() < v.getValue()) v.setValue(hi.getValue());
	if (glitchGui.get('animateOffset').getValue()) {
		var range = (hi.getValue() - lo.getValue());
		glitchParam.offset = Math.cos(theta / Math.PI * 180) * range / 2 + range / 2 + lo.getValue();
	}
	
	// update video glitching
	if (video) {
		if (video.videoCanvas) {
			
			// in advance draw on temp canvas for getting data as URI
			// using toDataURL method
			var videoContext2d = video.videoCanvas.getContext('2d');
			videoContext2d.drawImage(video, 0, 0, video.videoCanvas.width, video.videoCanvas.height);

			// draw as image on canvas
			loadImage(video.videoCanvas.toDataURL('image/jpeg'));
		}
	}
	
	if (glitch) {
	    
		// update glitch controller
		for (var i in glitchGui.__controllers) {
			glitchGui.__controllers[i].updateDisplay();
		}
		for (key in glitchGui.__folders) {
			for (var i in glitchGui.__folders[key].__controllers) {
				glitchGui.__folders[key].__controllers[i].updateDisplay();
			}
		}
		
		setGlitchFormat(glitchGui.get('format').getValue());
		setGlitchType(glitchGui.get('type').getValue());
		setGlitchWidth(glitchGui.get('width').getValue());
		setGlitchHeight(glitchGui.get('height').getValue());
		setGlitchOffset(glitchGui.get('offset').getValue());
		glitch.update();
		
		theta += .0012;
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

function GlitchParams() {
    
    var gl = canvas._.gl;
	this.title = 'This is WebGL Glitch';
	this.format = gl.RGBA;
	this.type = gl.UNSIGNED_BYTE;
	
	this.minWidth = 0;
	this.maxWidth = 100;
	this.width = 100;
	this.animateWidth = false;
	
	this.minHeight = 0;
	this.maxHeight = 100;
	this.height = 100;
	this.animateHeight = false;
	
	this.minOffset = 0;
	this.maxOffset = 100;
	this.offset = 0;
	this.animateOffset = false;
	
	this.saveImage = saveImage;
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
	$('#canvas canvas').hide();
	
	// add glitch gui
	glitchGui = new dat.GUI({ autoPlace: false, width: 320 });
	glitchParam = new GlitchParams();
	
	var gl = canvas._.gl;
	var format = {'ALPHA':gl.ALPHA, 'LUMINANCE':gl.LUMINANCE, 'LUMINANCE_ALPHA':gl.LUMINANCE_ALPHA, 'RGB':gl.RGB, 'RGBA':gl.RGBA};
	
	// only UNSIGNED_BYTE value is effective as glitch. I can't understand why is is.
	//var type = {'UNSIGNED_BYTE':gl.UNSIGNED_BYTE, 'UNSIGNED_SHORT_5_6_5':gl.UNSIGNED_SHORT_5_6_5, 'UNSIGNED_SHORT_4_4_4_4':gl.UNSIGNED_SHORT_4_4_4_4, 'UNSIGNED_SHORT_5_5_5_1':gl.UNSIGNED_SHORT_5_5_5_1};
	var type = { 'UNSIGNED_BYTE':gl.UNSIGNED_BYTE };
	
	
	glitchGui.add(glitchParam, 'title');
	glitchGui.add(glitchParam, 'format', format).onChange(setGlitchFormat);
	glitchGui.add(glitchParam, 'type', type).onChange(setGlitchType);
	var f1 = glitchGui.addFolder('width');
	f1.add(glitchParam, 'minWidth').min(0).max(100).step(.1).name('min');
	f1.add(glitchParam, 'maxWidth').min(0).max(100).step(.1).name('max');
	f1.add(glitchParam, 'width').min(0).max(100).step(.1).onChange(setGlitchWidth);
	f1.add(glitchParam, 'animateWidth').name('animate');
	f1.close();
	var f2 = glitchGui.addFolder('height');
	f2.add(glitchParam, 'minHeight').min(0).max(100).step(.1).name('min');
	f2.add(glitchParam, 'maxHeight').min(0).max(100).step(.1).name('max');
	f2.add(glitchParam, 'height').min(0).max(100).step(.1).onChange(setGlitchHeight);
	f2.add(glitchParam, 'animateHeight').name('animate');
	f2.close();
	var f3 = glitchGui.addFolder('offset');
	f3.add(glitchParam, 'minOffset').min(0).max(100).step(.1).name('min');
	f3.add(glitchParam, 'maxOffset').min(0).max(100).step(.1).name('max');
	f3.add(glitchParam, 'offset').min(0).max(100).step(.1).onChange(setGlitchOffset);
	f3.add(glitchParam, 'animateOffset').name('animate');
	f3.close();
	glitchGui.add(glitchParam, 'saveImage').name('save image');
	
	// set readonly attribute to gui named 'title' because title is app name.
	$(glitchGui.domElement).find('input[type=text]:first').attr('readonly', 'true');
	
	// add to stage
	var container = document.getElementById('gui-container');
	container.appendChild(glitchGui.domElement);
	
	
	////////////////////////////////////////////////////////////////////////////////
	// SET DROP FILE LISTENER
	////////////////////////////////////////////////////////////////////////////////
	
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
		
		if (fileType.match(/image\/\w+/)) {
			
			// initialize
			init();
			
			reader = new FileReader();
			reader.onload = function(e) {
				loadImage(e.target.result);
			};
			reader.readAsDataURL(file);
			
		} else if (fileType.match(/video\/\w+/)) {
			
			// initialize
			init();
			
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