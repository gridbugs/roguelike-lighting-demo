const gulp = require('gulp')
const traceur = require('gulp-traceur')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const plumber = require('gulp-plumber')
const webserver = require('gulp-webserver')
const argv = require('yargs').argv;

const DEFAULT_SERVER_PORT = 8000;

const OUTPUT_DIR = 'build'
const OUTPUT_FILE = 'app.js'
const SOURCE_GLOB = 'src/**/*.js'
const SERVER_PORT = argv.port == undefined ? DEFAULT_SERVER_PORT : parseInt(argv.port);

const TRACEUR_OPTS = {
    asyncFunctions: true,
    modules: 'inline',
    classes: 'parse',
    generators: 'parse',
    arrowFunctions: 'parse',
    blockBinding: 'parse',
    forOf: 'parse',
    templateLiterals: 'parse'
}

gulp.task('default',['stream', 'serve'])

gulp.task('stream', () => {
    gulp.watch(SOURCE_GLOB, ['build'])
})

gulp.task('build', () => {
    gulp.src(SOURCE_GLOB)
    .pipe(plumber({
        errorHandler: function (err) {
            console.log(err.toString());
            this.emit('end');
        }
    }))
    .pipe(sourcemaps.init())
    .pipe(traceur(TRACEUR_OPTS))
    .pipe(concat(OUTPUT_FILE))
    .pipe(sourcemaps.write())
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
