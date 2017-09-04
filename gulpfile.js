const gulp = require( 'gulp' )
const ts = require( 'gulp-typescript' )
const tsProject = ts.createProject( 'tsconfig.json' )

gulp.task( 'ts', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest( 'dist' ))
})

gulp.task( 'default', [ 'ts' ], () => {
    gulp.watch( 'src/*.*', [ 'ts' ] )
} )