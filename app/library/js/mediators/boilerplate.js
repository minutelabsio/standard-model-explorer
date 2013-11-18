define(
    [
        'jquery',
        'lodash',
        'moddef',

        'modules/visualizations/interactions',
        'modules/visualizations/fourier-sum',
        'modules/visualizations/quantized-volume',
        'modules/visualizations/uncertainty-principal',

        // templates
        'tpl!templates/paginator.tpl',
        'tpl!templates/about.tpl',

        'vendor/jquery.mousewheel'
    ],
    function(
        $,
        _,
        M,
        InteractionChart,
        FourierSum,
        QuantizedVolume,
        UPDemo,

        tplPaginator,
        tplAbout,
        _jsmw
    ) {

        'use strict';

        function errback(){
            window.console.log(arguments);
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
                    self.resolve('domready');
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

                $(window).on('resize', function(){
                    self.resize();
                });
                
                $(document).on('click', '#ctrl-start', function(){

                    self.resolve('begin');
                    self.page( 1 );
                    return !1;
                });

                $(document).on('click', '.ctrl-continue', function(){
                    self.emit('paginate', 1);
                    return !1;
                });

                // paginator
                $(document).on('click', '#paginator > .up', function(){
                    self.emit('paginate', -1);
                    return !1;
                });
                $(document).on('click', '#paginator > .down', function(){
                    self.emit('paginate', 1);
                    return !1;
                });
                $(document).on('keyup', '#paginator > input', function(){
                    var n = parseInt( $(this).val() );

                    if ( n || n === 0 ){
                        self.page( n );
                    }
                    return !1;
                });

                /**
                 * @TODO mouse scroll and touch pagination
                 */
                $(document).on('mousewheel', function(e, d, dx, dy){
                    var thres = 15;
                    if (dy > thres){
                        // self.emit('paginate', -1);
                    } else if (dy < -thres){
                        // self.emit('paginate', 1);
                    }
                });

                self.after('begin').then(function(){
                    self.pages.show();
                    self.pages.first().fadeIn('fast');

                    self.on('paginate', function(e, n){
                        self.page( self.currentPage + n );
                    });
                });

                self.on('page', function( e, p ){
                    $('#ripple-canvas').toggleClass('hidden', p !== 0);
                });
            },

            initPages: function(){
                
                var self = this
                    ,pages = []
                    ,pageModules = []
                    ,p
                    ;

                // p = $(tplAbout.render());
                // pageModules.push( false );
                // pages.push( p.get(0) );

                p = QuantizedVolume();
                pageModules.push( p );
                pages.push( p.el.get(0) );

                p = FourierSum();
                pageModules.push( p );
                pages.push( p.el.get(0) );

                p = UPDemo();
                pageModules.push( p );
                pages.push( p.el.get(0) );

                self.pages = $( pages ).hide();
                self.pageModules = pageModules;
                self.currentPage = 0;
            },

            resize: function(){

                var self = this;
                if ( self.$pages ){
                    self.$pages.height( $(window).height() );
                }
            },

            page: function( n ){

                var self = this
                    ,mod
                    ;
                n = n|0;
                
                if (n < 0 || n > self.pages.length){
                    return;
                }

                mod = self.pageModules[ self.currentPage ];
                if ( mod ){
                    mod.emit('unload');
                }

                self.currentPage = n;
                self.$paginator.find('input:first').val( n );
                var y = -self.currentPage * $(window).height();
                
                if ( window.Modernizr.csstransforms ){
                    self.$pages.css('transform', 'translate(0px, '+ y +'px');
                }

                mod = self.pageModules[ self.currentPage ];

                if ( mod ){
                    mod.emit('load');
                }

                self.emit('page', n);
            },

            /**
             * DomReady Callback
             * @return {void}
             */
            onDomReady : function(){

                var self = this;

                self.$vp = $('#viewport');
                self.$pages = $('#pages');

                self.$pages.append( self.pages );
                self.resize();
                
                self.$paginator = $( tplPaginator.render() ).appendTo( self.$vp );

                $('#loading-status .loading-text').replaceWith('<a href="#" id="ctrl-start" class="btn">Begin!</a>');

                self.pageModules.unshift( false );
                self.pages.unshift( $('#page-intro').get(0) );
                
                $('html').removeClass('loading');
                
                // InteractionChart({
                //     el: $('<div>').appendTo('#viewport').get(0)
                // });

            }

        }, ['events']);

        return new Mediator();

    }

);




