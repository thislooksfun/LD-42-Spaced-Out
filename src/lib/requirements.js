"use strict";

const utils = require("./util");

module.exports = {
  random(count = 5) {
    var out = [];
    // Make a copy of the array
    var list = this.list.slice(this.list);
    while (count > 0 && list.length > 0) {
      let index = utils.rand(list.length);
      out.push(list[index]);
      list.splice(index, 1);
      count--;
    }
    return out;
  },
  
  list: [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ],
};