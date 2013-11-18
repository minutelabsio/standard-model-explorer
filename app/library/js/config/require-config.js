/**
 * Config options at: http://requirejs.org/docs/api.html#config
 */
require.config({

    // urlArgs: 'v='+(new Date()).getTime(),
    
    shim: {
        'timbre': {
            exports: 'T',
            init: function(){
                return this.T.noConflict();
            }
        },
        // Add shims for things here
        'd3': {
            exports: 'd3'
        }
    },

    paths: {
        //
        //  This is where you can add paths to any plugins or vendor scripts.
        //
        'moddef': 'modules/module',

        // Plugins
        'text': 'plugins/text',
        'json': 'plugins/json',
        'tpl' : 'plugins/tpl',
        'async' : 'plugins/async',

        // Templating
        'dot' : 'vendor/doT',

        // MVC
        'stapes': 'vendor/stapes',

        'lodash': 'vendor/lodash.min',

        'timbre': 'vendor/timbre',
        
        // jQuery
        'jquery': 'vendor/jquery',

        // d3.js
        'd3': 'vendor/d3.min',

        'kinetic': 'vendor/kinetic'
    },

    packages: [
        { name: 'when', location: 'vendor/when', main: 'when' }
    ],

    map: {
        
        '*' : {
            'site-config': 'config/site-config.json'
        }
    }
});
