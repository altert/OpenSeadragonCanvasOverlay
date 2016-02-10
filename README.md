# OpenSeadragonCanvasOverlay

An [OpenSeadragon](http://openseadragon.github.io) plugin that adds canvas overlay capability.

Compatible with OpenSeadragon 2.0.0 or greater.

## Documentation

To use, include the `openseadragon-canvas-overlay.js` file after `openseadragon.js` on your web page.

To add canvas overlay capability to your OpenSeadragon Viewer, call `canvasOverlay()` on it. This will return a new object with the following methods:

* `canvas()`: Returns canvas element.
* `resize()`: If your viewer changes size, you'll need to resize the canvas overlay by calling this method.
* `clear()`: Clears canvas.
* `context2d()`: Gives access to 2d context of canvas, to draw on it.
* `redrawCanvas()`: You can use this function to draw on canvas. 
* `onAnimation()`: This function is called on animation, i.e. zoom and pan of overlay. You can use it to clear canvas before redraw, for example. 

See [online demo](http://altert.github.io/OpenSeadragonCanvasOverlay/demo.html) or demo.html for an example of it in use. 

