"use strict";

$(function() {
  let start = Date.now();
  global.runningTime = function() {
    return Date.now() - start;
  };
  
  require("./game").begin();
});