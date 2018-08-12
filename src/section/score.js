"use strict";

const prettyPrint = require("../lib/util").prettyPrint;

// How many people you have to save to get the hardest difficulty
const hardestDifficultyAt = 100;

var saved = -1;
let $saved = $("#saved");
function redraw() {
  $saved.text(prettyPrint(saved));
}

module.exports = {
  
  setup() {
    saved = 0;
    redraw();
  },
  
  save(count) {
    saved += count;
    redraw();
  },
  
  // Starts at '0' (easiest), and goes to '1' (hardest) over the course of the game
  diffScale() {
    return Math.min(saved / hardestDifficultyAt, 1);
  }
  
};