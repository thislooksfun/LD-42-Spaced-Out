"use strict";

console.log("main.js");

$(function() {
  console.log("jQuery ready!");
  
  let start = Date.now();
  global.runningTime = function() {
    return Date.now() - start;
  };
  
  // TODO: make a "start" button?
  require("./game").begin();
});