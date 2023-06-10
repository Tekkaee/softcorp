import pkg from 'gulp'
import imagemin from "gulp-imagemin";
import * as dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import gulpSass from 'gulp-sass'
import browserSync from "browser-sync";
import htmlmin from 'gulp-htmlmin';
import fileinclude from 'gulp-file-include';
import concat from 'gulp-concat';
const sass = gulpSass(dartSass)

const { series, watch, src, dest } = pkg

const STYLES_PATH_WATCH = './src/scss/**/*.scss'
const STYLES_PATH_SRC = './src/scss/*.scss'
const STYLES_PATH_OUTPUT = './dist/css'

const IMAGES_PATH_SRC = './src/assets/images/**/*'
const IMAGES_PATH_OUTPUT = './dist/images'

const HTML_PATH_SRC = './src/**/*.html'
const HTML_PATH_OUTPUT_SRC = './src/index.html'
const OUTPUT_PATH = './dist'

function images() {
    return src(IMAGES_PATH_SRC)
        .pipe(imagemin())
        .pipe(dest(IMAGES_PATH_OUTPUT));
}

function styles() {
    return src(STYLES_PATH_SRC)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest(STYLES_PATH_OUTPUT));
}

function devServer() {
    browserSync.init({
        logPrefix: 'softcorp',
        server: {
            baseDir: OUTPUT_PATH,
        },
    });

    watch(STYLES_PATH_WATCH, series(styles, Reload));
    watch(IMAGES_PATH_SRC, series(images, Reload));
    watch(HTML_PATH_SRC, series(styles, staticFiles, scripts, Reload));
    watch('./src/js/**/*.js', series(scripts, Reload));
}

function scripts() {
    return src('./src/js/**/*.js')
        .pipe(concat('all.js'))
        .pipe(dest('./dist/js'));
}

function Reload(done) {
    browserSync.reload();
    done();
}

function staticFiles() {
    return src(HTML_PATH_OUTPUT_SRC)
        .on('error', sass.logError)
        .pipe(
            fileinclude({
                filters: {
                    prefix: '@@',
                    basepath: '@file',
                },
            })
        )
        .pipe(
            htmlmin({
                collapseWhitespace: true,
            })
        )
        .pipe(dest(OUTPUT_PATH));
}

const dev = series(styles, images, scripts, staticFiles, devServer);
dev.displayName = 'dev';
export {dev};