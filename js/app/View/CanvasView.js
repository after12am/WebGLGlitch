
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