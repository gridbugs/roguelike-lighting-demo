'use strict'

const cljs = require('clojurescript-nodejs')
const gulp = require('gulp')
const runSequence = require('run-sequence')

const rimraf = require('gulp-rimraf')
const plumber = require('gulp-plumber')
const replace = require('gulp-replace')
const requirejsOptimize = require('gulp-requirejs-optimize')
const traceur = require('gulp-traceur')
const webserver = require('gulp-webserver')
const debug = require('gulp-debug')

const through = require('through2')
const argv = require('yargs').argv
const path = require('path')

/* The build config file is config/build.cljs */
const CONFIG = cljs(path.join(__dirname, 'config', 'buildjs.cljs'), [__dirname])

function glob(dir, ext) {
    ext = ext === undefined ? '.js' : ext
    return `${dir}/**/*${ext}`
}

const SERVER_PORT = argv.port === undefined ? CONFIG.DEFAULT_SERVER_PORT : parseInt(argv.port)
const OUTPUT_JS_DIR_FULL = path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_JS_DIR)

const SOURCE_JS_DIR = path.join(CONFIG.SOURCE_DIR, CONFIG.JS_DIR)
const SOURCE_CLJS_DIR = path.join(CONFIG.SOURCE_DIR, CONFIG.CLJS_DIR)

gulp.task('default', ['development'])

gulp.task('production', (callback) => {
    runSequence('build', 'optimize')
})

gulp.task('development', (callback) => {
    runSequence('build', ['serve', 'stream'])
})

gulp.task('build', (callback) => {
    runSequence(['static', 'stage'], 'cljs', 'images', 'compile', callback)
})

gulp.task('stream', () => {
    return gulp.watch(glob(CONFIG.SOURCE_DIR, '.*'), ['build'])
})

gulp.task('cljs', (callback) => {
    const CLJS_PATHS = [__dirname, path.join(__dirname, SOURCE_CLJS_DIR)]

    function runCljsScript(name) {
        return cljs(path.join(__dirname, SOURCE_CLJS_DIR, CONFIG.CLJS_SCRIPTS[name]), CLJS_PATHS)
    }

    for (let name in CONFIG.CLJS_SCRIPTS) {
        runCljsScript(name)
    }

    callback();
})

gulp.task('stage', () => {
    return gulp.src(glob(SOURCE_JS_DIR))
        .pipe(debug({title: 'stage'}))
        .pipe(gulp.dest(CONFIG.STAGE_DIR))
})

gulp.task('static', () => {
    return gulp.src(`${CONFIG.STATIC_DIR}/**`)
        .pipe(debug({title: 'static'}))
        .pipe(gulp.dest(CONFIG.OUTPUT_DIR))
})

gulp.task('images', () => {
    return gulp.src(`${CONFIG.IMAGE_DIR}/**`)
        .pipe(debug({title: 'images'}))
        .pipe(gulp.dest(path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_IMAGE_DIR)))
})

gulp.task('compile', () => {
    return gulp.src(glob(CONFIG.STAGE_DIR))
        .pipe(plumber({
            handleError: (err) => {
                console.log(err.toString())
                this.emit('end')
            }
        }))
        .pipe(debug({title: 'compile'}))
        .pipe(traceur(CONFIG.TRACEUR_OPTS))
        .pipe(gulp.dest(OUTPUT_JS_DIR_FULL))
})

gulp.task('optimize', () => {
    /* The optimizer uses the ENTRY_FILE name as the module name
     * of the main module. We need to remove the file extension
     * from it to maintain compatibility with the unoptimized code. */
    const QUOTE = '"'
    const EXTENSION = '.js'
    const ENTRY_FILE_PATTERN = `${QUOTE}${CONFIG.ENTRY_FILE}${QUOTE}`
    const ENTRY_MODULE_PATTERN = ENTRY_FILE_PATTERN.replace(
        new RegExp(`${QUOTE}([^${QUOTE}]*)${EXTENSION}${QUOTE}`), `${QUOTE}$1${QUOTE}`)

    return gulp.src(path.join(OUTPUT_JS_DIR_FULL , CONFIG.ENTRY_FILE))
        .pipe(debug({title: 'optimize'}))
        .pipe(requirejsOptimize())
        .pipe(replace(ENTRY_FILE_PATTERN, ENTRY_MODULE_PATTERN))
        .pipe(gulp.dest(OUTPUT_JS_DIR_FULL))
})

gulp.task('serve', () => {
    return gulp.src(CONFIG.OUTPUT_DIR)
    .pipe(webserver({
        port: SERVER_PORT,
        fallback: CONFIG.INDEX_FILE,
        livereload: false
    }))
})

gulp.task('clean', () => {
    return gulp.src(CONFIG.STAGE_DIR)
        .pipe(rimraf())
})

gulp.task('cleanout', () => {
    return gulp.src(CONFIG.OUTPUT_DIR)
        .pipe(rimraf())
})

gulp.task('mrproper', ['clean', 'cleanout'])
