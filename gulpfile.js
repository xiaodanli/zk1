var gulp = require('gulp');

var url = require('url');

var fs = require('fs');

var path = require('path');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var minCss = require('gulp-clean-css');

var uglify = require('gulp-uglify');

var babel = require('gulp-babel'); //babel-reset-es2015

var rev = require('gulp-rev'); //生成MD5后缀的

var collector = require('gulp-rev-collector'); //替换路径

var clean = require('gulp-clean'); //删除文件

var swiperData = require('./mock/swiper.json');

var listData = require('./mock/list.json');

//起服务
gulp.task('server', function() {
    return serverFun('src')
})

function serverFun(serverPath) {
    return gulp.src(serverPath)
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
                    res.end(fs.readFileSync(path.join(__dirname, serverPath, pathname)))
                }
            }
        }))
}

//css

function cssTask(cssPath) {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        .pipe(minCss())

    .pipe(gulp.dest(cssPath))
}

//css任务
gulp.task('devCss', function() {
        return cssTask('./src/css')
    })
    //watch

gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series(cssTask))
})

//dev

gulp.task('dev', gulp.series(gulp.parallel('devCss'), 'server', 'watch'))

// --------------------------------线上环境-------------------------------------
gulp.task('clean', function() {
    return gulp.src('build')
        .pipe(clean())
})

gulp.task('copyHtml', function() {
    return gulp.src(['./rev/*.json', './src/**/*.html'])
        .pipe(collector({
            replaceReved: true
        }))
        .pipe(gulp.dest('build'))
})

function uglifyTask() {
    return gulp.src('./src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('build/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev'))
}

gulp.task(uglifyTask)

gulp.task('buildCss', function() {
    return cssTask('./build/css')
})

gulp.task('copyJs', function() {
    return gulp.src('./src/js/libs/*.js')
        .pipe(gulp.dest('build/js/libs'))
})

gulp.task('copyCss', function() {
    return gulp.src('./src/css/swiper-3.4.2.min.css')
        .pipe(gulp.dest('./build/css'))
})

//线上环境

gulp.task('build', gulp.series('clean', uglifyTask, gulp.parallel('copyHtml', 'buildCss', 'copyJs', 'copyCss')))

gulp.task('buildServer', function() {
    return serverFun('build')
})