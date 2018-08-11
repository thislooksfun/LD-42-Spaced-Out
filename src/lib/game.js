"use strict";

// number of ticks per second
const tickRate = 60;


var sections = [
  require("./section/ships"),
  require("./section/spaceOnEarth"),
  // TODO: More gameobjects here
];


// Setup all sections
for (let s of sections) {
  s.setup();
}


// Tick all sections
function tick() {
  for (let s of sections) {
    s.tick();
  }
}

setInterval(tick, 1000 / tickRate);
