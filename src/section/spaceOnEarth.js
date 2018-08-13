"use strict";

const secondsBetweenDecrement = 2;
var space = 100;
// var space = 10;

module.exports = {
  
  setup() {
    // TODO
  },
  
  start() {
    this.redraw();
    
    this._timer = setInterval(this.decrement.bind(this), secondsBetweenDecrement * 1000);
  },
  
  teardown() {
    clearInterval(this._timer);
  },
  
  decrement() {
    space--;
    
    // TODO: Check for 'space' reaching 0, then end the game
    if (space <= 0) {
      require("../game").end("Out of space!");
    }
    
    this.redraw();
  },
  
  add(count) {
    space += count;
    this.redraw();
  },
  
  redraw() {
    $("#room-left").text(space);
  }
};