
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