define(['moddef'], function( M ){

    var PI2 = 2*Math.PI;

    var wave = function wave( f, w, A, dx, dy, res ){

        var x = 0
            ,data = []
            ,pt
            ,l = f.length
            ,norm = 1/l
            ,i
            ;

        res = res || 2;

        A *= 0.5;

        while ( x < w ){

            pt = {
                x: x,
                y: 0
            }

            if ( l ){
                i = 0;
                while ( i < l ){
                    pt.y += -A * (Math.cos( PI2 * f[ i ] * (x + dx) ) - 1) + dy
                    i++;
                }
                pt.y *= norm;
            } else {
                pt.y = -A * (Math.cos( PI2 * f * (x + dx) ) - 1) + dy
            }
            data.push( pt );
            x += res;
        }

        return data;
    };

    var plot = function plot(ctx, data, stroke, lw){

        var d;

        ctx.beginPath();

        if ( stroke ){
            ctx.strokeStyle = stroke;
        }
        if ( lw ){
            ctx.lineWidth = lw;
        }

        d = data[0];
        ctx.moveTo(d.x, d.y);
        for ( var i = 1, l = data.length; i < l; ++i ){
            
            d = data[ i ];
            ctx.lineTo(d.x, d.y);
        }

        ctx.stroke();
    };


    var raf = new (M({
        constructor: function(){
            var self = this;
            function loop( t ){
                window.requestAnimationFrame(loop);
                self.emit('tick', (new Date()).getTime());
            }
            loop();
        }
    }, ['events']));

    return {
        wave: wave,
        plot: plot,
        raf: raf
    };
});