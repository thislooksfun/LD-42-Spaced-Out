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


module.exports = {
  begin() {
    setup();
    start();
  },
  
  end(reason) {
    console.log("Ending game -- reason: " + reason);
    for (let s of sections) {
      if (typeof s.teardown === "function") {
        s.teardown();
      }
    }
    
    // TODO: Display end-of-game screen
  }
};