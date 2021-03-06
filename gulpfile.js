var gulp = require('gulp'), // gulp
	sass = require('gulp-sass'), // sass
	autoprefixer = require('gulp-autoprefixer'), // 브라우저 새로고침
	fileinclude = require('gulp-file-include'), // html
	concat = require('gulp-concat'), // 합치기
	jshint = require('gulp-jshint'), // 코드문법 검사
	// wait = require('gulp-wait'), // 딜레이
	image = require('gulp-image'), // 이미지 압축
	uglify = require('gulp-uglify'), // js 최적화
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'), // scss코드 실제 경로(개발자모드)를 추적
	babel = require('gulp-babel');

var pipeline = require('readable-stream').pipeline; // 다중 pipe 한줄사용

browserSync = require('browser-sync').create();

var paths = {
	src: './src',
	dist: './dist',

	DistCss: './dist/css',
	DistJs: './dist/js',
	DistFonts: './dist/fonts',
	DistImg: './dist/img',
	lib: './dist/lib',
	DistVendor: './dist/plugin',

	views: './src/views',
	scss: './src/scss',
	js: './src/js',
	fonts: './src/fonts',
	img: './src/img',
	vendor: './src/plugin',

	node: './node_modules'
};

// jQuery 설치
gulp.task('copy_assets', () => {



	return pipeline(
		gulp.src(paths.node + '/jquery/**/*'),
		gulp.dest(paths.lib + '/jquery'),

		gulp.src(paths.node + '/font-awesome/fonts/*.{ttf,woff,woff2,eot,svg}'),
		gulp.dest(paths.DistFonts),
	);
});

// html
gulp.task('htmlinclude', () => {
	return pipeline(
		gulp.src([paths.views + '/*.html']),
		fileinclude({
			prefix: '@@',
			basepath: '@file'
		}),
		gulp.dest(paths.dist)
	);
});


// json
gulp.task('jsoninclude', () => {
	return pipeline(
		gulp.src([paths.views + '/*.json']),
		fileinclude({
			prefix: '@@',
			basepath: '@file'
		}),
		gulp.dest(paths.dist)
	);
});

// sass
gulp.task('sass', () => {
	return pipeline(
		gulp.src(paths.scss + '/*.scss'),
		sourcemaps.init(),
		sass({
			outputStyle: 'expanded',
			indentType: 'tab',
			indentWidth: 1
		}).on('error', sass.logError), //SCSS 작성시 watch 가 멈추지 않도록 logError 를 설정
		autoprefixer({
			browsers: ['last 10 versions']
		}),
		sourcemaps.write('.'),
		gulp.dest(paths.DistCss)
	);
});

// 모든 플러그인 css
gulp.task('pluginCss', () => {
	return pipeline(
		gulp.src([
			//node plugin
			paths.node + '/bootstrap/dist/css/bootstrap.css',
			paths.node + '/font-awesome/css/font-awesome.css',
			paths.node + '/@fancyapps/fancybox/dist/jquery.fancybox.css',
			//plugin
			paths.vendor + '/*.css',
			paths.vendor + '/*/*.css',
			paths.vendor + '/*/*/*.css'
		]),
		concat('vendor.css'),
		rename('vendor.min.css'),
		gulp.dest(paths.DistVendor)
	);
});

// js 문법검사
gulp.task('jshint', () => {
	return pipeline(
		gulp.src(paths.js + '/*.js'),
		jshint({
			esversion: 6
		}),
		jshint.reporter('default')
	);
});

// js
gulp.task('js', () => {
	return pipeline(
		gulp.src(paths.js + '/*.js'),
		sourcemaps.init(),
		babel({
			presets: ['es2015'] // preset 'es2015'javascript5로
		}),
		sourcemaps.write('./', { sourceRoot: '../src' }),
		gulp.dest(paths.DistJs)
	);
});

// 모든 플러그인 js
gulp.task('pluginJs', () => {
	return pipeline(
		gulp.src([
			//node plugin
			paths.node + '/popper.js/dist/umd/popper.js',
			paths.node + '/bootstrap/dist/js/bootstrap.js',
			paths.node + '/@fancyapps/fancybox/dist/jquery.fancybox.js',

			//plugin
			paths.vendor + '/*.js',
			paths.vendor + '/*/*.js',
			paths.vendor + '/*/*/*.js'
		]),
		concat('vendor.js'),
		uglify({
			mangle: false,
			preserveComments: 'all'
			// 'all', 또는 'some' 압축과정에서 주석이 지워지지 않고 보존 
			// 'all' 값일 경우에는 모든 주석이 보존되고 'some' 값일 때는 느낌표(!)가 붙은 주석만 보존
		}),
		rename('vendor.min.js'),
		gulp.dest(paths.DistVendor)
	);
});

//images
gulp.task('images', () => {
	return pipeline(
		gulp.src([
			paths.img + '/*',
			paths.img + '/*/*'
		]),
		image({
			pngquant: true,
			optipng: false,
			zopflipng: true,
			jpegRecompress: false,
			mozjpeg: true,
			guetzli: false,
			gifsicle: true,
			svgo: true,
			concurrent: 10,
			quiet: true // defaults to false
		}),
		gulp.dest(paths.DistImg)
	);
});

//fonts
gulp.task('font', () => {
	return pipeline(
		gulp.src([
			paths.fonts + '/*',
			paths.fonts + '/*.{ttf,woff,woff2,eot,svg,TTF}',
			paths.fonts + '/*/*.{ttf,woff,woff2,eot,svg,TTF}'
		]),
		gulp.dest(paths.DistFonts)
	);
});


/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var tasks = ['copy_assets', 'htmlinclude', 'jsoninclude' , 'jshint', 'js', 'sass', 'images', 'font', 'pluginCss', 'pluginJs'];

var main = () => {

	// Run server
	browserSync.init({
		server: "./dist"
	});

	// Run registerd tasks
	gulp.watch([
		paths.views + '/*.html',
		paths.views + '/*/*.html',
		paths.views + '/*/*/*.html'
	], {
		cwd: './'
	}, ['htmlinclude']);

	gulp.watch([
		paths.views + '/*.json',
		paths.views + '/*/*.json',
		paths.views + '/*/*/*.json'
	], {
		cwd: './'
	}, ['jsoninclude']);

	//watch scss
	gulp.watch([
		paths.scss + '/*.scss',
		paths.scss + '/*/*.scss',
		paths.scss + '/*/*/*.scss'
	], {
		cwd: './'
	}, ['sass']);

	//watch js
	gulp.watch([paths.js + '/*.js'], {
		cwd: './'
	}, ['js']);

	// Hot reload
	gulp.watch([
		paths.dist + '/*.html',
		paths.DistCss + '/*.css',
		paths.DistJs + '/*.js'
	]).on('change', browserSync.reload);

};

gulp.task('default', tasks, main);
gulp.task('watch', tasks, main);