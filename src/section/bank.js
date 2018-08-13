"use strict";

const game = require("../game");
const prettyPrint = require("../lib/util").prettyPrint;

const startingMoney = 100000;


var money = -1;
let $balance = $("#balance");
function redraw() {
  $balance.text("$" + prettyPrint(money));
}

module.exports = {
  
  setup() {
    money = startingMoney;
    redraw();
  },
  
  canSpend(amt) {
    return money >= amt;
  },
  
  spend(cost) {
    if (cost < 0) {
      return this.earn(-cost);
    }
    money -= cost;
    if (money < 0) {
      game.end("Out of money!");
    }
    redraw();
  },
  
  earn(amount) {
    if (amount < 0) {
      return this.spend(-amount);
    }
    money += amount;
    redraw();
  },
};