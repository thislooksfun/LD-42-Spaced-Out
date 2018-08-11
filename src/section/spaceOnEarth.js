"use strict";

const secondsBetweenDecrement = 2;
var space = 100;

module.exports = {
  setup() {
    this.refresh();
    
    setInterval(this.decrement.bind(this), secondsBetweenDecrement * 1000);
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