const cljs = require('clojurescript-nodejs')

const gulp = require('gulp')

const clean = require('gulp-clean')
const plumber = require('gulp-plumber')
const replace = require('gulp-replace')
const requirejsOptimize = require('gulp-requirejs-optimize')
const traceur = require('gulp-traceur')
const webserver = require('gulp-webserver')

const argv = require('yargs').argv
const path = require('path')

/* The build config file is config/build.cljs */
const CONFIG = cljs([__dirname, 'config', 'buildjs.cljs'].join(path.sep), [__dirname])

const SOURCE_GLOB = `${CONFIG.SOURCE_DIR}/**/*.js`

const SERVER_PORT = argv.port === undefined ? CONFIG.DEFAULT_SERVER_PORT : parseInt(argv.port)

gulp.task('default',['build', 'stream', 'serve'])

gulp.task('stream', () => {
    gulp.watch(SOURCE_GLOB, ['build'])
})

gulp.task('build', () => {
    gulp.src(SOURCE_GLOB)
    .pipe(plumber({
        handleError: (err) => {
            console.log(err.toString())
            this.emit('end')
        }
    }))
    .pipe(traceur(CONFIG.TRACEUR_OPTS))
    .pipe(gulp.dest(CONFIG.OUTPUT_DIR))
})

gulp.task('optimize', () => {
    /* The optimizer uses the ENTRY_FILE name as the module name
     * of the main module. We need to remove the file extension
     * from it to maintain compatibility with the unoptimized code. */
    const QUOTE = '"'
    const EXTENSION = '.js'
    const ENTRY_FILE_PATTERN = `${QUOTE}${CONFIG.ENTRY_FILE}${QUOTE}`
    const ENTRY_MODULE_PATTERN = ENTRY_FILE_PATTERN.replace(
        new RegExp(`${QUOTE}([^${QUOTE}]*)${EXTENSION}${QUOTE}`), `${QUOTE}$1${QUOTE}`);

    gulp.src([CONFIG.OUTPUT_DIR , CONFIG.ENTRY_FILE].join(path.sep))
        .pipe(requirejsOptimize())
        .pipe(replace(ENTRY_FILE_PATTERN, ENTRY_MODULE_PATTERN))
        .pipe(gulp.dest(CONFIG.OUTPUT_DIR))
})

gulp.task('serve', () => {
    gulp.src('.')
    .pipe(webserver({
        port: SERVER_PORT,
        fallback: CONFIG.INDEX_FILE,
        livereload: false
    }))
})

gulp.task('clean', () => {
    gulp.src(CONFIG.OUTPUT_DIR)
    .pipe(clean())
})
