"use strict";

const secondsBetweenDecrement = 3;
const startingSpace = 100;

var space = -1;

module.exports = {
  
  setup() {
    space = startingSpace;
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