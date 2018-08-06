var gulp = require('gulp');

console.log(gulp);

var url = require('url');

var fs = require('fs');

var path = require('path');

var server = require('gulp-webserver');

gulp.task('server', function() {
    gulp.src('src')
        .pipe(server({
            port: 9090,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    return false
                }

                pathname = pathname === '/' ? '/index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
            }
        }))
})