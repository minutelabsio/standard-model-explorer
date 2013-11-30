define(
    [
    ],
    function(
        
    ){

        /**
         * Code From: http://codepen.io/rlemon/pen/wJBds
         */
        function Tree(ctx, x, y) {

            var that = this;
            this.ctx = ctx;
            this.loss = .1; // branch width loss
            this.speed = .2; // runner distance speed
            this.limit = 10000; // limit the number of new generations (before I stop);
            this.i = 0;

            this.steps = [];
            this.steps.push(function(){
                // start the generation
                that.develop(20,0,x,y,0,-0.9*3);
            });
        }
        Tree.prototype = {
            constructor: Tree,
            // width, life, x, y, deviationx, devationy
            develop: function(w,l,x,y,dx,dy) {
                var that = this;
                this.ctx.beginPath();
                this.ctx.moveTo(x,y); // goto start
                x+=dx; //set up new position
                y+=dy;
                dx+=Math.sin(Math.random()+l)*this.speed;
                dy+=Math.cos(Math.random()+l + (l/2))*this.speed;
                // if width is large enough we are a trunk/branch
                if ( w-l*this.loss > 10 ) {
                    this.ctx.lineWidth = w-l*this.loss;
                    this.ctx.strokeStyle = 'rgba(77, 62, 58, 1.0)';
                } else { // otherwise a leaf
                    this.ctx.lineWidth = (w-l*this.loss)*4;
                    this.ctx.strokeStyle = 'rgba(24, ' + (Math.random() * 60 + 68 | 0) + ', 62, .3)';
                }
                // draw line
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
                this.ctx.closePath();

                if ( this.i++ > this.limit ) {
                    return false;
                }

                // if we've been generating a while start drawing leafs.
                if ( l > 3 * w + Math.random() * 80 && Math.random()>.5) {
                    this.steps.push(function(){
                        that.develop(w,++l,x,y,2*Math.sin(Math.random()+l),2*Math.cos(Math.random()+l));
                    });
                }
                // draw branches (or leafs, depending on size).. yes both draw leafs. i said it was cheap.
                if ( w-l*this.loss >= -1 ) {
                    this.steps.push(function(){
                        that.develop(w,++l,x,y,dx,dy);
                    });
                }
            },

            next: function(){

                var steps = this.steps;
                this.steps = [];
                var fn;

                if ( !steps.length ){
                    return false;
                }

                while ( fn = steps.shift() ){
                    fn();
                }

                return true;
            }
        };

        return Tree;
    }
);