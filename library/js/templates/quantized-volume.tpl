<section id="page-quantized-volume">

    <div class="desc">
        <p><em>Quanta</em> is just a fancy way of saying that the fields only like to riple in discrete amounts.</p>
        <p>It's like having a volume control <strong>that locks into integer settings</strong>.</p>
    </div>
    
    <div class="cols-2">
        <div class="col">
            <p>This is probably the type of behavior you're used to seeing. When you change the volume, it changes continuously. You can <strong>set the volume as low as you want without turning it off</strong>.</p>
            <input data-target="c" type="range" min="0" max="0.9" step="0.0001" value="0.3">
            <canvas class="classical"></canvas>
        </div>
        <div class="col">
            <p>This is what <em>actually</em> happens when we look at how really small things behave. This is the world where the laws are described by Quantum Mechanics. At this scale, <strong>the fields have a minimum volume</strong>.</p>
            <input data-target="q" type="range" min="0" max="0.9" step="0.3" value="0.3">
            <canvas class="quantum"></canvas>
        </div>
    </div>

    <div class="desc">
        <button class="btn ctrl-continue right">Continue</button>
    </div>

</section>