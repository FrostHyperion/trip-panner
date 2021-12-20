const { src, dest, series } = require("gulp");
const cleanCSS = require("gulp-clean-css");
const minify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");

function moveHTMLFiles() {
  return src("src/*.html").pipe(dest("dist"));
}

function moveCSSFiles() {
  return src("src/css/*.css")
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest("dist/css"));
  a;
}
function moveJsFiles() {
  return src("src/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(minify())
    .pipe(sourcemaps.write())
    .pipe(dest("dist/js"));
}

exports.default = series(moveHTMLFiles, moveCSSFiles, moveJsFiles);
exports.moveHTML = moveHTMLFiles;
exports.moveCSS = moveCSSFiles;
exports.moveJS = moveJsFiles;
