"use strict";

var sections = [
  require("./section/bank"),
  require("./section/launchpads"),
  require("./section/lobby"),
  require("./section/score"),
  require("./section/spaceOnEarth"),
  // TODO: More sections here
];


function setup() {
  for (let s of sections) {
    if (typeof s.setup === "function") {
      s.setup();
    }
  }
}

function start() {
  for (let s of sections) {
    if (typeof s.start === "function") {
      s.start();
    }
  }
}


var $overlay = $("<div>", {class: "overlay"});
var $overlayContainer = $("<div>", {class: "container"});
$overlay.append($overlayContainer);


module.exports = {
  begin() {
    $overlayContainer.empty();
    $overlayContainer.append($("<h1>", {text: "Spaced Out"}));
    let $startBtn = $("<button>", {text: "Start Game"});
    $startBtn.click(function() {
      $overlay.detach();
      setup();
      start();
    });
    $overlayContainer.append($startBtn);
    
    $("body").append($overlay);
  },
  
  end(reason) {
    console.log("Ending game -- reason: " + reason);
    for (let s of sections) {
      if (typeof s.teardown === "function") {
        s.teardown();
      }
    }
    
    $overlayContainer.empty();
    $overlayContainer.append($("<h1>", {text: "Game Over"}));
    let score = require("./section/score").format();
    $overlayContainer.append($("<span>", {text: "The Earth has run out of space."}));
    $overlayContainer.append($("<span>", {text: "But hey, at least you saved " + score + "."}));
    let $startBtn = $("<button>", {text: "Retry?"});
    $startBtn.click(function() {
      $overlay.detach();
      setup();
      start();
    });
    $overlayContainer.append($startBtn);
    
    $("body").append($overlay);
    // TODO: Display end-of-game screen
  }
};