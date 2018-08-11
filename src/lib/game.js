"use strict";

console.log("game.js");

// number of ticks per second
const tickRate = 60;

function setup() {
  console.log("Setup");
}


function run() {
  console.log("Running");
  setInterval(tick, 1000 / tickRate);
}


function tick() {
  console.log("Tick! " + Date());
}



setup();
run();
