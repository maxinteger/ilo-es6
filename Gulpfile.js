/* global require: false */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
    runSeq = require('gulp-run-sequence'),
    es = require('event-stream'),
    plumber = require('gulp-plumber'),
    changed = require('gulp-changed'),
    traceur = require('gulp-traceur'),
    connect = require('gulp-connect');

var appDir =        '',
    distDir =       appDir + 'dist/',
    srcDir =        appDir + 'src/',
    testDir =       appDir + 'test/',
    coffeeFiles =   srcDir + 'js/**/*.coffee',
    JSFiles =       srcDir + 'js/**/*.js',
    JSTestFiles =   testDir + 'unit/**/*.js',
    lessFiles =     srcDir + 'less/**/*.less',
    htmlFiles =     [srcDir + 'templates/**/*.html', appDir + 'index.html'],
    assetFiles =    appDir + 'assets',
    bowerDeps =     appDir + 'bower_components';

gulp.task('clean-dist', function () {
    return gulp.src(distDir + '*', {read: false}).pipe(clean());
});

gulp.task('dev-compile', function () {
    return gulp.src(JSFiles)
        .pipe(changed(distDir + 'js/'))
        .pipe(traceur({
            experimental: true,
            sourceMap: true,
            modules: 'amd'
        })
            .on('error', gutil.log)
            .on("error", notify.onError(function (error) {
                return "Traceur Error: " + error.message;
            }))
    ).pipe(gulp.dest(distDir + 'js/'))
        .pipe(connect.reload());
});

gulp.task('dev', ['clean-dist'], function () {
    runSeq('dev-compile', function(){
        gulp.watch(JSFiles, ['dev-compile']);
    });
});