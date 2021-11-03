//let replace = require('gulp-replace'); //.pipe(replace('bar', 'foo'))
let { src, dest } = require("gulp");
let fs = require('fs');
let gulp = require("gulp");
let browsersync = require("browser-sync").create();
let autoprefixer = require("gulp-autoprefixer");
let scss = require('gulp-sass')(require('sass'));
let group_media = require("gulp-group-css-media-queries");
let plumber = require("gulp-plumber");
let del = require("del");
let imagemin = require("gulp-imagemin");
let uglify = require("gulp-uglify-es").default;
let rename = require("gulp-rename");
let fileinclude = require("gulp-file-include");
let clean_css = require("gulp-clean-css");
let newer = require('gulp-newer');

let version = require('gulp-version-number');

let webp = require('imagemin-webp');
let webpcss = require("gulp-webpcss");
let webphtml = require('gulp-webp-html');

let fonter = require('gulp-fonter');

let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');

let project_name = require("path").basename(__dirname);
let src_folder = "#src";

let path = {
	build: {
		html: project_name + "/",
		js: project_name + "/js/",
		css: project_name + "/css/",
		images: project_name + "/img/",
		fonts: project_name + "/fonts/",
		json: project_name + "/json/"
	},
	src: {
		favicon: src_folder + "/img/favicon.{jpg,png,svg,gif,ico,webp}",
		html: [src_folder + "/**/*.html", "!" + src_folder + "/_*.html"],
		js: [src_folder + "/js/app.js", src_folder + "/js/vendors.js"],
		css: src_folder + "/scss/style.scss",
		images: [src_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}", "!**/favicon.*"],
		fonts: src_folder + "/fonts/*.ttf",
		json: src_folder + "/json/**/*.*"
	},
	watch: {
		html: src_folder + "/**/*.html",
		js: src_folder + "/**/*.js",
		css: src_folder + "/scss/**/*.scss",
		images: src_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
		json: src_folder + "/json/**/*.*"
	},
	clean: "./" + project_name + "/"
};

// Пишем папки которые нужно копировать через запятую
let foldersArray = ['videos']; // 'videos', 'files' ...
function copyFolders() {
	foldersArray.forEach(folderItem => {
		src(src_folder + "/" + folderItem + "/**/*.*", {})
			.pipe(newer(project_name + "/" + folderItem + "/"))
			.pipe(dest(project_name + "/" + folderItem + "/"));
	});
	return src(path.src.html).pipe(browsersync.stream());
}
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: "./" + project_name + "/"
		},
		notify: false,
		port: 3000,
	});
}
function html() {
	return src(path.src.html, {})
		.pipe(fileinclude())
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}
function css() {
	return src(path.src.css, {})
		.pipe(
			scss({ outputStyle: 'expanded' }).on('error', scss.logError)
		)
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}
function json() {
	return src(path.src.json, {})
		.pipe(dest(path.build.json))
		.pipe(browsersync.stream());
}
function js() {
	return src(path.src.js, {})
		.pipe(fileinclude())
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(
			rename({
				suffix: ".min",
				extname: ".js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}
function images() {
	return src(path.src.images)
		.pipe(newer(path.build.images))
		.pipe(dest(path.build.images))
}
function favicon() {
	return src(path.src.favicon)
		.pipe(plumber())
		.pipe(
			rename({
				extname: ".ico"
			})
		)
		.pipe(dest(path.build.html))
}
function fonts_otf() {
	return src('./' + src_folder + '/fonts/*.otf')
		.pipe(plumber())
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(gulp.dest('./' + src_folder + '/fonts/'));
}
function fonts() {
	src(path.src.fonts)
		.pipe(plumber())
		.pipe(ttf2woff())
		.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
		.pipe(browsersync.stream());
}
function fontstyle() {
	let file_content = fs.readFileSync(src_folder + '/scss/fonts.scss');
	if (file_content == '') {
		fs.writeFile(src_folder + '/scss/fonts.scss', '', cb);
		fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(src_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
	return src(path.src.html).pipe(browsersync.stream());
}
function infofile() {

}
function cb() { }

function clean() {
	return del(path.clean);
}
function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.json], json);
	gulp.watch([path.watch.images], images);
}
function cssBuild() {
	return src(path.src.css, {})
		.pipe(plumber())
		.pipe(
			scss({ outputStyle: 'expanded' }).on('error', scss.logError)
		)
		.pipe(group_media())
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 versions"],
				cascade: true
			})
		)
		.pipe(webpcss(
			{
				webpClass: "._webp",
				noWebpClass: "._no-webp"
			}
		))
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}
function jsBuild() {
	let appPath = path.build.js + 'app.min.js';
	let vendorsPath = path.build.js + 'vendors.min.js';
	del(appPath);
	del(vendorsPath);
	return src(path.src.js, {})
		.pipe(plumber())
		.pipe(fileinclude())
		.pipe(gulp.dest(path.build.js))
		.pipe(uglify(/* options */))
		.on('error', function (err) { console.log(err.toString()); this.emit('end'); })
		.pipe(
			rename({
				suffix: ".min",
				extname: ".js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}
function imagesBuild() {
	return src(path.src.images)
		//.pipe(newer(path.build.images))
		.pipe(
			imagemin([
				webp({
					quality: 85
				})
			])
		)
		.pipe(
			rename({
				extname: ".webp"
			})
		)
		.pipe(dest(path.build.images))
		.pipe(src(path.src.images))
		//.pipe(newer(path.build.images))
		.pipe(
			imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				interlaced: true,
				optimizationLevel: 3 // 0 to 7
			})
		)
		.pipe(dest(path.build.images))
}
function htmlBuild() {
	return src(path.src.html, {})
		.pipe(plumber())
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(version({
			'value': '%DT%',
			'replaces': [
				'#{VERSION_REPlACE}#',
				[/#{VERSION_REPlACE}#/g, '%TS%']
			],
			'append': {
				'key': '_v',
				'cover': 0,
				'to': [
					'css',
					['image', '%TS%'],
					{
						'type': 'js',
						'attr': ['src', 'custom-src'], // String or Array, undefined this will use default. css: "href", js: ...
						'key': '_v',
						'value': '%DT%',
						'cover': 1,
						'files': ['app.min.js', 'vendors.min.js'] // Array [{String|Regex}] of explicit files to append to
					}
				]
			},
			'output': {
				'file': 'version.json'
			}
		}))
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream());
}
let fontsBuild = gulp.series(fonts_otf, fonts, fontstyle);
let buildDev = gulp.series(clean, gulp.parallel(fontsBuild, copyFolders, json, html, css, js, favicon, images));
let watch = gulp.series(buildDev, gulp.parallel(watchFiles, browserSync));
let build = gulp.parallel(htmlBuild, cssBuild, jsBuild, imagesBuild);

exports.copy = copyFolders;
exports.fonts = fontsBuild;
exports.build = build;
exports.watch = watch;
exports.default = watch;