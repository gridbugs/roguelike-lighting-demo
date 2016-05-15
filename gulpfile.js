'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');

const rimraf = require('gulp-rimraf');
const plumber = require('gulp-plumber');
const webserver = require('gulp-webserver');
const sourcemaps = require('gulp-sourcemaps');
const sweetjs = require('gulp-sweetjs');
const uglify = require('gulp-uglify');
const identity = require('gulp-identity');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');

const glob = require('glob');
const argv = require('yargs').argv;
const path = require('path');
const fs = require('fs');

/* The build config file is config.json */
const CONFIG = JSON.parse(fs.readFileSync('config.json'));

/* Running 'gulp' with no argument starts a development environment */
gulp.task('default', (callback) => {
    runSequence('clean', 'build', 'stream', 'serve', callback);
});

/* Watch the source directory, running development task after changes */
gulp.task('stream', () => {
    return gulp.watch(`{${CONFIG.SOURCE_DIR},${CONFIG.STATIC_DIR},${CONFIG.MACRO_DIR}}/**`, ['compile', 'static']);
});

/* Compile code and run build scripts, leaving result in stage directory */
gulp.task('build', (callback) => {
    runSequence(['static', 'images', 'compile'], callback);
});

/* Copy static files to output directory */
gulp.task('static', () => {
    return gulp.src(`${CONFIG.STATIC_DIR}/**`)
        .pipe(gulp.dest(CONFIG.OUTPUT_DIR));
});

/* Copy images to output directory */
gulp.task('images', () => {
    return gulp.src(`${CONFIG.IMAGE_DIR}/**`)
        .pipe(gulp.dest(path.join(CONFIG.OUTPUT_DIR, CONFIG.IMAGE_DIR)));
});

/* Turn multiple files of ES6 into a single js file */
gulp.task('compile', (callback) => {
    runSequence('transpile', 'resolve', callback);
});

/* Compile ES6 to javascript */
gulp.task('transpile', () => {

    const babelStep = () => babel({
        plugins: ["transform-async-to-generator"],
        presets: ['es2015']
    });

    const sweetjsStep = () => sweetjs({
        modules: glob.sync(`./${CONFIG.MACRO_DIR}/**/*.js`),
        sourceMap: true
    });

    const minify = CONFIG.DEBUG ? identity() : uglify();

    return gulp.src(`${CONFIG.SOURCE_DIR}/**/*.js`)
        .pipe(plumber({
            handleError: (err) => {
                console.log(err.toString())
                this.emit('end')
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(babelStep())      // turn es6 into es5, so the macro engine doesn't see es6
        .pipe(sweetjsStep())    // resolve macros on resulting es5
        .pipe(babelStep())      // turn es6 produced by macros into es5
        .pipe(minify)           // minify each file
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.join(CONFIG.STAGE_DIR)));
});

/* Resolve commonjs dependencies produced by babel */
gulp.task('resolve', () => {
    return gulp.src(path.join(CONFIG.STAGE_DIR, CONFIG.ENTRY_FILE))
        .pipe(webpack({
            devtool: '#source-map',
            module: {
                preLoaders: [
                    {
                        test: /\.js$/,
                        loader: 'source-map-loader'
                    }
                ]
            },
            output: {
                filename: CONFIG.OUTPUT_FILE
            },
            resolve: {
                root: [
                    path.resolve(CONFIG.STAGE_DIR)
                ]
            }
        }))
        .pipe(gulp.dest(path.join(CONFIG.OUTPUT_DIR, CONFIG.COMPILED_DIR)));
});

/* Start a webserver in the output directory */
gulp.task('serve', () => {

    const port = argv.port === undefined ? CONFIG.DEFAULT_SERVER_PORT : parseInt(argv.port);

    return gulp.src(CONFIG.OUTPUT_DIR)
    .pipe(webserver({
        host: '0.0.0.0',
        port: port,
        fallback: CONFIG.INDEX_FILE,
        livereload: false
    }));
});

/* Deletes the output directory */
gulp.task('clean', () => {
    return gulp.src(`{${CONFIG.OUTPUT_DIR},${CONFIG.STAGE_DIR}}`)
        .pipe(rimraf());
});
