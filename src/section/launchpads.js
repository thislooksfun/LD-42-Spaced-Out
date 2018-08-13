"use strict";

const Ship = require("../class/ship");
const prettyPrint = require("../lib/util").prettyPrint;
const bank = require("./bank");

// const buildTimeInSeconds = 5;

const priceToBuildShip = 5000;
const priceToBuyPad = 10000;


let pad1 = { ship: null, bought: true,  $el: $("#pad1"), $content: $("#pad1 .content") };
let pad2 = { ship: null, bought: false, $el: $("#pad2"), $content: $("#pad2 .content") };
let pad3 = { ship: null, bought: false, $el: $("#pad3"), $content: $("#pad3 .content") };


module.exports = {
  
  setup() {
    // TODO: ?
  },
  
  start() {
    pad1.ship = new Ship(pad1, this.redraw.bind(this, pad1));
    
    this.redraw(pad1);
    this.redraw(pad2);
    this.redraw(pad3);
  },
  
  // startBuild() {
  //   if (this.ships.count < this.maxShips) {
  //     this.ships.push(new Ship());
  //   }
  //   setTimeout(this.deliverShip.bind(this), buildTimeInSeconds * 1000);
  //   console.log("Started building ship!");
  // },
  
  redraw(pad) {
    pad.$content.empty();
    if (pad.ship != null) {
      pad.$el.removeClass("locked empty");
      pad.$content.append(pad.ship.toHTML());
      pad.ship.setupDragTarget();
    } else if (pad.bought) {
      pad.$el.removeClass("locked");
      pad.$el.addClass("empty");
      
      pad.$content.append($("<h2>", {text: "Empty"}));
      let buildBtn = $("<button>", {class: "build", text: "Build ($" + prettyPrint(priceToBuildShip) + ")"});
      let _this = this;
      buildBtn.click(function() {
        if (!bank.canSpend(priceToBuildShip)) {
          // TODO: Visualize that it failed becaue of money
          // Maybe flash balance?
          return;
        }
        bank.spend(priceToBuildShip);
        
        pad.ship = new Ship(pad, _this.redraw.bind(_this, pad));
        _this.redraw(pad);
      });
      pad.$content.append(buildBtn);
    } else {
      pad.$el.removeClass("empty");
      pad.$el.addClass("locked");
      
      pad.$content.append($("<h2>", {text: "Locked"}));
      let buyBtn = $("<button>", {class: "unlock", text: "Unlock ($" + prettyPrint(priceToBuyPad) + ")"});
      let _this = this;
      buyBtn.click(function() {
        if (!bank.canSpend(priceToBuyPad)) {
          // TODO: Visualize that it failed becaue of money
          // Maybe flash balance?
          return;
        }
        bank.spend(priceToBuyPad);
        
        pad.bought = true;
        _this.redraw(pad);
      });
      pad.$content.append(buyBtn);
    }
  },

  deliverShip() {
    $(".ship").addClass("built");
    console.log("Ship has been delivered!");
  }
};