"use strict";

var sections = [
  require("./section/people"),
  require("./section/ships"),
  require("./section/spaceOnEarth"),
  // TODO: More sections here
];


// Setup all sections
for (let s of sections) {
  s.setup();
}
