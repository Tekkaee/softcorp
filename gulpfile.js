import pkg from 'gulp'
import imagemin from "gulp-imagemin";
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import browserSync from "browser-sync";
import htmlmin from 'gulp-htmlmin';
import fileinclude from 'gulp-file-include';
import concat from 'gulp-concat';
import clean from 'gulp-clean';
import cleanCSS from 'gulp-clean-css';
import webp from 'gulp-webp';
import autoprefix from 'gulp-autoprefixer';
import shell from "gulp-shell";
import rename from 'gulp-rename';
const sass = gulpSass(dartSass)

const { series, watch, src, dest } = pkg

const STYLES_PATH_WATCH = './src/scss/**/*.scss'
const STYLES_PATH_SRC = './src/scss/*.scss'
const STYLES_PATH_OUTPUT = './dist/css'

const IMAGES_PATH_SRC = './src/assets/images/*'
const IMAGES_PATH_OUTPUT = './dist/assets/images'

const HTML_PATH_SRC = './src/**/*.html'
const HTML_PATH_OUTPUT_SRC = './src/index.html'
const OUTPUT_PATH = './dist'

const FONTS_PATH_SRC = './src/assets/fonts/**/*.woff2'
const FONTS_PATH_OUTPUT = './dist/assets/fonts'

function images() {
    return src(IMAGES_PATH_SRC)
        .pipe(imagemin())
        .pipe(dest(IMAGES_PATH_OUTPUT))
        .pipe(webp())
        .pipe(dest(IMAGES_PATH_OUTPUT));
}


function fonts() {
    return src(FONTS_PATH_SRC)
        .pipe(dest(FONTS_PATH_OUTPUT));
}

function styles() {
    return src(STYLES_PATH_SRC)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefix({
            browsers: ["last 2 versions"]
        }))
        .pipe(cleanCSS({
            level:{
                1: {
                    all: false
                },
                2: {
                    all: false,
                    removeDuplicateRules: true,
                    removeEmpty: true,
                    mergeMedia: true,
                    reduceNonAdjacent: true,
                    mergeAdjacent: true
                }
            }
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest(STYLES_PATH_OUTPUT))
}

function devServer() {
    browserSync.init({
        logPrefix: 'softcorp',
        server: {
            baseDir: OUTPUT_PATH,
        },
    });

    watch(STYLES_PATH_WATCH, series(cleanStyles, styles, reloadPage));
    watch(FONTS_PATH_SRC, series(cleanAssets, fonts, reloadPage));
    watch(IMAGES_PATH_SRC, series(cleanAssets, images, reloadPage));
    watch(HTML_PATH_SRC, series(cleanHtml, staticFiles, scripts, reloadPage));
    watch('./src/js/**/*.js', series(cleanJs, scripts, reloadPage));
}

function scripts() {
    return src('./src/js/**/*.js')
        .pipe(concat('bundle.js'))
        .pipe(dest('./dist/js'));
}

function reloadPage(done) {
    browserSync.reload();
    done();
}

function createDir() {
    return src('*', { read: false })
        .pipe(shell(['mkdir -p dist']))
}

function cleanHtml() {
    return src('./dist/*.html').pipe(clean({read: false}))
}

function cleanStyles() {
    return src('./dist/css').pipe(clean({read: false}))
}

function cleanJs() {
    return src('./dist/js').pipe(clean({read: false}))
}

function cleanAssets() {
    return src('./dist/assets').pipe(clean({read: false}))
}

function cleanAll() {
    return src('./dist').pipe(clean({read: false}))
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

const dev = series(createDir, cleanAll, styles, images, fonts, scripts, staticFiles, devServer);
dev.displayName = 'dev';
export {dev};

const prod = series(createDir, cleanAll, styles, images, fonts, scripts, staticFiles);
prod.displayName = 'prod';
export {prod};