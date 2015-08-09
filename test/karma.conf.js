// Karma configuration
// Generated on Wed Jul 01 2015 01:14:10 GMT+0900 (대한민국 표준시)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['qunit'],


    // list of files / patterns to load in the browser
    files: [
      'src/**/*.js',
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // source files, that you wanna generate coverage for 
      // do not include tests or libraries 
      // (these files will be instrumented by Istanbul) 
      'src/**/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'html', 'junit'],

    junitReporter: {
      outputFile: 'test-results.xml',
      suite: ''
    },
    
    // optionally, configure the reporter 
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    
    // the default configuration 
    htmlReporter: {
      outputDir: 'karma_html', // where to put the reports  
      templatePath: null, // set if you moved jasmine_template.html 
      focusOnFailures: true, // reports show failures on start 
      namedFiles: false, // name files instead of creating sub-directories 
      pageTitle: null, // page title for reports; browser info by default 
      urlFriendlyName: false // simply replaces spaces with _ for files/dirs 
      
      
      // experimental 
    },
    
    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: false,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS', 'IE', 'Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  })
}
