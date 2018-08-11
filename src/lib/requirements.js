"use strict";

const utils = require("./util");

module.exports = {
  random(count = 5) {
    var out = [];
    var list = self.list;
    while (count > 0 && list.length > 0) {
      let index = utils.rand(list.length);
      out.push(list[index]);
      list.splice(index, 1);
    }
    return out;
  },
  
  list: [
    "A",
    "B",
    "C",
    "D",
    "E",
  ],
};