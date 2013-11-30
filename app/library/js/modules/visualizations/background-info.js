define(
    [
        'jquery',
        'moddef',
        'when',
        'tpl!templates/background-info.tpl',
        'modules/generative-tree',

        'physicsjs',
        'physicsjs/renderers/canvas',
        'physicsjs/bodies/circle',
        'physicsjs/behaviors/edge-collision-detection',
        'physicsjs/behaviors/body-impulse-response',

        'modules/physicsjs/pixi-renderer'
    ],
    function(
        $,
        M,
        when,
        tplBackgroundInfo,
        Tree,

        Physics
    ) {

        var easeInQuad = function (x, t, b, c, d) {
                return c*(t/=d)*t + b;
        };

        var easeInOutQuad = function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
        };

        var Module = M({

            constructor: function( options ){

                var self = this;

                self.el = $( tplBackgroundInfo.render({ module: self }) );

                self.initCanvas();
                self.initPhysics();
                self.initEvents();
            },

            initEvents: function(){

                var self = this;

                self.el.on({
                    'click': function(){
                        self.play( !self.playing );
                    }
                })

                self.on('load', function(){
                    self.resize();
                });
            },

            initPhysics: function(){

                var self = this;
                var world = self.world = Physics();

                self.edge = Physics.behavior('edge-collision-detection', {
                    aabb: Physics.aabb(0, 0, 100, 100)
                });
                
                world.add([
                    self.renderer,
                    self.edge,
                    Physics.behavior('body-impulse-response')
                ]);

                world.pause();
                world.subscribe('step', function(){
                    world.render();
                });

                Physics.util.ticker.subscribe(function(time){
                    world.step(time);
                }).start();
            },

            resize: function(){

                var self = this;
                var w = self.width = self.el.width();
                var h = self.height = self.el.height();
                self.renderer.resize( w, h );
                self.canvas[0].width = w;
                self.canvas[0].height = h;
                self.edge.setAABB(Physics.aabb(0, 0, w, h));

            },

            initCanvas: function(){

                var self = this;
                
                self.canvas = $('<canvas>').css('zIndex', 5).appendTo(self.el);
                self.ctx = self.canvas[0].getContext('2d');
                self.hiddenCanvas = $('<canvas>');
                self.hctx = self.hiddenCanvas[0].getContext('2d');

                self.renderer = Physics.renderer('pixi', {
                    el: self.el[0],
                    width: 100,
                    height: 100
                });
            },

            play: function( tog ){

                var self = this;

                // parse arg
                tog = tog !== false;

                if ( !self.playing === !tog ){
                    return self;
                }

                self.playing = tog;
                self.el.toggleClass('playing', tog);

                // play/pause
                if ( tog ){

                    self.animTree().then(function(){
                        self.animParticleSplit();
                        setTimeout(function(){
                            self.zoomTo(0, 0.5 * self.height - 200, 200, 3000);
                        }, 3000);
                    });
                    

                } else {

                    self.world.pause();
                }

                return self;
            },

            particalize: function(ctx, res){
                var self = this;
                var w = ctx.canvas.width * res | 0;
                var h = ctx.canvas.height * res | 0;
                var px = 1/res;
                var hctx = self.renderer.hiddenCtx;
                hctx.canvas.width = w;
                hctx.canvas.height = h;
                // draw to temp canvas at different resolution
                hctx.drawImage(ctx.canvas, 0, 0, w, h);
                var data = hctx.getImageData(0, 0, w, h).data;
                var ret = [];
                var x, y, r = px * 0.5;
                for ( var i = 0, l = data.length; i < l; i+=4 ){
                    if (data[i+3] > 10){
                        ctx.beginPath();
                        x = (((0.25*i) % w)*px + r) | 0;
                        y = ((((0.25*i)/w)|0)*px + r) | 0;
                        ret.push({
                            x: x,
                            y: y,
                            radius: r,
                            color: 'rgba(' + [data[i], data[i+1], data[i+2], data[i+3]/255].join(',')+ ')'
                        });
                    }
                }
                return ret;
            },

            animTree: function(){

                var dfd = when.defer();
                var tree = new Tree( this.ctx, 0.5 * this.width, this.height - 50);
                var callback = function(){
                    if ( tree.next() === false ){
                        Physics.util.ticker.unsubscribe( callback );
                        dfd.resolve( tree );
                    }
                };

                Physics.util.ticker.subscribe( callback );
                return dfd.promise;
            },

            animParticleSplit: function(){

                var self = this;
                var ctx = self.ctx;
                var particles = self.particalize(ctx, .25);
                var world = self.world;
                var bodies = world.getBodies();

                if (bodies.length){
                    world.remove( bodies );
                }
                bodies = [];
                
                for (var i = 0, l = particles.length; i < l; i++){
                    particles[i].radius *= 1;
                    particles[i].vx = 0.01*(Math.random()-0.5);
                    particles[i].vy = -0.01*(Math.random()-0.5);
                    particles[i].restitution = Math.random();
                    body = Physics.body('circle', particles[i]);
                    body.view = self.renderer.createView(body.geometry, particles[i].color);
                    bodies.push( body );
                }
                
                world.add( bodies );
                world.unpause();
                world.subscribe('render', function( data ){
                    ctx.clearRect(0,0, self.width, self.height);
                    world.unsubscribe(data.topic, data.handle);
                });
            },

            zoomTo: function(x, y, scale, dur){

                var self = this
                    ,dfd = when.defer()
                    ,si = self.renderer.root.scale.x || 1
                    ,ds = scale - si
                    ,s = si
                    ,xi = self.renderer.root.position.x
                    ,dx = -ds * (0.5 * self.width + x) - xi
                    ,yi = self.renderer.root.position.y
                    ,dy = -ds * (0.5 * self.height + y) - yi
                    ,step
                    ,ts
                    ;

                x = xi;
                y = yi;

                step = function( t ){
                    ts = ts || t;
                    dt = t - ts;
                    if ( dt > dur ){
                        dfd.resolve();
                        Physics.util.ticker.unsubscribe( step );
                        return;
                    }

                    s = easeInOutQuad(s, dt, si, ds, dur);
                    self.renderer.root.scale.x = s;
                    self.renderer.root.scale.y = s;

                    x = easeInOutQuad(x, dt, xi, dx, dur);
                    self.renderer.root.position.x = x;
                    y = easeInOutQuad(y, dt, yi, dy, dur);
                    self.renderer.root.position.y = y;
                };

                Physics.util.ticker.subscribe( step );

                return dfd.promise;
            }

        }, ['events'])

        return Module;
    }
);
