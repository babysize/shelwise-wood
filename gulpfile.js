var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var frontnote = require('gulp-frontnote');
var cleanCss = require('gulp-clean-css');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jade = require('gulp-jade');
var minifyHtml = require('gulp-minify-html');
var imageMin = require('gulp-imagemin');
var cache = require('gulp-cache');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
gulp.task('sass',function(){
    gulp.src(['css/src/**/*.scss'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(frontnote({
            out: 'docs/css'
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(csslint())
        .pipe(csslint.formatter())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('css/dist'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css/dist'))
        .pipe(reload({stream:true}))
});
gulp.task('babel',function(){
    gulp.src(['js/src/**/*.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(jshint())
          .pipe(jshint.reporter('default'))
          .pipe(browserify())
        .pipe(gulp.dest('js/dist'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js/dist'))
        .pipe(reload({stream:true}))
});
gulp.task('jade',function(){
    gulp.src(['html/index.jade'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(jade())
        .pipe(minifyHtml())
        .pipe(gulp.dest('./'))
        .pipe(reload())
});
gulp.task('image',function(){
    gulp.src(['images/src/**/*'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(cache(imageMin()))
        .pipe(gulp.dest('images/dist'))
        .pipe(reload())
});
gulp.task('iconfont', function(){
    gulp.src(['fonts/src/**/*.svg'])
        .pipe(iconfont({
            fontName: 'myicon'
        }))
        .on('codepoints', function(codepoints) {
            var options = {
                glyphs: codepoints,
                fontName: 'myicon',
                fontFamily: 'myicon',
                className: 'icon',
                timestamp: Date.now()
            };
            gulp.src('fonts/src/template/**/*.css')
                .pipe(consolidate('lodash', options))
                .pipe(rename({
                    basename:'myicon'
                }))
                .pipe(gulp.dest('fonts/dist/template'));
            gulp.src('fonts/src/template/**/*.html')
                .pipe(consolidate('lodash', options))
                .pipe(rename({
                    basename:'myicon'
                }))
                .pipe(gulp.dest('fonts/dist/template'));
        })
        .pipe(gulp.dest('fonts/dist'))
        .pipe(reload())
});
gulp.task('default',function(){
   
    browserSync.init({
        server: "./"
    });

    const wrap = (str) => [str, 'jade'];
    let do_shit = ['babel', 'sass', 'jade', 'image', 'iconfont']

    gulp.watch('js/src/**/*.js',wrap('babel'));
    gulp.watch('css/src/**/*.scss',wrap('sass'));
    gulp.watch('html/**/*.jade', 'jade');
    gulp.watch('images/src/**/*',wrap('image'));
    gulp.watch('fonts/src/**/*.svg',wrap('iconfont'));

});
