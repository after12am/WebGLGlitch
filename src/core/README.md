
## Usage

Here shows you how to use glitch effect. The usage is:

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