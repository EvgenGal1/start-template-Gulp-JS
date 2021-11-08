// //let replace = require('gulp-replace'); //.pipe(replace('bar', 'foo'))
// Общие Переменные
let fs = require("fs");
// перем. src и dest к котор присвоен gulp. помощь в напис сценария
let { src, dest } = require("gulp");
// перем. самого Gulp для отдельных задач
let gulp = require("gulp");

// обновл. браузер
let browsersync = require("browser-sync").create();
// сборщик кусков кода
let fileinclude = require("gulp-file-include");
// удаление п/ф
let del = require("del");

// компилятор scss
let scss = require("gulp-sass")(require("sass"));
// сжат css
let clean_css = require("gulp-clean-css");
// переименовка css в + .min.
let rename = require("gulp-rename");
// добав prefix к различн брауз
let autoprefixer = require("gulp-autoprefixer");
// групп media запросы в конце ф
let group_media = require("gulp-group-css-media-queries");
// сжат js(пропис с default)
let uglify = require("gulp-uglify-es").default;
// сжатие img
let imagemin = require("gulp-imagemin");

// let plumber = require("gulp-plumber");
// let newer = require('gulp-newer');

// let version = require('gulp-version-number');

// конвертер img в webp
let webp = require("imagemin-webp");
// интегр. webp в html
let webphtml = require("gulp-webp-html");
// интегр. webp в css
let webpcss = require("gulp-webpcss");

// компиляция шрифтов ttf в woff/woff2
let ttf2woff = require("gulp-ttf2woff");
let ttf2woff2 = require("gulp-ttf2woff2");
// конвертирует др шрифты в woff/woff2
// let fonter = require('gulp-fonter');

// перем. назв. папки ПРОД(назв из головной папки) и папки ИСХОДников
let project_name = require("path").basename(__dirname);
// времено Стар без пути
// let project_name = "dist";
let src_folder = "#src";

// перем. с путями к п/ф, в объ-ах путей, из объ path
let path = {
  // пути ПРОД
  build: {
    html: project_name + "/",
    js: project_name + "/js/",
    css: project_name + "/css/",
    images: project_name + "/img/",
    fonts: project_name + "/fonts/",
    json: project_name + "/json/",
  },
  // пути ИСХОД
  src: {
    favicon: src_folder + "/img/favicon.{jpg,png,svg,gif,ico,webp}",
    // во всех подпапках берём файлы .html, кроме начин. на _ (нижнее подчёркивание)
    html: [src_folder + "/**/*.html", "!" + src_folder + "/_*.html"],
    js: [src_folder + "/js/app.js", src_folder + "/js/vendors.js"],
    css: src_folder + "/scss/style.scss",
    // во всех подпапках img берём файлы с опред. расширен., кроме favicon
    images: [
      src_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
      "!**/favicon.*",
    ],
    fonts: src_folder + "/fonts/*.ttf",
    json: src_folder + "/json/**/*.*",
  },
  // пути к постояно прослушиваемым файлам
  watch: {
    html: src_folder + "/**/*.html",
    js: src_folder + "/**/*.js",
    css: src_folder + "/scss/**/*.scss",
    images: src_folder + "/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
    json: src_folder + "/json/**/*.*",
  },
  // путь к ПРОД для удал. каждый раз при запуске Gulp
  clean: "./" + project_name + "/",
};

// // Пишем папки которые нужно копировать через запятую
// let foldersArray = ['videos']; // 'videos', 'files' ...
// function copyFolders() {
// 	foldersArray.forEach(folderItem => {
// 		src(src_folder + "/" + folderItem + "/**/*.*", {})
// 			.pipe(newer(project_name + "/" + folderItem + "/"))
// 			.pipe(dest(project_name + "/" + folderItem + "/"));
// 	});
// 	return src(path.src.html).pipe(browsersync.stream());
// }
// fn обнова страницы
function browserSync(done) {
  browsersync.init({
    // настр. сервера
    server: {
      baseDir: "./" + project_name + "/",
    },
    // убир. доп поле инфы
    notify: false,
    // порт открытия брауз.
    port: 3000,
  });
}
// fn для Отслеж п/ф для обновл стр.
function watchFiles() {
  // пути отслеж файлов
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  // gulp.watch([path.watch.json], json);
  gulp.watch([path.watch.images], images);
}
// fn отчистки
function clean() {
  return del(path.clean);
}

// fn-ии для РАЗРАБ
// fn для html
function html() {
  // возвращ перем src по пути ИСХОД
  return (
    src(path.src.html, {})
      // Команды
      // сборщик из кусков кода
      .pipe(fileinclude())
      // интегр webp в html
      .pipe(webphtml())
      // переброс ф. из ИСХОД в ПРОД. В fn pipe команда gulp
      // времено Стар
      .pipe(dest(path.build.html))
      // .on('error', function (err) {
      // 	console.error('Error!', err.message);
      // })
      // .pipe(dest(path.build.html))
      // обнов стр./перазагрузка браузера
      .pipe(browsersync.stream())
  );
}
// fn для css. Разраб
// function css() {
//   // return src(path.src.css, {})
//   // времено Стар
//   return (
//     src(path.src.css, {})
//       // обр scss. настр
//       .pipe(
//         // scss({ outputStyle: 'expanded' }).on('error', scss.logError)
//         // времено Стар
//         scss({ outputStyle: "expanded" })
//       )
//       // .pipe(
//       //   rename({
//       //     extname: ".min.css",
//       //   })
//       // )
//       // временно Стар. групп медиа
//       .pipe(group_media())
//       // временно Стар. autoref для различ брауз
//       .pipe(
//         autoprefixer({
//           // поддерж брауз последние 5 версий
//           overrideBrowserslist: ["last 5 versions"],
//           // стиль autopref каскад
//           cascade: true,
//         })
//       )
//       // временно Стар. оптимиац css
//       .pipe(clean_css())
//       // вывод ф/п в ПРОД
//       .pipe(dest(path.build.css))
//       // обновл стр
//       .pipe(browsersync.stream())
//   );
// }

// function json() {
// 	return src(path.src.json, {})
// 		.pipe(dest(path.build.json))
// 		.pipe(browsersync.stream());
// }

// function js() {
// 	return src(path.src.js, {})
// 		.pipe(fileinclude())
// 		.on('error', function (err) {
// 			console.error('Error!', err.message);
// 		})
// 		.pipe(
// 			rename({
// 				suffix: ".min",
// 				extname: ".js"
// 			})
// 		)
// 		.pipe(dest(path.build.js))
// 		.pipe(browsersync.stream());
// }

// function images() {
// 	return src(path.src.images)
// 		.pipe(newer(path.build.images))
// 		.pipe(dest(path.build.images))
// }

// function favicon() {
// 	return src(path.src.favicon)
// 		.pipe(plumber())
// 		.pipe(
// 			rename({
// 				extname: ".ico"
// 			})
// 		)
// 		.pipe(dest(path.build.html))
// }

// function fonts_otf() {
// 	return src('./' + src_folder + '/fonts/*.otf')
// 		.pipe(plumber())
// 		.pipe(fonter({
// 			formats: ['ttf']
// 		}))
// 		.pipe(gulp.dest('./' + src_folder + '/fonts/'));
// }

// fn fonts. обработка шрифтов
function fonts() {
  src(path.src.fonts)
    // .pipe(plumber())
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
  // .pipe(browsersync.stream());
}

// fn fontstyle. запись и подкл к css(fonts.scss)
function fontsStyle() {
  let file_content = fs.readFileSync(src_folder + "/scss/fonts.scss");
  if (file_content == "") {
    fs.writeFile(src_folder + "/scss/fonts.scss", "", cb);
    fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split(".");
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              src_folder + "/scss/fonts.scss",
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              cb
            );
          }
          c_fontname = fontname;
        }
      }
    });
  }
  return src(path.src.html).pipe(browsersync.stream());
}

// fn-ии для ПРОД
// fn HTML. ПРОД
// function htmlBuild() {
// 	return src(path.src.html, {})
// 		.pipe(plumber())
// 		.pipe(fileinclude())
// 		.pipe(webphtml())
// 		.pipe(version({
// 			'value': '%DT%',
// 			'replaces': [
// 				'#{VERSION_REPlACE}#',
// 				[/#{VERSION_REPlACE}#/g, '%TS%']
// 			],
// 			'append': {
// 				'key': '_v',
// 				'cover': 0,
// 				'to': [
// 					'css',
// 					['image', '%TS%'],
// 					{
// 						'type': 'js',
// 						'attr': ['src', 'custom-src'], // String or Array, undefined this will use default. css: "href", js: ...
// 						'key': '_v',
// 						'value': '%DT%',
// 						'cover': 1,
// 						'files': ['app.min.js', 'vendors.min.js'] // Array [{String|Regex}] of explicit files to append to
// 					}
// 				]
// 			},
// 			'output': {
// 				'file': 'version.json'
// 			}
// 		}))
// 		.pipe(dest(path.build.html))
// 		.pipe(browsersync.stream());
// }
// fn CSS. ПРОД
// function cssBuild() {
// временно Стар
function css() {
  //  возвращ перем src по пути ИСХОД
  return (
    // src(path.src.css, {})
    // временно Стар
    src(path.src.css)
      // .pipe(plumber())
      // обраб scss. настр
      .pipe(
        // формир. файл равёрнутым(удобно смотреть)
        scss({ outputStyle: "expanded" }).on("error", scss.logError)
        // временно Стар
        // scss({ outputStyle: "expanded" })
      )
      // групп медиа в конце ф
      .pipe(group_media())
      // autopref для различ брауз
      .pipe(
        autoprefixer({
          // grid: true,
          // поддерж брауз последние 5 версий
          overrideBrowserslist: ["last 5 versions"],
          // стиль напис autopref - каскад
          cascade: true,
        })
      )
      // интегр. webp в css
      .pipe(
        webpcss({
          // webpClass: "._webp",
          // noWebpClass: "._no-webp",
          // временно Стар
          // ??? не раб backround(и наверно ещё что нить). изза этих привязок к webpClass/noWebpCl
          // webpClass: ".webp",
          // noWebpClass: ".no-webp",
        })
      )
      // вывод/копир ф/п в ПРОД ДО .min.
      .pipe(dest(path.build.css))
      // оптимизация(сжатие) css
      .pipe(clean_css())
      // переименовка css в + .min.
      .pipe(
        rename({
          extname: ".min.css",
        })
      )
      // вывод/копир ф/п в ПРОД
      .pipe(dest(path.build.css))
      // обновл стр
      .pipe(browsersync.stream())
  );
}
// fn JS. ПРОД
// function jsBuild() {
// временно Стар
function js() {
  // let appPath = path.build.js + 'app.min.js';
  // let vendorsPath = path.build.js + 'vendors.min.js';
  // del(appPath);
  // del(vendorsPath);
  // return src(path.src.js, {})
  return (
    src(path.src.js)
      // .pipe(plumber())
      .pipe(fileinclude())
      // .pipe(gulp.dest(path.build.js))
      // временно Стар
      .pipe(dest(path.build.js))
      // оптимизация(сжатие) js
      // .pipe(uglify(/* options */))
      .pipe(uglify())
      // .on('error', function (err) { console.log(err.toString()); this.emit('end'); })
      .pipe(
        rename({
          // suffix: ".min",
          // extname: ".js"
          // временно Стар
          extname: ".min.js",
        })
      )
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
  );
}
// fn IMAGES. ПРОД
// function imagesBuild() {
// временно Стар
function images() {
  // return (
  //   src(path.src.images)
  // временно Стар
  return (
    src(path.src.images)
      //	// .pipe(newer(path.build.images))
      // компилятор img в web
      .pipe(
        imagemin([
          webp({
            // качество изобр
            quality: 70,
          }),
        ])
      )
      // переименовка типа файла
      .pipe(
        rename({
          extname: ".webp",
        })
      )
      // копир webp в ПРОД
      .pipe(dest(path.build.images))
      // обраб ИСХОД для imagemin(не все поддерж webp)
      .pipe(src(path.src.images))
      // //.pipe(newer(path.build.images))
      // сжатие img
      .pipe(
        imagemin({
          progressive: true,
          // улучш. раб с svg
          svgoPlugins: [{ removeViewBox: false }],
          // раб с разн формат изобр
          interlaced: true,
          // сила сжатия
          optimizationLevel: 3, // 0 to 7
        })
      )
      .pipe(dest(path.build.images))
      .pipe(browsersync.stream())
  );
  // );
}

// let fontsBuild = gulp.series(fonts_otf, fonts, fontstyle);

// function infofile() {
// }

// fn cb. для коррект раб
function cb() {}

// Серии выполняемых fn и Сценарии выполнения. ПРОД
// let buildDev = gulp.series(clean, gulp.parallel(fontsBuild, copyFolders, json, html, css, js, favicon, images));
// let build = gulp.parallel(htmlBuild, cssBuild, jsBuild, imagesBuild);
// Серии fn вкл-ых в проц. выполн. РАЗРАБ (html,css,js,images,fonts выполн одновременно)
// временно Стар
let build = gulp.series(
  clean,
  gulp.parallel(html, css, js, images, fonts),
  fontsStyle
);
// Сценарий выполнения. РАЗРАБ (запуск/проверка робот.собн.)
// let watch = gulp.series(buildDev, gulp.parallel(watchFiles, browserSync));
// временно Стар
let watch = gulp.parallel(build, watchFiles, browserSync);

// Связь gulp с переменными
// exports.copy = copyFolders;
// exports.fonts = fontsBuild;
exports.build = build;
exports.watch = watch;
// при запуске gulp выполн перем по умолч.(default > watch > browserSync)
exports.default = watch;
exports.html = html;
// временно Стар
exports.css = css;
// временно Стар
exports.js = js;
// временно Стар
exports.images = images;
// временно Стар
exports.fonts = fonts;
// временно Стар
exports.fontsStyle = fontsStyle;
