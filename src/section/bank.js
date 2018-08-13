"use strict";

const prettyPrint = require("../lib/util").prettyPrint;

const startingMoney = 100000;


var money = -1;
let $bank = $("#bank");
let $balance = $("#balance");
function redraw() {
  $balance.text("$" + prettyPrint(money));
}

const timeBetweenFlows = 250;
var lastFlow = 0;
var queue = [];
function queueCashflow($el) {
  queue.push($el);
  
  if (queue.length === 1) {
    let timeSinceLastFlow = Date.now() - lastFlow;
    if (timeSinceLastFlow >= timeBetweenFlows) {
      animateCashflow(queue.shift());
    } else {
      setTimeout(function() {
        animateCashflow(queue.shift());
      }, timeBetweenFlows - timeSinceLastFlow);
    }
  }
}
function animateCashflow($el) {
  lastFlow = Date.now();
  
  $bank.append($el);
  setTimeout(function() {
    
    setTimeout(function() {
      if (queue.length > 0) {
        animateCashflow(queue.shift());
      }
    }, timeBetweenFlows);
    
    $el.addClass("animate");
    setTimeout(function() {
      $el.remove();
    }, 1250);
  }, 50);
}


module.exports = {
  
  setup() {
    money = startingMoney;
    redraw();
  },
  
  canSpend(amt) {
    let res = money >= amt;
    if (!res) {
      $balance.addClass("flash");
      setTimeout(function() {
        $balance.removeClass("flash");
      }, 600);
    }
    return res;
  },
  
  spend(cost) {
    if (cost < 0) {
      return this.earn(-cost);
    }
    money -= cost;
    if (money < 0) {
      require("../game").end("Out of money!");
    }
    
    queueCashflow($("<span>", {
      class: "cashflow out",
      text: "-$" + prettyPrint(cost)
    }));
    
    redraw();
  },
  
  earn(amount) {
    if (amount < 0) {
      return this.spend(-amount);
    }
    
    queueCashflow($("<span>", {
      class: "cashflow in",
      text: "+$" + prettyPrint(amount)
    }));
    
    money += amount;
    redraw();
  },
};