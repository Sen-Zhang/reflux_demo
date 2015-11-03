var gulp    = require('gulp'),
    connect = require('gulp-connect'),
    open    = require('gulp-open'),
    watch   = require('gulp-watch');

var options = {
  port: 8088
};

gulp.task('connect', function () {
  connect.server({
    port: options.port,
    livereload: true
  });
});

gulp.task('open', function () {
  gulp.src(__filename)
    .pipe(open({uri: ('http://localhost:' + options.port + '/')}));
});

gulp.task('watch', function () {
});

gulp.task('default', ['connect', 'open', 'watch']);