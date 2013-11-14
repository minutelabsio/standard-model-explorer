define(
    [
        'jquery',
        'moddef',
        'modules/visualizations/interactions',
        'modules/visualizations/fourier-sum'//,
        // './globals'
    ],
    function(
        $,
        M,
        InteractionChart,
        FourierSum//,
        // globals
    ) {

        'use strict';

        /**
         * Page-level Mediator
         * @module Boilerplate
         * @implements {Stapes}
         */
        var Mediator = M({

            /**
             * Mediator Constructor
             * @return {void}
             */
            constructor : function(){

                var self = this;
                self.initEvents();

                $(function(){
                    self.resolve('domready');
                });

                self.after('domready').then(function(){
                    self.onDomReady()
                });
            },

            /**
             * Initialize events
             * @return {void}
             */
            initEvents : function(){

                var self = this;
                
            },

            /**
             * DomReady Callback
             * @return {void}
             */
            onDomReady : function(){

                var self = this;
                return;

                InteractionChart({
                    el: $('<div>').appendTo('#viewport').get(0)
                });

                FourierSum({
                    el: $('<div>').appendTo('#viewport').get(0)
                });

                $('html').removeClass('loading');
            }

        }, ['events']);

        return new Mediator();

    }

);




