module.exports = function(config) {
    var src = 'dist/js/';
    config.set({
        basePath: '',
        files : [
            // bower:
            // endbower
            {pattern: src + '**/*.js', included: false},
            {pattern: 'test/unit/**/*.js', included: false},

            'test/main-unit.js'
        ],
        exclude: [ src + 'main.js' ],

        frameworks: ['jasmine', 'requirejs'],
        reporters: ['progress'],
        browsers: ['PhantomJS'], // Chrome
        autoWatch: true,
        singleRun: false,
        colors: true
    });
};
