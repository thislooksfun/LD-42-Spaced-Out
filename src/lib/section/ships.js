"use strict";

const buildTimeInSeconds = 5;

module.exports = {
  setup() {
    $("#build-ship").click(this.startBuild.bind(this));
    this.ship = $(".ship")[0];
  },
  
  startBuild() {
    setTimeout(this.deliverShip.bind(this), buildTimeInSeconds * 1000);
    console.log("Started building ship!");
  },

  deliverShip() {
    $(".ship").addClass("built");
    console.log("Ship has been delivered!");
  }
};