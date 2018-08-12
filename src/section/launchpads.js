"use strict";

const Ship = require("../class/ship");
const prettyPrint = require("../lib/util").prettyPrint;
const bank = require("./bank");

// const buildTimeInSeconds = 5;

const priceToBuildShip = 5000;
const priceToBuyPad = 10000;


let pad1 = { ship: null, bought: true,  $title: $("#pad1 h1"), $content: $("#pad1 .content") };
let pad2 = { ship: null, bought: false, $title: $("#pad1 h1"), $content: $("#pad2 .content") };
let pad3 = { ship: null, bought: false, $title: $("#pad1 h1"), $content: $("#pad3 .content") };


module.exports = {
  
  setup() {
    
  },
  
  start() {
    // TODO: Custom drop action to add to Ship instance
    // TODO: Make sure Person instance is removed from "people" array in "people.js"
    
    // dnd.addTarget($(".launchpad"), {sticky: true});
    
    pad1.ship = new Ship();
    
    this.redraw(pad1);
    this.redraw(pad2);
    this.redraw(pad3);
    
    // $("#build-ship").click(this.startBuild.bind(this));
    // this.ship = $(".ship")[0];
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
      pad.$content.append(pad.ship.toHTML());
      pad.ship.setupDragTarget(this.redraw.bind(this, pad));
    } else if (pad.bought) {
      // TODO: Render empty pad + 'build' button
      pad.$content.append($("<span>", {text: "Empty"}));
      let buildBtn = $("<button>", {class: "build", text: "Build ($" + prettyPrint(priceToBuildShip) + ")"});
      let _this = this;
      buildBtn.click(function() {
        if (!bank.canSpend(priceToBuildShip)) {
          // TODO: Visualize that it failed becaue of money
          // Maybe flash balance?
          return;
        }
        bank.purchase(priceToBuildShip);
        
        pad.ship = new Ship();
        _this.redraw(pad);
      });
      pad.$content.append(buildBtn);
    } else {
      // TODO: Render locked pad + 'buy' button
      pad.$content.append($("<span>", {text: "Locked"}));
      let buyBtn = $("<button>", {class: "unlock", text: "Unlock ($" + prettyPrint(priceToBuyPad) + ")"});
      let _this = this;
      buyBtn.click(function() {
        if (!bank.canSpend(priceToBuyPad)) {
          // TODO: Visualize that it failed becaue of money
          // Maybe flash balance?
          return;
        }
        bank.purchase(priceToBuyPad);
        
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