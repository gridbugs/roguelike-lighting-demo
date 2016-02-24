const gulp = require('gulp')
const traceur = require('gulp-traceur')
const plumber = require('gulp-plumber')
const webserver = require('gulp-webserver')
const clean = require('gulp-clean')
const argv = require('yargs').argv

const DEFAULT_SERVER_PORT = 8000

const OUTPUT_DIR = 'build'
const OUTPUT_FILE = 'app.js'
const SOURCE_GLOB = 'src/**/*.js'
const SERVER_PORT = argv.port == undefined ? DEFAULT_SERVER_PORT : parseInt(argv.port)

const TRACEUR_OPTS = {
    asyncFunctions: true,
    modules: 'amd',
    classes: true,
    generators: 'parse',
    arrowFunctions: true,
    blockBinding: 'parse',
    forOf: 'parse',
    templateLiterals: 'parse',
    arrayComprehension: true,
    sourceMaps: 'inline'
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
    gulp.src('build')
    .pipe(clean())
})
