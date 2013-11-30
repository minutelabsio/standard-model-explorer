define(
    [
        'jquery',
        'kinetic',
        'moddef',
        'modules/vis-utils',
        'tpl!templates/uncertainty-principal.tpl'
    ],
    function(
        $,
        Kinetic,
        M,
        VisUtils,
        tplUP
    ) {

        'use strict';

        var wave = VisUtils.wave;

        var defaults = {
            el: null
        };

        /**
         * Uncertainty principal demo
         * @module UPDemo
         */
        var Module = M({
            /**
             * Module Constructor
             * @return {void}
             */
            constructor : function( cfg ){

                var self = this;

                self.width = 600;
                self.height = 60;

                self.el = $( tplUP.render({ module: self }) );
                self.stage = new Kinetic.Stage({
                    container: self.el.find('.vis').width( self.width ).height( self.height ).get(0),
                    width: self.width,
                    height: self.height
                });

                self.initEvents();

                self.drawWavePacket();
            },

            initEvents: function(){

                var self = this;
                self.on('load', function(){
                    self.resolve('load');
                });

                self.after('load', function(){
                    self.el.find('.video').html('<iframe width="560" height="315" src="//www.youtube.com/embed/7vc-Uvp3vwg" frameborder="0" allowfullscreen class="video"></iframe>');
                });
            },

            drawWavePacket: function(){

                var self = this;
                var data = [];
                var diff
                    ,w = 0.25 / self.width
                    ,a = self.height - 5
                    ;

                for ( var x = 0, l = self.width; x < l; ++x ){
                    
                    diff = (x - 0.5 * self.width);

                    data.push({
                        x: x,
                        y: self.height - 2 - a * Math.exp(- w * diff * diff)
                    });
                }

                var line = new Kinetic.Spline({
                    points: data,
                    stroke: 'rgba(59, 157, 222, 0.9)',
                    strokeWidth: 3,
                    lineCap: 'round',
                    tension: 0.5
                });

                var layer = new Kinetic.Layer();
                layer.add( line );
                self.stage.add( layer );
            }

        }, ['events']);

        return Module;
    }
);