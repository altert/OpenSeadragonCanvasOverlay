// OpenSeadragon canvas Overlay plugin 0.0.2 based on svg overlay plugin

(function() {
    
    var $ = window.OpenSeadragon;

    if (!$) {
        $ = require('openseadragon');
        if (!$) {
            throw new Error('OpenSeadragon is missing.');
        }
    }

    // ----------
    $.Viewer.prototype.canvasOverlay = function(options) {
        if (this._canvasOverlayInfo) {
            return this._canvasOverlayInfo;
        }

        this._canvasOverlayInfo = new Overlay(this, options);
        return this._canvasOverlayInfo;
    };

    // ----------
    var Overlay = function(viewer, options) {
        var self = this;
        this._viewer = viewer;

        this._containerWidth = 0;
        this._containerHeight = 0;

        this._canvasdiv = document.createElement('div');
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

        this._viewer.addHandler('update-viewport', function() {
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
            this._viewportOrigin = new $.Point(0, 0);
            var boundsRect = this._viewer.viewport.getBoundsNoRotate(true);
            this._viewportOrigin.x = boundsRect.x;
            this._viewportOrigin.y = boundsRect.y * this.imgAspectRatio;

            this._viewportWidth = boundsRect.width;
            this._viewportHeight = boundsRect.height * this.imgAspectRatio;
            var image1 = this._viewer.world.getItemAt(0);
            this.imgWidth = image1.source.dimensions.x;
            this.imgHeight = image1.source.dimensions.y;
            this.imgAspectRatio = this.imgWidth / this.imgHeight;
        },
        // ----------
        _updateCanvas: function() {
            var viewportZoom = this._viewer.viewport.getZoom(true);
            var scale = viewportZoom * this._containerWidth;
            var context = this._canvas.getContext('2d');
            var centerX = this._canvas.width / 2;
            var centerY = this._canvas.height / 2;
            var degrees = this._viewer.viewport.getRotation();
            var DEG2RAD = Math.PI / 180;

            var x =
                ((this._viewportOrigin.x / this.imgWidth - this._viewportOrigin.x) / this._viewportWidth) *
                this._containerWidth;
            var y =
                ((this._viewportOrigin.y / this.imgHeight - this._viewportOrigin.y) /
                    this._viewportHeight) *
                this._containerHeight;

            if (this.clearBeforeRedraw) {
                this.clear();
            }

            context.translate(centerX, centerY);
            context.rotate(degrees * DEG2RAD);
            context.translate(-centerX, -centerY);

            context.translate(x, y);
            context.scale(scale, scale);
            this.onRedraw();
            context.setTransform(1, 0, 0, 1, 0, 0);
        }
    };

})();
