"use strict";

// Time to build, in seconds
// const buildTime = 5;

module.exports = {
  setup() {
    $("#build-ship").click(this.buildShip.bind(this));
  },
  
  tick() {
    
  },
  
  buildShip() {
    console.log("Build Ship!");
    // TODO: Start building a ship
  }
};