// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Moller
// fixes from Paul Irish and Tino Zijdel
 
(function(window) {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
 
    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}(this));

(function(window, document, undefined){
    var height = document.height;
    var width = document.width;
    var canvas = document.createElement('canvas');
    var ctx;
    canvas.width = width;
    canvas.height = height;

    try {
        ctx = canvas.getContext('2d');
    } catch ( e ){
        return;
    }

    canvas.id = 'ripple-canvas';

    var ripples = [];
    function ripple(x, y, r){
        var rip = {
            x: x,
            y: y,
            radius: r || 5
        };
        
        ripples.push(rip);
    }

    var listener = function listener(e){
        ripple(e.pageX, e.pageY);
    };
    window.addEventListener('mousemove', listener);

    function now(){
        return (new Date()).getTime();
    }

    function lerp(a, b, p) {
        return (b-a)*p + a;
    }

    var time = now();
    var vel = 0.03;
    var Pi2 = 2 * Math.PI;
    function step(){

        if (canvas.className === 'hidden'){
            return cleanup();
        }

        window.requestAnimationFrame(step);
        
        var dt = now() - time;
        time += dt;
            
        // reset
        canvas.width = canvas.width;
        
        var rip;
        for (var i = 0, l = ripples.length; i < l; i++){
            rip = ripples[i];
            rip.radius += dt * vel;
            
            ctx.clearRect(rip.x-rip.radius,rip.y-rip.radius,rip.x+rip.radius,rip.y+rip.radius);
        }
        
        // draw
        ctx.strokeWidth = 2;
        var op;
        for (var i = 0, l = ripples.length; i < l; i++){
            rip = ripples[i];
            op = lerp(0.9, 0, rip.radius/60);
            
            if (op <= 0.01){
                ripples.splice(i, 1)
                i--;
                l--;
            } else {
                ctx.strokeStyle = 'rgba(40,40,0,'+ op +')';
                ctx.beginPath();
                ctx.arc(rip.x, rip.y, rip.radius, 0, Pi2);
                ctx.stroke();
            }
        }
    }

    var to;
    function fluctuate(){
        
        to = setTimeout(fluctuate, Math.random()*6000|0);
        
        ripple(Math.random()*width, Math.random()*height, Math.random()*20);
    }

    function cleanup(){
        clearTimeout( to );
        window.removeEventListener('mousemove', listener);
        ripples = null;
        canvas.parentElement.removeChild( canvas );
    }

    fluctuate();
    step();

    function inject(){
        if (!document.body){
            setTimeout(inject, 50);
        } else {
            document.body.appendChild(canvas);
        }
    }

    inject();

})(this, this.document);
