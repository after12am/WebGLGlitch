(function($) {

 // js/app/app.js

/*  EXTEND DAT.GUI
 ==================== */
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

var app = {};

// framerate
app.fps = 24;

$(function() {
    
    if (typeof(FileReader) == "undefined") {
        var error_message = 'Sorry, but this browser doesn\'t support FileReader.';
        alert(error_message); throw error_message;
    }
    
    try {
        app.CanvasView = new CanvasView();
    } catch (e) {
        var error_message = 'Sorry, but this browser doesn\'t support WebGL.';
        alert(error_message); throw error_message;
    }
    
    app.DatView = new DatView();
    app.AppView = new AppView();
    
    // start animate
    app.AppView.start();
});
// js/app/View/AppView.js

var AppView = Backbone.View.extend({
    
    el: '#canvas',
    
    initialize: function() {
        
        _.bindAll(this, 'render', 'start', 'showAnnounce', 'hideAnnounce', 'dragover', 'dropped', 'readfile');
        
        this.render();
        
        window.addEventListener('dragover', this.dragover, false);
        window.addEventListener('drop', this.dropped, false);
        
        // catch event
        app.CanvasView.on('hideAnnounce', this.hideAnnounce);
    },
    
    render: function() {
        
        // set canvas
        $(this.el).append($(app.CanvasView.render().el));
        
        // set controller
        app.DatView.render();
    },
    
    showAnnounce: function() {
        
        $(this.el).find('#drop-zone').show();
    },
    
    hideAnnounce: function() {
        
        $(this.el).find('#drop-zone').hide();
    },
    
    dragover: function(e) {
        // stop propagation
        e.preventDefault();
    },
    
    dropped: function(e) {
        
        // stop propagation
        e.preventDefault();
        
        var file = event.dataTransfer.files[0];
        var fileType = file.type;
        
        // read image or video
        if (fileType.match(/image\/\w+/)) {
            
            var callback = function(e) {
                // file path
                var src = e.target.result;
                // load image
                app.CanvasView.setImage(src);
            };
            
            this.readfile(file, callback);
            
        } else if (fileType.match(/video\/\w+/)) {
            
            var callback = function(e) {
                // file path
                var src = e.target.result;
                // load video
                app.CanvasView.setVideo(src);
            };
            
            this.readfile(file, callback);
            
        } else {
            
            alert('Only image and video is supported.');
        }
    },
    
    readfile: function(file, callback) {
        
        app.CanvasView.init();
        
        var reader = new FileReader();
        reader.onload = callback;
        reader.readAsDataURL(file);
    },
    
    start: function() {
        
        app.CanvasView.animate();
    }
});
// js/app/View/CanvasView.js

var CanvasView = Backbone.View.extend({
    
    texture: null,
    
    filter: null,
    
    initialize: function() {
        
        _.bindAll(this, 'init', 'render', 'format', 'type', 'width', 'height', 'offset', 'setImage', 'setVideo', 'animate', 'videoReady', 'videoEnded');
        
        // if browser doesn't support WebGL, error has thrown.
        this.setElement(fx.canvas());
    },
    
    init: function() {
        
        if (this.texture) {
            this.texture.destroy();
            this.texture = null;
        }
        
        if (app.VideoView) {
            app.VideoView.dispose();
        }
        
        this.filter = null;
    },
    
    // getter / setter
    format: function(value) {
        
        if (value !== undefined) {
            this.filter.format(parseInt(value));
            return;
        }
    },
    
    // getter / setter
    type: function(value) {
        
        if (value !== undefined) {
            this.filter.type(parseInt(value));
            return;
        }
    },
    
    // getter / setter
    width: function(value) {
        
        if (value !== undefined) {
            this.filter.shortenX(parseInt(this.texture._.width * (100 - value) / 100));
            return;
        }
    },
    
    // getter / setter
    height: function(value) {
        
        if (value !== undefined) {
            this.filter.shortenY(parseInt(this.texture._.height * (100 - value) / 100));
            return;
        }
    },
    
    // getter / setter
    offset: function(value) {
        
        if (value !== undefined) {
            this.filter.offset(parseInt(value));
            return;
        }
    },
    
    render: function() {
        
        return this;
    },
    
    setImage: function(src) {
        
        var that = this, image;
        
        var onReady = function(e) {
            
            that.trigger('hideAnnounce');
            
            $(that.el)
                .css('margin-top', - image.height / 2)
                .css('margin-left', - image.width / 2)
                .show();
            
            that.texture = that.el.texture(image);
            that.filter = that.el.glitch(that.texture);
        };
        
        image = new Image();
        image.src = src;
        image.onload = onReady;
    },
    
    setVideo: function(src) {
        
        app.VideoView = new VideoView();
        $('#canvas').append($(app.VideoView.render().el));
        app.VideoView.render();
        app.VideoView.el.src = src;
        app.VideoView.on('ready', this.videoReady);
        app.VideoView.on('ended', this.videoEnded);
    },
    
    videoReady: function() {
        
    },
    
    videoEnded: function() {
        
        if (app.VideoView) {
            app.VideoView.off('ended');
            app.VideoView.dispose();
        }
        
        this.filter = null;
        
        console.log("video ended");
    },
    
    animate: function() {
        
        if (this.filter) {
            
            // in case of video
            if (app.VideoView.el) {
                if (app.VideoView.el.videoCanvas) {
                    // in advance draw on temp canvas for getting data as URI
                    // using toDataURL methodthis.theta
                    var videoContext2d = app.VideoView.el.videoCanvas.getContext('2d');
                    videoContext2d.drawImage(app.VideoView.el, 0, 0, app.VideoView.el.videoCanvas.width, app.VideoView.el.videoCanvas.height);
                    // draw as image
                    var src = app.VideoView.el.videoCanvas.toDataURL('image/jpeg');
                    this.setImage(src);
                }
            }
            
            app.DatView.update();
            
            this.format(app.DatView.dat.get('format').getValue());
            this.type(app.DatView.dat.get('type').getValue());
            this.width(app.DatView.dat.get('width').getValue());
            this.height(app.DatView.dat.get('height').getValue());
            this.offset(app.DatView.dat.get('offset').getValue());
            console.log(app.DatView.dat.get('offset').getValue())
            this.filter.update();
        }
        
        setTimeout(this.animate, 1000 / app.fps);
    }
});
// js/app/View/DatView.js

var DatView = Backbone.View.extend({
    
    el: '#gui-container',
    
    dat: null,
    
    params: null,
    
    theta: 0,
    
    initialize: function() {
        
        _.bindAll(this, 'render', 'save', 'update', 'updateTheta');
        
        var that = this;
        
        var Params = function(gl) {
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
            this.save = that.save;
        }
        
        var gl = $(app.CanvasView.el)[0]._.gl;
        this.params = new Params(gl);
        this.dat = new dat.GUI({'autoPlace': false, 'width': 320});
    },
    
    render: function() {
        
        var gl = $(app.CanvasView.el)[0]._.gl;
        var format = {'ALPHA':gl.ALPHA, 'LUMINANCE':gl.LUMINANCE, 'LUMINANCE_ALPHA':gl.LUMINANCE_ALPHA, 'RGB':gl.RGB, 'RGBA':gl.RGBA};
        var type = { 'UNSIGNED_BYTE':gl.UNSIGNED_BYTE };
        
        this.dat.add(this.params, 'title');
        this.dat.add(this.params, 'format', format).onChange(app.CanvasView.format);
        this.dat.add(this.params, 'type', type).onChange(app.CanvasView.type); // only 'UNSIGNED_BYTE' is effective. I can not understand why.
        
        var f;
        
        f = this.dat.addFolder('width');
        f.add(this.params, 'minWidth').min(0).max(100).step(.1).name('min');
        f.add(this.params, 'maxWidth').min(0).max(100).step(.1).name('max');
        f.add(this.params, 'width').min(0).max(100).step(.1).onChange(app.CanvasView.width);
        f.add(this.params, 'animateWidth').name('animate');
        f.close();
        
        f = this.dat.addFolder('height');
        f.add(this.params, 'minHeight').min(0).max(100).step(.1).name('min');
        f.add(this.params, 'maxHeight').min(0).max(100).step(.1).name('max');
        f.add(this.params, 'height').min(0).max(100).step(.1).onChange(app.CanvasView.height);
        f.add(this.params, 'animateHeight').name('animate');
        f.close();
        
        f = this.dat.addFolder('offset');
        f.add(this.params, 'minOffset').min(0).max(100).step(.1).name('min');
        f.add(this.params, 'maxOffset').min(0).max(100).step(.1).name('max');
        f.add(this.params, 'offset').min(0).max(100).step(.1).onChange(app.CanvasView.offset);
        f.add(this.params, 'animateOffset').name('animate');
        f.close();
        this.dat.add(this.params, 'save').name('save image');
        
        $(this.el).append(this.dat.domElement);
        
        return this;
    },
    
    save: function() {
        
        if (image = $(app.CanvasView.el)[0].toDataURL("image/jpeg")) {
            
            window.open(image);
        }
    },
    
    update: function() {
        
        var lo = this.dat.get('minWidth');
        var v = this.dat.get('width');
        var hi = this.dat.get('maxWidth');
    
        if (lo.getValue() > hi.getValue()) lo.setValue(hi.getValue());
        if (lo.getValue() > v.getValue()) v.setValue(lo.getValue());
        if (hi.getValue() < v.getValue()) v.setValue(hi.getValue());
        
        if (this.dat.get('animateWidth').getValue()) {
            var range = (hi.getValue() - lo.getValue());
            this.params.width = Math.cos(this.theta / Math.PI * 180) * range / 2 + range / 2 + lo.getValue();
        }
        
        var lo = this.dat.get('minHeight');
        var v = this.dat.get('height');
        var hi = this.dat.get('maxHeight');
        
        if (lo.getValue() > hi.getValue()) lo.setValue(hi.getValue());
        if (lo.getValue() > v.getValue()) v.setValue(lo.getValue());
        if (hi.getValue() < v.getValue()) v.setValue(hi.getValue());
        
        if (this.dat.get('animateHeight').getValue()) {
            var range = (hi.getValue() - lo.getValue());
            this.params.height = Math.cos(this.theta / Math.PI * 180) * range / 2 + range / 2 + lo.getValue();
        }
        
        var lo = this.dat.get('minOffset');
        var v = this.dat.get('offset');
        var hi = this.dat.get('maxOffset');
        
        if (lo.getValue() > hi.getValue()) lo.setValue(hi.getValue());
        if (lo.getValue() > v.getValue()) v.setValue(lo.getValue());
        if (hi.getValue() < v.getValue()) v.setValue(hi.getValue());
        
        if (this.dat.get('animateOffset').getValue()) {
            var range = (hi.getValue() - lo.getValue());
            this.params.offset = Math.cos(this.theta / Math.PI * 180) * range / 2 + range / 2 + lo.getValue();
        }
        
        for (var i in this.dat.__controllers) {
            this.dat.__controllers[i].updateDisplay();
        }
        
        for (var key in this.dat.__folders) {
            for (var i in this.dat.__folders[key].__controllers) {
                this.dat.__folders[key].__controllers[i].updateDisplay();
            }
        }
        
        this.updateTheta();
    },
    
    updateTheta: function() {
        
        if (this.theta > 360) {
            this.theta = 0;
        } else {
            this.theta += .0012;
        }
    }
});
// js/app/View/VideoView.js

var VideoView = Backbone.View.extend({
    
    tagName: 'video',
    
    max_width: 640,
    max_height: 360,
    
    initialize: function() {
        
        _.bindAll(this, 'dispose', 'render', 'onReady', 'ended');
        
        this.el.addEventListener('loadeddata', this.onReady, false);
    },
    
    dispose: function() {
        
        this.el.removeEventListener('loadeddata', this.onReady, false);
        this.el.removeEventListener('ended', this.ended, false);
        this.remove();
    },
    
    render: function() {
        
        $(this.el).hide();
        
        return this;
    },
    
    onReady: function() {
        
        this.el.removeEventListener('ended', this.ended, false);
        this.el.addEventListener('ended', this.ended, false);
        
        app.AppView.hideAnnounce();
        
        var width = $(this.el).width();
        var height = $(this.el).height()

        if ($(this.el).width() > this.max_width) {
            
            width = this.max_width;
            height = parseInt(height * this.max_width / $(this.el).width());
            
        } else if ($(this.el).height() > this.max_height) {
            
            width = parseInt(width * this.max_height / $(this.el).height());
            height = this.max_height;
        }
        
        var videoCanvas = document.createElement('canvas');
        
        videoCanvas.width = width;
        videoCanvas.height = height;
        this.el.videoCanvas = videoCanvas;
        
        app.CanvasView.texture = app.CanvasView.el.texture(this.el);
        app.CanvasView.filter = app.CanvasView.el.glitch(app.CanvasView.texture);
        
        this.el.play();
    },
    
    ended: function() {
        
        this.trigger('ended');
    }
}); 

})(jQuery);