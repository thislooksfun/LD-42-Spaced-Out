"use strict";

module.exports = {
  rand(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
};