"use strict";

module.exports = {
  rand(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * Math.floor(max - min));
  },
};