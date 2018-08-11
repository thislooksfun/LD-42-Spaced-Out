"use strict";

/* eslint-env node */

const babelify   = require("babelify");
const batch      = require("gulp-batch");
const browserify = require("browserify");
const buffer     = require("vinyl-buffer");
const gulp       = require("gulp");
const less       = require("gulp-less");
const log        = require("gulplog");
const source     = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
const uglify     = require("gulp-uglifyes");
const watch      = require("gulp-watch");


gulp.task("default", ["bundle"]);

gulp.task("bundle", ["javascript", "css", "assets"]);


gulp.task("javascript", function() {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: "./src/main.js",
    debug: true,
    // defining transforms here will avoid crashing your stream
    // transform: [babelify]
  });

  return b
    .transform(babelify, {sourceMaps:true})
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on("error", log.error)
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./docs/"));
});


gulp.task("css", function() {
  return gulp.src("./less/main.less")
    .pipe(less({
      paths: [ "./less/main.less" ]
    }))
    .on("error", log.error)
    .pipe(gulp.dest("./docs"));
});


gulp.task("assets", function() {
  return gulp.src("./assets/**/*")
    .pipe(gulp.dest("./docs/assets/"));
});


gulp.task("watch", function() {
  watch(["assets/**/*", "less/**/*.less", "src/**/*.js"], { ignoreInitial: false }, batch(function (events, done) {
    gulp.start("bundle", done);
  }));
});