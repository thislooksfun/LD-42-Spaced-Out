"use strict";

/* eslint-env node */

const babelify   = require("babelify");
const batch      = require("gulp-batch");
const browserify = require("browserify");
const buffer     = require("vinyl-buffer");
const gulp       = require("gulp");
const less       = require("gulp-less");
const plumber    = require("gulp-plumber");
const source     = require("vinyl-source-stream");
const sourcemaps = require("gulp-sourcemaps");
// const uglify     = require("gulp-uglifyes");
const watch      = require("gulp-watch");


function log(msg) {
  console.log(msg.toString());
}

function swallow(err) {
  log(err);
  this.emit("end");
}

var queue = [];
var running = false;
function enqueue(task, done) {
  queue.push({t: task, d: done});
  log(">> Enqueued '" + task + "'");
  if (!running) {
    processNext();
  }
}
function processNext() {
  if (queue.length == 0) { return; }
  running = true;
  let itm = queue.shift();
  log(">> Running task '" + itm.t + "'");
  gulp.start(itm.t, function() {
    running = false;
    itm.d();
    if (queue.length > 0) {
      processNext();
    }
  });
}


gulp.task("default", ["assets", "html", "less", "javascript"]);


gulp.task("assets", function() {
  return gulp.src("./assets/**/*")
    .pipe(plumber(log))
    .pipe(gulp.dest("./build/assets/"));
});


gulp.task("html", function() {
  return gulp.src("./html/**/*")
    .pipe(plumber(log))
    .pipe(gulp.dest("./build/"));
});


gulp.task("less", function() {
  return gulp.src("./less/main.less")
    .pipe(plumber(log))
    .pipe(less({
      paths: [ "./less/main.less" ]
    }))
    .pipe(gulp.dest("./build/"));
});


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
    .on("error", swallow)
    .pipe(plumber(log))
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./build/"));
});


gulp.task("watch", function() {
  watch("assets/**/*", { ignoreInitial: false }, batch(function (events, done) {
    enqueue("assets", done);
  }));
  watch("html/**/*.html", { ignoreInitial: false }, batch(function (events, done) {
    enqueue("html", done);
  }));
  watch("less/**/*.less", { ignoreInitial: false }, batch(function (events, done) {
    enqueue("less", done);
  }));
  watch("src/**/*.js", { ignoreInitial: false }, batch(function (events, done) {
    enqueue("javascript", done);
  }));
});