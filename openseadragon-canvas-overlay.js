// OpenSeadragon canvas Overlay plugin 0.0.1 based on svg overlay plugin

(function() {

    if (!window.OpenSeadragon) {
        console.error('[openseadragon-canvas-overlay] requires OpenSeadragon');
        return;
    }


    // ----------
    OpenSeadragon.Viewer.prototype.canvasOverlay = function(options) {
        
        if (this._canvasOverlayInfo) {
            return this._canvasOverlayInfo;
        }

        this._canvasOverlayInfo = new Overlay(this,options);
        return this._canvasOverlayInfo;
    };

    // ----------
    var Overlay = function(viewer,options) {
        var self = this;
        console.log(this);
        this._viewer = viewer;

        this._containerWidth = 0;
        this._containerHeight = 0;

        this._canvasdiv = document.createElement( 'div');
        this._canvasdiv.style.position = 'absolute';
        this._canvasdiv.style.left = 0;
        this._canvasdiv.style.top = 0;
        this._canvasdiv.style.width = '100%';
        this._canvasdiv.style.height = '100%';
        this._viewer.canvas.appendChild(this._canvasdiv);

        this._canvas = document.createElement('canvas');
        this._canvasdiv.appendChild(this._canvas);
        
        this.onRedraw = options.onRedraw || function(){};
        this.clearBeforeRedraw = (typeof (options.clearBeforeRedraw) !== "undefined") ?
                        options.clearBeforeRedraw : true;
                        
        this.resize();                
        
        this._viewer.addHandler('animation', function() {         
            self.resize();
            self._updateCanvas();
        });

        this._viewer.addHandler('open', function() {
            self.resize();
            self._updateCanvas();     
        });

       
    };

    // ----------
    Overlay.prototype = {
        // ----------
        canvas: function() {
            return this._canvas;
        },
        // ----------
        context2d: function() {
            return this._canvas.getContext('2d');
        },
        // ----------
        clear: function() {
            this._canvas.getContext('2d').clearRect(0, 0, this._containerWidth, this._containerHeight); 
        },
        // ----------
        resize: function() {
            if (this._containerWidth !== this._viewer.container.clientWidth) {
                this._containerWidth = this._viewer.container.clientWidth;
                this._canvasdiv.setAttribute('width', this._containerWidth);
                this._canvas.setAttribute('width', this._containerWidth);
            }

            if (this._containerHeight !== this._viewer.container.clientHeight) {
                this._containerHeight = this._viewer.container.clientHeight;
                this._canvasdiv.setAttribute('height', this._containerHeight);
                this._canvas.setAttribute('height', this._containerHeight);
            }
        },
        _updateCanvas: function() {
            var viewportZoom = this._viewer.viewport.getZoom(true);
            var image1 = this._viewer.world.getItemAt(0);
            var zoom = image1.viewportToImageZoom(viewportZoom);
            var origin = new OpenSeadragon.Point(0, 0);     
            var image1WindowPoint = image1.imageToWindowCoordinates(origin);        
            var x=Math.round(image1WindowPoint.x);
            var y=Math.round(image1WindowPoint.y);
            if (this.clearBeforeRedraw) this.clear();
            this._canvas.getContext('2d').translate(x,y);
            this._canvas.getContext('2d').scale(zoom,zoom);     
            this.onRedraw();    
            this._canvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
        }
    };

})();
