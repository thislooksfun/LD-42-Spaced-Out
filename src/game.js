"use strict";

var sections = [
  require("./section/launchpads"),
  require("./section/people"),
  require("./section/spaceOnEarth"),
  // TODO: More sections here
];

module.exports = {
  begin() {
    // Setup all sections
    for (let s of sections) {
      if (typeof s.setup === "function") {
        s.setup();
      }
    }
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