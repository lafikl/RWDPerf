var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var gulp   = require('gulp');

gulp.task('default', function() {
	return gulp.src(['**/*.js', 
		'!./node_modules/**',
		'!**/*.min.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});