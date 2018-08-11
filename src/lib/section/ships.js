"use strict";

const buildTimeInSeconds = 5,
  ticksPerSecond = 60;
let currentBuildTime = 0;

module.exports = {
  setup() {
    $("#build-ship").click(this.startBuild.bind(this));
    this.ship = $(".ship")[0];
  },
  
  tick() {
    if(currentBuildTime > 0) {
      currentBuildTime--;

      if(currentBuildTime === 0) {
        this.deliverShip();
      }
    }
  },
  
  startBuild() {
    currentBuildTime = buildTimeInSeconds * ticksPerSecond;
    console.log("Started building ship!");
  },

  deliverShip() {
    $(".ship").toggleClass("built");
    console.log("Ship has been delivered!");
  }
};