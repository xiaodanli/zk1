var gulp = require('gulp');

var url = require('url');

var fs = require('fs');

var path = require('path');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var minCss = require('gulp-clean-css');

var uglify = require('gulp-uglify');

var swiperData = require('./mock/swiper.json');

var listData = require('./mock/list.json');

//起服务
gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 9090,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    return false
                }
                if (pathname === '/api/swiper') {
                    res.end(JSON.stringify({ code: 1, data: swiperData }));
                } else if (pathname === '/api/list') {
                    res.end(JSON.stringify({ code: 1, data: listData }))
                } else {
                    pathname = pathname === '/' ? '/index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})

//css

function cssTask() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        .pipe(minCss())
        .pipe(gulp.dest('./src/css'))
}

//css任务
gulp.task(cssTask)

function uglifyTask() {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
}

gulp.task(uglifyTask)

//watch

gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series(cssTask))
})

//dev

gulp.task('dev', gulp.series(gulp.parallel(cssTask, uglifyTask), 'server', 'watch'))