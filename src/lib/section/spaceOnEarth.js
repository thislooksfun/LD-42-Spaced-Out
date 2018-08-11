"use strict";

const secondsBetweenDecrement = 2;
var space = 100;

var last = Date.now();

module.exports = {
  setup() {
    this.refresh();
  },
  
  tick() {
    // Every 2 seconds
    let now = Date.now();
    if (now - last >= secondsBetweenDecrement * 1000) {
      last = now;
      this.decrement();
    }
  },
  
  decrement() {
    space--;
    
    // TODO: Check for 'space' reaching 0, then end the game
    
    this.refresh();
  },
  
  refresh() {
    $("#room-left").text(space);
  }
};