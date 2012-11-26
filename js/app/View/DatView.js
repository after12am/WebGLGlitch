
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