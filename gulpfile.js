var gulp = require('gulp');

gulp.task('html',/*[tareas dependientes]*/function(){
  //Codigo de la tarea
  gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist/'));
});
