define(
    [
        'jquery',
        'stapes',
        'modules/visualizations/interactions'//,
        // './globals'
    ],
    function(
        $,
        Stapes,
        InteractionChart//,
        // globals
    ) {

        'use strict';

        /**
         * Page-level Mediator
         * @module Boilerplate
         * @implements {Stapes}
         */
        var Mediator = Stapes.subclass({

            /**
             * Mediator Constructor
             * @return {void}
             */
            constructor : function(){

                var self = this;
                self.initEvents();

                $(function(){
                    self.emit('domready');
                });

            },

            /**
             * Initialize events
             * @return {void}
             */
            initEvents : function(){

                var self = this;
                self.on('domready', self.onDomReady);

            },

            /**
             * DomReady Callback
             * @return {void}
             */
            onDomReady : function(){

                var self = this;

                InteractionChart({
                    el: $('#interactions').get(0)
                });
            }

        });

        return new Mediator();

    }

);




