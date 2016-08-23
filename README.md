# OpenSeadragonCanvasOverlay

An [OpenSeadragon](http://openseadragon.github.io) plugin that adds canvas overlay capability.

Compatible with OpenSeadragon 2.2.0 or greater.

## Documentation

To use, include the `openseadragon-canvas-overlay.js` file after `openseadragon.js` on your web page.

To add canvas overlay capability to your OpenSeadragon Viewer, call `canvasOverlay(options)` on it. It has two parameters:
`onRedraw` - callback function that does the actual drawing, and `clearBeforeRedraw` (default as true): clear canvas before redrawing. 

For example:

```javascript
var overlay = this.viewer.canvasOverlay({
    onRedraw:function() {      
        overlay.context2d().fillStyle = "red";
        overlay.context2d().fillRect(0, 0, 500, 500);            
    },
    clearBeforeRedraw:true
});
 ```  
  
 This will return a new object with the following methods:

* `canvas()`: Returns canvas element.
* `resize()`: If your viewer changes size, you'll need to resize the canvas overlay by calling this method.
* `clear()`: Clears canvas.
* `context2d()`: Gives access to 2d context of canvas, to draw on it.



See [online demo](http://altert.github.io/OpenSeadragonCanvasOverlay/demo.html) or demo.html for an example of it in use. 

