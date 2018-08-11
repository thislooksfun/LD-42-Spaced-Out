"use strict";

console.log("main.js");

$(function() {
  console.log("jQuery ready!");
  
  let start = Date.now();
  global.runningTime = function() {
    return Date.now() - start;
  };
  
  require("./game");
});