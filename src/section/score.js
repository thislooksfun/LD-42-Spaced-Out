"use strict";

const prettyPrint = require("../lib/util").prettyPrint;
const soe = require("./spaceOnEarth");

// How many people you have to save to get the hardest difficulty
const hardestDifficultyAt = 100;

var saved = -1;
let $saved = $("#saved");
function redraw() {
  $saved.text(format());
}

function format() {
  return prettyPrint(saved) + " " + (saved === 1 ? "person" : "people");
}

module.exports = {
  
  setup() {
    saved = 0;
    redraw();
  },
  
  format: format,
  
  save(count) {
    saved += count;
    redraw();
    
    soe.add(count);
  },
  
  // Starts at '0' (easiest), and goes to '1' (hardest) over the course of the game
  diffScale() {
    return Math.min(saved / hardestDifficultyAt, 1);
  }
  
};