WebGL Glitch
============

This is a web application using WebGL. This application allows you to glitch your image or video in real time in your browser. 
I prepares glitch controller. So you can create little glitch animation. 
When you are interested in this application, please visit <a href="https://github.com/after12am/ofxTLGlitch">ofxTLGlitch</a> which is running on openframeworks as addon.  

And this application uses improved image effect library which is originally created by <a href="https://github.com/evanw">evanw</a>. 
As the library don't provides glitch effect, I incorporated the glitch effect to that library. 
If you want to know more infomation about the library called by glfx.js, visit <a href="https://github.com/evanw/glfx.js">glfx.js</a>. 

## Demo

### <a href="http://after12am.github.com/WebGLGlitch/">View Live Demo</a>

### original

<img src="https://raw.github.com/after12am/WebGLGlitch/master/screenshot/sample1.jpg" />

Photo Credit by <a href="http://www.flickr.com/photos/svenreinhold/6911691814/in/photostream">SvenReinhold</a>

### glitched

<img src="https://raw.github.com/after12am/WebGLGlitch/master/screenshot/sample2.jpg" />

## Usage

Here shows you how to use incorporated glitch effect. The usage is:

```html
<script type="text/javascript" src="glfx.js"></script>
<script type="text/javascript">
    
    function processing(pixels) {
        for (var i = 0, j = 0; i < pixels.length; i = i + 4) {
            pixels[i] = pixels[i];
            pixels[i + 1] = 0;
            pixels[i + 2] = 0;
            pixels[i + 3] = pixels[i];
        }
    }
    
    window.onload = function() {
        
        // we have to call these methods for use of glfx.js
        var image = document.getElementById('image');
        var canvas = fx.canvas();
        var texture = canvas.texture(image);
        document.body.appendChild(canvas);
        
        // this shows you how to glich image
        var glitch = canvas.glitch(texture);
        glitch.format(fx.RGBA)           // set pack format
              .width(image.width - 10)   // set pack width
              .height(image.height)      // set pack height
              .offset(100)               // set offset of pixel array
              .process(processing)       // if you want to control pixels, call process function like this.
              .update();                 // call update for drawing
    }
</script>

<img id="image" src="sample1.jpg" />
```