define(
    [
        'pixi',
        'physicsjs'
    ],
    function(
        PIXI,
        Physics
    ){

        Physics.renderer('pixi', 'canvas', function( parent ){
            
            return {
                init: function( options ){
                    // create an new instance of a pixi stage
                    this.stage = new PIXI.Stage(0xffffff);
                 
                    // create a renderer instance.
                    this.renderer = PIXI.autoDetectRenderer(options.width, options.height);
                    
                    if ( options.el ){
                        options.el.appendChild( this.renderer.view );
                    }
                    
                    options.el = this.renderer.view;
                    
                    parent.init.call(this, options);
                    
                    this.el = this.renderer.view;
                    this.root = new PIXI.DisplayObjectContainer();
                    this.stage.addChild( this.root );
                    this.renderer.render(this.stage);
                },

                resize: function( w, h ){
                    this.renderer.resize( w, h );
                    this.renderer.render(this.stage);
                },

                connect: function( world ){
                    var self = this;
                    world.subscribe('remove:body', self.removeView, self);
                },

                disconnect: function( world ){
                    var self = this;
                    world.unsubscribe('remove:body', self.removeView);
                },

                removeView: function( data ){
                    var self = this;
                    var view = data.body.view;

                    if ( view ){
                        self.root.removeChild( view );
                    }
                },
                
                beforeRender: function(){},
                
                createView: function(geometry, styles){
                    var img = parent.createView.call(this, geometry, styles);
                    // create a texture from an image path
                    var texture = PIXI.Texture.fromImage( img.src );
                    // create a new Sprite using the texture
                    var view = new PIXI.Sprite(texture);
                    view.anchor.x = 0.5;
                    view.anchor.y = 0.5;
                    view.width = img.width;
                    view.height = img.height;
                    this.root.addChild(view);
                    return view;
                },
                
                drawBody: function(body, view){
                    view.position.x = body.state.pos.get(0);
                    view.position.y = body.state.pos.get(1);
                    view.rotation = body.state.angular.pos;
                },
                
                render: function( bodies, meta ){
                    parent.render.call(this, bodies, meta);
                    this.renderer.render(this.stage);
                }
            };
        });
    }
);