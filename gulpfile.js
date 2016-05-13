'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');

const rimraf = require('gulp-rimraf');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const requirejsOptimize = require('gulp-requirejs-optimize');
const traceur = require('gulp-traceur');
const webserver = require('gulp-webserver');

const argv = require('yargs').argv;
const path = require('path');
const glob = require('glob');
const fs = require('fs');

/* The build config file is config.json */
const CONFIG = JSON.parse(fs.readFileSync('config.json'));

/* Port for webserver */
const SERVER_PORT = argv.port === undefined ? CONFIG.DEFAULT_SERVER_PORT : parseInt(argv.port);

/* Path shorthand */
const OUTPUT_JS_DIR = path.join(CONFIG.OUTPUT_DIR, CONFIG.JS_COMPILED_DIR);

const STAGE_JS_SOURCE_DIR = path.join(CONFIG.STAGE_DIR, CONFIG.JS_SOURCE_DIR);
const STAGE_JS_COMPILED_DIR = path.join(CONFIG.STAGE_DIR, CONFIG.JS_COMPILED_DIR);
const OUTPUT_JS_COMPILED_DIR = path.join(CONFIG.OUTPUT_DIR, CONFIG.JS_COMPILED_DIR);

/* Running 'gulp' with no argument starts a development environment */
gulp.task('default', ['development-environment']);

/* Output will be in separate files with names matching the source including source map */
gulp.task('development', (callback) => {
    runSequence('build', 'copy', callback);
});

/* Output will be minified with no source map */
gulp.task('production', (callback) => {
    runSequence('build', 'optimize', callback);
});

/* Run development task, watching directories and running server */
gulp.task('development-environment', (callback) => {
    runSequence('development', ['stream-development', 'serve'], callback);
});

/* Run production task, watching directories and running server */
gulp.task('production-environment', (callback) => {
    runSequence('production', ['stream-production', 'serve'], callback);
});

/* Watch the source directory, running development task after changes */
gulp.task('stream-development', () => {
    return gulp.watch(`{${CONFIG.SOURCE_DIR},${CONFIG.STATIC_DIR}}/**`, ['development']);
});

/* Watch the source directory, running production task after changes */
gulp.task('stream-production', () => {
    return gulp.watch(`{${CONFIG.SOURCE_DIR},${CONFIG.STATIC_DIR}}/**`, ['production']);
});

/* Compile code and run build scripts, leaving result in stage directory */
gulp.task('build', (callback) => {
    runSequence(['static', 'stage'], 'images', 'compile', callback);
});

/* Copy js source to stage directory */
gulp.task('stage', () => {
    return gulp.src(`${CONFIG.SOURCE_DIR}/**/*.js`)
        .pipe(gulp.dest(STAGE_JS_SOURCE_DIR));
});

/* Copy static files to output directory */
gulp.task('static', () => {
    return gulp.src(`${CONFIG.STATIC_DIR}/**`)
        .pipe(gulp.dest(CONFIG.OUTPUT_DIR));
});

/* Copy images to output directory */
gulp.task('images', () => {
    return gulp.src(`${CONFIG.IMAGE_DIR}/**`)
        .pipe(gulp.dest(path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_IMAGE_DIR)));
});

/* Compile ES6 to javascript */
gulp.task('compile', () => {
    return gulp.src(`${STAGE_JS_SOURCE_DIR}/**/*.js`)
        .pipe(plumber({
            handleError: (err) => {
                console.log(err.toString())
                this.emit('end')
            }
        }))
        .pipe(traceur(CONFIG.TRACEUR_OPTS))
        .pipe(gulp.dest(STAGE_JS_COMPILED_DIR));
});

/* Copies compiled javascript from stage directory to output directory.
 * This is functionally equivalent to the 'optimize' task. */
gulp.task('copy', () => {
    return gulp.src(`${STAGE_JS_COMPILED_DIR}/**/*.js`)
        .pipe(gulp.dest(OUTPUT_JS_COMPILED_DIR));
});

/* Minifies the compiled javascript in the stage directory, storing the
 * result in the output directory. This is functionally equivalent to
 * the 'copy' task. */
gulp.task('optimize', () => {
    /* The optimizer uses the ENTRY_FILE name as the module name
     * of the main module. We need to remove the file extension
     * from it to maintain compatibility with the unoptimized code. */
    const QUOTE = '"'
    const EXTENSION = '.js'
    const ENTRY_FILE_PATTERN = `${QUOTE}${CONFIG.ENTRY_FILE}${QUOTE}`
    const ENTRY_MODULE_PATTERN = ENTRY_FILE_PATTERN.replace(
        new RegExp(`${QUOTE}([^${QUOTE}]*)${EXTENSION}${QUOTE}`), `${QUOTE}$1${QUOTE}`)

    return gulp.src(path.join(STAGE_JS_COMPILED_DIR, CONFIG.ENTRY_FILE))
        .pipe(requirejsOptimize())
        .pipe(replace(ENTRY_FILE_PATTERN, ENTRY_MODULE_PATTERN))
        .pipe(gulp.dest(OUTPUT_JS_COMPILED_DIR));
});

/* Start a webserver in the output directory */
gulp.task('serve', () => {
    return gulp.src(CONFIG.OUTPUT_DIR)
    .pipe(webserver({
        port: SERVER_PORT,
        fallback: CONFIG.INDEX_FILE,
        livereload: false
    }));
});

/* Deletes the stage directory */
gulp.task('clean', () => {
    return gulp.src(CONFIG.STAGE_DIR)
        .pipe(rimraf());
});

/* Deletes the output directory */
gulp.task('cleanout', () => {
    return gulp.src(CONFIG.OUTPUT_DIR)
        .pipe(rimraf());
});

/* Deletes all generated code */
gulp.task('mrproper', ['clean', 'cleanout']);
