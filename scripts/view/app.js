
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
        
        var file = e.dataTransfer.files[0];
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