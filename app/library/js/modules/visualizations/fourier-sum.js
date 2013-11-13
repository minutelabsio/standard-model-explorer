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
            }

        }, ['events']);

        return Module;
    }
);