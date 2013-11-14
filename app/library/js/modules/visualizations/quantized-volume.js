define(
    [
        'timbre',
        'moddef',

        'tpl!templates/quantized-volume.tpl'
    ],
    function(
        T,
        M,
        tplQuantizedVolume
    ) {

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
                    self[ target+'sin' ].mul = +$this.val();
                });
            },

            initCanvas: function(){

                var self = this;
                var plotopts = {
                    width: 300,
                    foreground: '#F5F3D1',
                    background: '#333',
                    lineWidth: 2
                };

                self.ccanvas = self.el.find('canvas.classical').get(0);
                self.qcanvas = self.el.find('canvas.quantum').get(0);

                self.csin = T('sin', { freq: 2, mul: 0.3 });
                self.qsin = T('sin', { freq: 2, mul: 0.3 });

                var cplotopts = $.extend({ target: self.ccanvas }, plotopts);
                self.classical = T('scope', { interval: 2000 }).on('data', function() {
                    this.plot( cplotopts );
                });

                var qplotopts = $.extend({ target: self.qcanvas }, plotopts);
                self.quantum = T('scope', { interval: 2000 }).on('data', function() {
                    this.plot( qplotopts );
                });
            },

            start: function(){

                var self = this;

                self.classical.listen( self.csin );
                self.quantum.listen( self.qsin );
            }

        }, ['events'])

        return Module;
    }
);
