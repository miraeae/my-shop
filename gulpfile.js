const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const browserSync = require("browser-sync").create();
const del = require("del");
const ghPages = require("gulp-gh-pages");

// 경로 설정
const paths = {
  html: {
    src: "src/html/*.html",
    dest: "dist/",
  },
  styles: {
    src: "src/assets/scss/**/*.scss",
    dest: "dist/css",
  },
  scripts: {
    src: "src/assets/js/**/*.js",
    dest: "dist/js",
  },
  images: {
    src: "src/assets/images/**/*",
    dest: "dist/images",
  },
  data: {
    src: "src/assets/data/*.json",
    dest: "dist/data",
  },
};

// HTML
function html() {
  return gulp
    .src(paths.html.src)
    .pipe(plumber())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest));
}

// SCSS → CSS
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// JS → Babel + Uglify
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.scripts.dest));
}

// 이미지 최적화
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
}

// DATA 복사
function data() {
  return gulp.src(paths.data.src).pipe(gulp.dest(paths.data.dest));
}

// 배포
function deploy() {
  return gulp.src("dist/**/*").pipe(ghPages());
}

// 배포 후 publish 폴더 삭제
function cleanPublish() {
  return del([".publish"]);
}

// 정리
function clean() {
  return del(["dist"]);
}

// 서버 & 감시
function serve() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
    notify: false,
  });

  gulp.watch(paths.html.src, html).on("change", browserSync.reload);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts).on("change", browserSync.reload);
  gulp.watch(paths.images.src, images).on("change", browserSync.reload);
  gulp.watch(paths.data.src, data).on("change", browserSync.reload);
}

// 태스크 정의
const build = gulp.series(
  clean,
  gulp.parallel(html, styles, scripts, images, data)
);
const dev = gulp.series(build, serve);

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.clean = clean;
exports.data = data;
exports.cleanPublish = cleanPublish;
exports.deploy = gulp.series(deploy, cleanPublish);
exports.build = build;
exports.default = dev;
