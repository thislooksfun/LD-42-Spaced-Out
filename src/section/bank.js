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
  
  purchase(cost) {
    money -= cost;
    if (money < 0) {
      game.end("Out of money!");
    }
    redraw();
  },
  
  income(amount) {
    money += amount;
    redraw();
  },
};