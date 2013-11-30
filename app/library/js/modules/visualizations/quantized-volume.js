define(
    [
        'jquery',
        'moddef',
        'modules/vis-utils',

        'tpl!templates/quantized-volume.tpl'
    ],
    function(
        $,
        M,
        VisUtils,
        tplQuantizedVolume
    ) {
        'use strict';

        var Pi2 = Math.PI * 2;

        function advance( x ){

            var a = this.amp
                ,f = this.f
                ,px = this.px || 0
                ,res = this.res || 1
                ,data = this.data
                ,dy = this.dy|0
                ,i
                ;

            for ( i = px; i < x; i += res ){
                
                data.push({
                    x: i,
                    y: a * Math.sin( Pi2 * f * i ) + dy
                });
            }

            var overflow = (data.length - (this.width / res))|0;

            if ( overflow > 0 ){
                data.splice(0, overflow);
            }

            this.px = i;
        }

        var Module = M({

            constructor: function( options ){

                var self = this;

                self.el = $( tplQuantizedVolume.render({ module: self }) );
                self.initEvents();
                self.initCanvas();

                self.start();
            },

            initEvents: function(){

                var self = this;

                self.el.on('change', 'input', function(){
                    var $this = $(this);
                    var target = $this.attr('data-target');
                    self[ target+'sin' ].amp = (+$this.val()) * 0.5 * self[ target+'canvas' ].height;
                });
            },

            initCanvas: function(){

                var self = this;
                
                self.ccanvas = self.el.find('canvas.classical').get(0);
                self.cctx = self.ccanvas.getContext('2d');
                self.qcanvas = self.el.find('canvas.quantum').get(0);
                self.qctx = self.qcanvas.getContext('2d');

                self.csin = {
                    amp: 0.3 * self.ccanvas.height / 2,
                    f: 0.1,
                    width: self.ccanvas.width,
                    data: [],
                    dy: self.ccanvas.height/2,
                    advance: advance,
                    res: 0.5
                };
                self.qsin = {
                    amp: 0.3 * self.qcanvas.height / 2,
                    f: 0.1,
                    width: self.qcanvas.width,
                    data: [],
                    dy: self.qcanvas.height/2,
                    advance: advance,
                    res: 0.5
                };

                
            },

            start: function(){

                var self = this;

                self.tstart = (new Date()).getTime();
                // self.cctx.translate(self.csin.width, 0);
                // self.qctx.translate(self.qsin.width, 0);
                VisUtils.raf.on('tick', self.plot, self);
            },

            plot: function( e, t ){

                var self = this;
                var x = 0.03 * (t - self.tstart);
                
                self.csin.advance( x );
                self.qsin.advance( x );

                self.ccanvas.width = self.ccanvas.width;
                self.qcanvas.width = self.qcanvas.width;

                self.cctx.save();
                self.qctx.save();
                self.cctx.translate(-(x-self.csin.width), 0);
                self.qctx.translate(-(x-self.qsin.width), 0);
                
                VisUtils.plot(self.cctx, self.csin.data, '#F5F3D1', 2);
                VisUtils.plot(self.qctx, self.qsin.data, '#F5F3D1', 2);

                self.cctx.restore();
                self.qctx.restore();
            }

        }, ['events'])

        return Module;
    }
);
