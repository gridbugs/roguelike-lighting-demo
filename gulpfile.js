const gulp = require('gulp')

const clean = require('gulp-clean')
const plumber = require('gulp-plumber')
const replace = require('gulp-replace')
const requirejsOptimize = require('gulp-requirejs-optimize')
const traceur = require('gulp-traceur')
const webserver = require('gulp-webserver')

const argv = require('yargs').argv
const path = require('path')


const DEFAULT_SERVER_PORT = 8000

const OUTPUT_DIR = 'build'
const SOURCE_DIR = 'src'
const ENTRY_FILE = 'main.js'
const INDEX_FILE = 'index.html'
const SOURCE_GLOB = `${SOURCE_DIR}/**/*.js`

const SERVER_PORT = argv.port === undefined ? DEFAULT_SERVER_PORT : parseInt(argv.port)

const TRACEUR_OPTS = {
    asyncFunctions: true,
    classes: true,
    generators: true,
    arrowFunctions: true,
    blockBinding: true,
    forOf: true,
    templateLiterals: true,
    arrayComprehension: true,
    sourceMaps: 'inline',
    modules: 'amd'
}

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
    .pipe(traceur(TRACEUR_OPTS))
    .pipe(gulp.dest(OUTPUT_DIR))
})

gulp.task('optimize', () => {
    /* The optimizer uses the ENTRY_FILE name as the module name
     * of the main module. We need to remove the file extension
     * from it to maintain compatibility with the unoptimized code. */
    const QUOTE = '"'
    const EXTENSION = '.js'
    const ENTRY_FILE_PATTERN = `${QUOTE}${ENTRY_FILE}${QUOTE}`
    const ENTRY_MODULE_PATTERN = ENTRY_FILE_PATTERN.replace(
        new RegExp(`${QUOTE}([^${QUOTE}]*)${EXTENSION}${QUOTE}`), `${QUOTE}$1${QUOTE}`);

    gulp.src([OUTPUT_DIR , ENTRY_FILE].join(path.sep))
        .pipe(requirejsOptimize())
        .pipe(replace(ENTRY_FILE_PATTERN, ENTRY_MODULE_PATTERN))
        .pipe(gulp.dest(OUTPUT_DIR))
})

gulp.task('serve', () => {
    gulp.src('.')
    .pipe(webserver({
        port: SERVER_PORT,
        fallback: INDEX_FILE,
        livereload: false
    }))
})

gulp.task('clean', () => {
    gulp.src(OUTPUT_DIR)
    .pipe(clean())
})
