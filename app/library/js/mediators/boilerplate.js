define(
    [
        'jquery',
        'moddef',
        'modules/visualizations/interactions',
        'modules/visualizations/fourier-sum',

        // templates
        'tpl!templates/about.tpl'
    ],
    function(
        $,
        M,
        InteractionChart,
        FourierSum,

        tplAbout
    ) {

        'use strict';

        function errback(){
            console.log(arguments)
        }

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
                self.initPages();

                $(function(){
                    setTimeout(function(){
                        self.resolve('domready');
                    }, 1000);
                });

                self.after('domready').then(function(){
                    self.onDomReady();
                });
            },

            /**
             * Initialize events
             * @return {void}
             */
            initEvents : function(){

                var self = this;
                
                $(document).on('click', '#ctrl-start', function(){

                    var rc = $('#ripple-canvas').addClass('hidden');
                    $('#loading-status, #intro-text').fadeOut('slow', function(){
                        $(this).remove();
                        self.emit('begin');
                    });
                    return !1;
                });

                self.on('begin', function(){
                    self.page(0);
                    self.pages.first().fadeIn('fast');
                });
            },

            initPages: function(){
                var self = this;

                var pages = [];

                pages.push( $(tplAbout.render()).get(0) );

                self.pages = $( pages ).hide();
            },

            page: function( n ){

                var self = this;
                // switch to page "n"
            },

            /**
             * DomReady Callback
             * @return {void}
             */
            onDomReady : function(){

                var self = this;

                self.vp = $('#viewport');
                self.vp.append( self.pages );

                $('#loading-status .loading-text').replaceWith('<a href="#" id="ctrl-start" class="btn">Begin!</a>');

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




