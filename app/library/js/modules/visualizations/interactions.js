define(
    [
        'd3',
        'moddef'
    ],
    function(
        d3,
        M
    ) {

        'use strict';

        var defaults = {
            el: null
        };

        /**
         * Interaction chart module
         * @module InteractionChart
         * @implements {Stapes}
         */
        var Module = M({

            /**
             * Module Constructor
             * @return {void}
             */
            constructor : function( cfg ){

                var self = this;

                self.width = 600;
                self.height = 600;

                if (!cfg.el){
                    return;
                }

                self.el = d3.select( cfg.el );
                self.svg = self.el
                    .append('svg')
                    .attr('width', self.width)
                    .attr('height', self.height)
                    ;

                self.initRegions();
                self.initLabels();
            },

            initRegions: function(){

                var self = this;
                var regionData = self.regionData = [
                    { cx: '38%', cy: '34%', r: '25%' }, // 0
                    { cx: '62%', cy: '34%', r: '25%' }, // 1
                    { cx: '38%', cy: '66%', r: '25%' }, // 2
                    { cx: '62%', cy: '66%', r: '25%' }, // 3
                    { cx: '20%', cy: '50%', r: '15%' }, // 4
                    { cx: '69%', cy: '56%', rx: '26%', ry: '20%' } // 5
                ];

                var colors = d3.scale.category10();
                var regions = self.regions = self.svg.append('g').attr('class', 'regions');

                var regionEls = self.regionEls = regions.selectAll('.region')
                    .data( regionData )
                    .enter()
                    .append('ellipse')
                    .attr('data-idx', function( d, idx ){ return idx; })
                    .attr('class', 'region')
                    .attr('fill', function( d, idx ){
                        var c = d3.hsl( colors( idx ) ).brighter( 0.8 );
                        regionData[ idx ].color = c;
                        return 'hsla('+[c.h, c.s*100+'%', c.l*100 + '%'].join(',')+', 0.25)';
                    })
                    .attr('cx', function( d ){ return d.cx; })
                    .attr('cy', function( d ){ return d.cy; })
                    .attr('rx', '0%')
                    .attr('ry', '0%')
                    ;

                regionEls.transition()
                    .duration(500)
                    .attr('rx', function( d ){ return d.rx || d.r; })
                    .attr('ry', function( d ){ return d.ry || d.r; })
                    .each('end', function(){
                        regionEls.on('mouseover', function( d, idx ){
                            self.highlightRegions([ idx ]);
                        })
                        .on('mouseout', function( d, idx ){
                            self.highlightRegions( false );
                        });
                    })
                    ;
            },

            highlightRegions: function( indexes, hideothers ){

                var self = this
                    ,regions = self.regions
                    ,regionEls = self.regionEls
                    ;

                regionEls
                    .transition()
                    .ease('ease-out')
                    .duration(300)
                    .attr('fill', function( d ){
                        var c = d.color;
                        return 'hsla('+[c.h, c.s*100+'%', c.l*100 + '%'].join(',')+', 0.25)';
                    })
                    ;

                if ( !indexes || !indexes.length ){
                    return;
                } else if ( hideothers || indexes.length > 1 ){

                    regionEls.filter(function(){
                        var idx = d3.select( this ).attr('data-idx');
                        return indexes.indexOf( idx|0 ) > -1;
                    }).each(function(){
                        var el = this;
                        regions.append(function(){ return el; });
                    }).transition()
                        .ease('ease-out')
                        .duration(300)
                        .attr('fill', function( d ){
                            var c = d.color.brighter( 0.3 );
                            var alpha = Math.sqrt(1 / indexes.length);
                            return 'hsla('+[c.h, c.s*100+'%', c.l*100 + '%'].join(',')+', '+alpha+')';
                        })
                        ;

                    regionEls.filter(function(){
                        var idx = d3.select( this ).attr('data-idx');
                        return indexes.indexOf( idx|0 ) < 0;
                    }).transition()
                        .ease('ease-out')
                        .duration(300)
                        .attr('fill', function( d ){
                            var c = d.color.brighter( 0.3 );
                            return 'hsla('+[c.h, c.s*100+'%', c.l*100 + '%'].join(',')+', 0)';
                        })
                        ;

                } else {

                    var el = regions.select('.region[data-idx="'+indexes[0]+'"]');
                    regions.append(function(){ return el.node(); })
                        .transition()
                        .ease('ease-out')
                        .duration(300)
                        .attr('fill', function( d ){
                            var c = d.color.brighter( 0.3 );
                            return 'hsla('+[c.h, c.s*100+'%', c.l*100 + '%'].join(',')+', 1)';
                        })
                        ;
                }
            },

            initLabels: function(){

                var self = this;

                var labelData = [
                    { name: 'W', x: '50%', y: '50%', self: true, regions: [0,1,2,3,5] },
                    { name: 'Z', x: '52%', y: '64%', regions: [2,3,5] },
                    { name: 'H', x: '50%', y: '78%', self: true, regions: [2, 3] },
                    { name: 'q', x: '30%', y: '50%', regions: [0,2,4] },
                    { name: 'l', x: '70%', y: '50%', regions: [1,3,5] },
                    { name: 'ν', x: '88%', y: '50%', regions: [5] },
                    { name: 'γ', x: '50%', y: '30%', regions: [0,1] },
                    { name: 'g', x: '10%', y: '50%', self: true, regions: [4] }
                ];
                var labels = self.svg.append('g').attr('class', 'labels');

                var labelsSel = labels.selectAll('.label')
                    .data( labelData )
                    .enter()
                    .append('g')
                        .attr('class', 'label')
                        .on('mouseover', function( d ){
                            self.highlightRegions( d.regions, true );
                            d3.select(this).select('circle')
                                .transition()
                                .ease('ease-out')
                                .duration(300)
                                .attr('stroke', '#222')
                                ;
                        })
                        .on('mouseout', function(){
                            self.highlightRegions( false );
                            d3.select(this).select('circle')
                                .transition()
                                .ease('ease-out')
                                .duration(300)
                                .attr('stroke', function( d ){
                                    return d.self ? 'rgb(90, 90, 90)' : 'rgb(210, 210, 200)';
                                })
                                ;
                        })
                    ;

                labelsSel.append('circle')
                    .attr('fill', 'rgb(250, 250, 250)')
                    .attr('stroke', function( d ){
                        return d.self ? 'rgb(70, 70, 70)' : 'rgb(210, 210, 200)';
                    })
                    .attr('stroke-dasharray', function( d ){
                        return d.self ? '8,8' : null;
                    })
                    .attr('stroke-width', 2)
                    .attr('r', '0.8em')
                    .attr('cx', function( d ){ return d.x; })
                    .attr('cy', function( d ){ return d.y; })
                    ;

                labelsSel.append('text')
                    .text(function( d ){ return d.name; })
                    .attr('x', function( d ){ return d.x; })
                    .attr('y', function( d ){ return d.y; })
                    .attr('dy', '.4em')
                    .style('text-anchor', 'middle')
                    ;
            },

            /**
             * Initialize events
             * @return {void}
             */
            initEvents : function(){

                var self = this;
                

            }
        });

        return Module;
    }
);