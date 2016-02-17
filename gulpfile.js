var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var del = require('del');
var watchify = require('watchify');

var gutil = require('gulp-util');
var useref = require('gulp-useref');
var gcache = require('gulp-cache');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

function buildScript(file, watch) {

    var props = {
        entries: ['./src/' + file],
        debug : true,
        transform:  []
    };

    // watchify() if watch requested, otherwise run browserify() once
    var bundler = watch ? watchify(browserify(props)) : browserify(props);

    function rebundle() {
        var stream = bundler.bundle();
        return stream
            .on('error', function(e) {
                gutil.log(e);
            })
            .pipe(source(file))
            .pipe(gulp.dest('./dist/'));
    }

    // listen for an update and run rebundle
    bundler.on('update', function() {
        rebundle();
        gutil.log('Rebundle...');
    });

    // run it once the first time buildScript is called
    return rebundle();
}


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('sass', function() {
    ;
});

gulp.task('css', function() {
    return gulp.src('./src/css/*')
        .pipe(gulp.dest('./dist/css/'));
})

gulp.task('lib', function() {
    return gulp.src('./src/lib/*js')
        .pipe(gulp.dest('./dist/lib/'));
})

// styles
gulp.task('styles', ['css', 'sass'], function() {
return gulp.src('./src/css/*')
    .pipe(gulp.dest('./dist/css/'));
});

// HTML
gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulp.dest('./dist'))
    ;
});

// Clean
gulp.task('clean', function() {
    gcache.clearAll();
    del.sync(['./dist/css', './dist/js', './dist/lib', './dist/index.html']);
});

gulp.task('js', function() {
    return buildScript('./js/app.js', false);
});

gulp.task('go', ['clean', 'js', 'html', 'lib', 'css'], function() {

    //browserSync({
    //    notify: false,
    //    logPrefix: 'BS',
    //    server: ['./dist']
    //});


});


gulp.task('watch', ['html', 'css', 'js', 'lib'], function() {

    browserSync({
        notify: false,
        logPrefix: 'BS',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['./dist']
    });

    var reload = browserSync.reload;
    gulp.watch('src/js/*js', ['js'], reload);

    // Watch .html files
    gulp.watch('src/*.html', ['html'], reload);

    gulp.watch(['src/styles/**/*.scss', 'src/css/*.css'],
        ['styles', 'js', reload]);

});

gulp.task('default', ['html', 'browser-sync']);