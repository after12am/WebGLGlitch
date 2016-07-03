
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
        // alert(error_message);
        throw error_message;
    }
    
    try {
        app.CanvasView = new CanvasView();
    } catch (e) {
        // alert('Sorry, but ' + e);
        throw 'Sorry, but ' + e;
    }
    
    app.DatView = new DatView();
    app.AppView = new AppView();
    
    // start animate
    app.AppView.start();
});