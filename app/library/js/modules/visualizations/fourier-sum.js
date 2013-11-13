define(
    [
        'kinetic',
        'moddef'
    ],
    function(
        Kinetic,
        M
    ) {

        'use strict';

        var PI2 = 2*Math.PI;

        function wave( f, w, A, dx, dy ){

            var res = 2
                ,x = 0
                ,data = []
                ,pt
                ,l = f.length
                ,norm = 1/l
                ,i
                ;

            A *= 0.5;

            while ( x < w ){

                pt = {
                    x: x,
                    y: 0
                }

                if ( l ){
                    i = 0;
                    while ( i < l ){
                        pt.y += -A * (Math.cos( PI2 * f[ i ] * (x + dx) ) - 1) + dy
                        i++;
                    }
                    pt.y *= norm;
                } else {
                    pt.y = -A * (Math.cos( PI2 * f * (x + dx) ) - 1) + dy
                }
                data.push( pt );
                x += res;
            }

            return data;
        }

        var defaults = {
            el: null
        };

        /**
         * Fourier Sum Demo
         * @module FourierSumDemo
         */
        var Module = M({
            /**
             * Module Constructor
             * @return {void}
             */
            constructor : function( cfg ){

                var self = this;

                self.width = 600;
                self.height = 600;

                if (!cfg.el){
                    return;
                }

                self.el = cfg.el;
                self.stage = new Kinetic.Stage({
                    container: self.el,
                    width: self.width,
                    height: self.height
                });

                self.modes = [];
                var f = 1/self.width;

                var sum = self.addMode( 0.002, true );
                self.addMode( f * 4, true );
                self.addMode( f * 3, true );
                self.addMode( f * 2, true );
                self.addMode( f, true );
                
                

                self.on('change:mode', function(){
                    var modes = self.modes;
                    var l = modes.length;
                    var freqs = [];
                    while ( --l > 0 ){
                        freqs.push( modes[ l ].freq );
                    }
                    
                    sum.setFreq( freqs );
                });
                self.emit('change:mode')
            },

            addMode: function( w, changeable ){

                var self = this
                    ,modes = self.modes
                    ,l = modes.length
                    ,h = 100
                    ,dy = self.height - (h + 10) * (l+1)
                    ,group
                    ,obj = {
                        freq: w
                    }
                    ;

                obj.layer = new Kinetic.Layer();
                group = new Kinetic.Group();

                group.add(new Kinetic.Rect({
                    x: 1,
                    y: dy+1,
                    width: self.width-2,
                    height: h,
                    stroke: 'rgba(0,0,0,0.2)',
                    strokeWidth: 0.5
                }));

                obj.spline = new Kinetic.Spline({
                    points: [0,0],
                    stroke: 'rgba(59, 157, 222, 0.9)',
                    strokeWidth: 1,
                    lineCap: 'round',
                    tension: 0.5
                });

                obj.setFreq = function( f ){
                    obj.freq = f;
                    obj.spline.setPoints( wave( f, self.width, h-20, -self.width/2, 10+dy ) );
                    obj.layer.draw();
                };

                if ( changeable ){
                    var start;
                    var f;
                    group.on('mousedown', function( e ){
                        f = obj.freq;
                        start = [e.x, e.y];
                    });

                    group.on('mousemove', function( e ){
                        if (start){
                            var dw = (e.x - start[0]) * 2e-5;
                            obj.setFreq(Math.min(Math.max(f - dw, 0), 100));
                            self.emit('change:mode', obj);
                        }
                    });

                    group.on('mouseup', function( e ){
                        start = false;
                    });
                }

                group.on('mouseover', function() {
                    document.body.style.cursor = 'ew-resize';
                });
                group.on('mouseout', function() {
                    document.body.style.cursor = 'default';
                });

                obj.setFreq( obj.freq );

                group.add(obj.spline);
                obj.layer.add(group);
                self.stage.add(obj.layer);
                modes.push( obj );
                return obj;
            }

        }, ['events']);

        return Module;
    }
);