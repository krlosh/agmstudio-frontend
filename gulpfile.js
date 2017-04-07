var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var path = require('path');
var processhtml = require('gulp-processhtml');
var gulpif = require('gulp-if');
var beautify = require('gulp-beautify');
var connect = require('gulp-connect');

var runSequence = require('run-sequence');
var config ={
  folders :{
    dist : 'dist',
    assets:'assets'
  },
  environment:'dev',
  distMode: false,
  plugins : {
    js : [
    'bower_components/html5shiv/dist/html5shiv.min.js',
    'bower_components/respond/dest/respond.min.js'
    ],
    jsConcat : [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    ],
    css : [
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'bower_components/font-awesome/css/font-awesome.min.css',
    ],
    fonts : [
    'bower_components/bootstrap/dist/fonts/*',
    'bower_components/font-awesome/fonts/*'
    ],
    img : [
    ]
  }
};

var paths ={
  dist: path.join(config.folders.dist),
  assets:path.join(config.folders.dist,
      config.folders.assets),
  html:path.join(config.folders.dist),
  js:path.join(config.folders.dist,
      config.folders.assets,'js'),
  fonts:path.join(config.folders.dist,
      config.folders.assets,'fonts'),
  css:path.join(config.folders.dist,
      config.folders.assets,'css'),
  img:path.join(config.folders.dist,
      config.folders.assets,'img'),
};

var targets = {
  dist: {
    environment:'dist',
    data:{
      assets: config.folders.assets
    }
  },
  dev:{
    environment:'dev',
    data:{
      assets: config.folders.assets
    }
  }
};

gulp.task('html',/*[tareas dependientes]*/function(){
  //Codigo de la tarea
  gulp.src(['src/html/**/*.html','!src/html/layout/**/*'])
    .pipe(processhtml({
        recursive:true,
        process:true,
        strip:true,
        environment:targets[config.environment].environment,
        data:targets[config.environment].data
    }
    ))
    .pipe(gulp.dest(path.join(paths.html)))
    .pipe(connect.reload());
});

gulp.task('js', function(){
  gulp.src('src/js/**/*.js')
      .pipe(concat('app.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(paths.js))
      .pipe(connect.reload());
});



gulp.task('plugins', function() {
  gulp.src(config.plugins.jsConcat)
      .pipe(gulpif(config.distMode,concat('plugins.min.js', {})))
      .pipe(gulpif(config.distMode,uglify(),beautify()))
      .pipe(gulp.dest(paths.js));

  gulp.src(config.plugins.js)
      .pipe(gulp.dest(paths.js));

  gulp.src(config.plugins.css)
    .pipe(gulpif(config.distMode,concat('plugins.min.css', {})))
    .pipe(gulp.dest(paths.css));

  gulp.src(config.plugins.fonts)
    .pipe(gulp.dest(paths.fonts));

  gulp.src(config.plugins.img)
    .pipe(gulp.dest(paths.img));
});

gulp.task('clean',function(){
  return del([paths.html]);
});

gulp.task('watch',function(){
  gulp.watch(['src/html/**/*'],['html']);
  gulp.watch(['src/js/**/*'],['js']);
});

gulp.task('connect',function(){
  connect.server({
    root:config.folders.dist,
    port:8080,
    livereload:true
  });
});

gulp.task('default',function(){
  runSequence(
              ['connect','watch']
            );
});

gulp.task('compile',function(){
  runSequence(
      'clean',
      ['plugins','html','js']
      );
});

/** Trabajo diario*/
gulp.task('work',function(){
    runSequence(
      'compile',
      'default'
    );
});

/* Generamos distribucion*/
gulp.task('dist',function(){
  config.distMode= true;
  config.environment = 'dist';
  runSequence('compile');
});
