define(
    [
        'jquery',
        'kinetic',
        'moddef',
        'modules/vis-utils',
        'tpl!templates/fourier-sum.tpl'
    ],
    function(
        $,
        Kinetic,
        M,
        VisUtils,
        tplFourierSum
    ) {

        'use strict';

        var wave = VisUtils.wave;

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

                self.width = 400;
                self.height = 640;

                self.el = $( tplFourierSum.render({ module: self }) );
                self.stage = new Kinetic.Stage({
                    container: self.el.find('.vis').width( self.width ).height( self.height ).get(0),
                    width: self.width,
                    height: self.height
                });

                self.modes = [];
                var f = 1/self.width;
                var amps = [];
                var l = 6;
                while ( l-- ){
                    amps.push( Math.exp( - 0.05 * ((l - 6)) * ((l - 6)) ) * 100 );
                }

                var sum = self.addMode( 0.002, false, '=', amps );
                self.addMode( f * 6, true, '+' );
                self.addMode( f * 5, true, '+' );
                self.addMode( f * 4, true, '+' );
                self.addMode( f * 3, true, '+' );
                self.addMode( f * 2, true, '+' );
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

            addMode: function( w, changeable, symbol, A ){

                var self = this
                    ,modes = self.modes
                    ,l = modes.length
                    ,paddingLeft = 25
                    ,wid = self.width - paddingLeft
                    ,h = 80
                    ,dy = self.height - (h + 10) * (l+1)
                    ,group
                    ,obj = {
                        amp: A || (h - 20),
                        freq: w
                    }
                    ;

                obj.layer = new Kinetic.Layer();
                group = new Kinetic.Group();

                group.add(new Kinetic.Rect({
                    x: paddingLeft + 1,
                    y: dy+1,
                    width: wid-2,
                    height: h,
                    stroke: 'rgba(0,0,0,0.2)',
                    strokeWidth: 0.5
                }));

                obj.symbol = new Kinetic.Text({
                    x: 0,
                    y: dy + h/2 - 20,
                    text: symbol || '',
                    fontSize: 40,
                    fontFamily: 'pt-sans',
                    fill: '#000'
                });

                obj.spline = new Kinetic.Spline({
                    points: [0,0],
                    stroke: 'rgba(59, 157, 222, 0.9)',
                    strokeWidth: 2,
                    lineCap: 'round',
                    tension: 0.5
                });

                obj.spline.setOffsetX( -paddingLeft - 1 );

                obj.setFreq = function( f ){
                    obj.freq = f;
                    obj.spline.setPoints( wave( f, obj.amp, wid, -wid/2, 10+dy ) );
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

                group.add(obj.symbol);
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