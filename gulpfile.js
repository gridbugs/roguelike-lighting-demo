const gulp = require('gulp')
const traceur = require('gulp-traceur')
const plumber = require('gulp-plumber')
const webserver = require('gulp-webserver')
const clean = require('gulp-clean')
const argv = require('yargs').argv

const DEFAULT_SERVER_PORT = 8000

const OUTPUT_DIR = 'build'
const SOURCE_GLOB = 'src/**/*.js'
const SERVER_PORT = argv.port === undefined ? DEFAULT_SERVER_PORT : parseInt(argv.port)

const MODERN_TRACEUR_OPTS = {
    asyncFunctions: true,
    modules: 'amd',
    classes: 'parse',
    generators: 'parse',
    arrowFunctions: 'parse',
    blockBinding: 'parse',
    forOf: 'parse',
    templateLiterals: 'parse',
    arrayComprehension: true,
    sourceMaps: 'inline'
}

const LEGACY_TRACEUR_OPTS = {
    asyncFunctions: true,
    modules: 'amd',
    classes: true,
    generators: 'parse',
    arrowFunctions: true,
    blockBinding: true,
    forOf: true,
    templateLiterals: 'parse',
    arrayComprehension: true,
    sourceMaps: 'inline',
    symbols: true
}

var TRACEUR_OPTS = MODERN_TRACEUR_OPTS;

if (argv.legacy !== undefined) {
    TRACEUR_OPTS = LEGACY_TRACEUR_OPTS;
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

gulp.task('serve', () => {
    gulp.src('.')
    .pipe(webserver({
        port: SERVER_PORT,
        fallback: 'index.html',
        livereload: false
    }))
})

gulp.task('clean', () => {
    gulp.src(OUTPUT_DIR)
    .pipe(clean())
})
