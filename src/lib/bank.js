"use strict";

const game = require("../game");

var money = 10000000;

module.exports = {
  get() {
    return money;
  },
  
  purchase(cost) {
    money -= cost;
    if (money <= 0) {
      game.end("Out of money!");
    }
  },
  
  income(amount) {
    money += amount;
  }
};