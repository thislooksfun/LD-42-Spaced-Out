"use strict";

const Ship = require("../class/ship");

const buildTimeInSeconds = 5;

module.exports = {
  maxShips: 1,
  ships: [],
  
  setup() {
    $("#build-ship").click(this.startBuild.bind(this));
    this.ship = $(".ship")[0];
  },
  
  startBuild() {
    if (this.ships.count < this.maxShips) {
      this.ships.push(new Ship());
    }
    setTimeout(this.deliverShip.bind(this), buildTimeInSeconds * 1000);
    console.log("Started building ship!");
  },

  deliverShip() {
    
    $(".ship").addClass("built");
    console.log("Ship has been delivered!");
  }
};