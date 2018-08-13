"use strict";

const attributes = require("../lib/attributes");
const util = require("../lib/util");
const diffScale = require("../section/score").diffScale;


const maxAttributes = 5;

const moneyScale = 10;
const payoutMin  = 500;
const fineMin    = 50;
const bonusMin   = 25;


function dragStart(e, id) {
  $(this).addClass("dragging");
  
  let dt = e.originalEvent.dataTransfer;
  dt.effectAllowed = "move";
  dt.setData("text/plain", id);
}

function dragEnd() {
  let $el = $(this);
  $el.removeClass("dragging");
  $(".launchpad").removeClass("dragged-over");
  
  if ($el.data("removeOnDragEnd")) {
    $el.off("dragstart");
    $el.off("dragend");
    $el.removeAttr("draggable");
  }
}


module.exports = class Person {
  
  constructor() {
    this.id = util.uuidv4();
    
    // let scaledAttrMax = Math.floor(1 + ((maxAttributes - 1) * diffScale()));
    let scaledAttrMax = Math.floor(1 + ((maxAttributes - 1)));
    let max = Math.min(scaledAttrMax, maxAttributes);
    
    this.needs   = attributes.random(util.rand(max));
    this.desires = attributes.random(util.rand(max), this.needs.unused);
    this.inShip  = false;
    
    
    // Subtract one so that the max is `payoutMin + (payoutMin * (moneyScale-1)) = payoutMin * moneyScale`
    // rather than `payoutMin + (payoutMin * moneyScale)`
    let ms = moneyScale - 1;
    this.payout = payoutMin + util.rand(Math.floor(ms * payoutMin * this.needs.length   / maxAttributes));
    this.fine   = payoutMin + util.rand(Math.floor(ms * fineMin   * this.needs.length   / maxAttributes));
    this.bonus  = payoutMin + util.rand(Math.floor(ms * bonusMin  * this.desires.length / maxAttributes));
    
    
    this.$el = $("<div>", { class: "person" });
  }
  
  setupDragging() {
    let id = this.id;
    this.$el.on("dragstart", function(e) {
      dragStart.call(this, e, id);
    });
    this.$el.on("dragend", dragEnd);
    this.$el.attr("draggable", true);
  }
  
  toHTML() {
    this.$el.empty();
    
    let $needs = $("<div>", {
      class: "needs",
    });
    if (this.needs.length === 0) {
      $needs.append($("<span>", { text: "-- no needs --" }));
    } else {
      for (let req of this.needs) {
        $needs.append($("<span>", { text: req }));
      }
    }
    this.$el.append($needs);
    
    let $desires = $("<div>", {
      class: "desires",
    });
    if (this.desires.length === 0) {
      $desires.append($("<span>", { text: "-- no desires --" }));
    } else {
      for (let req of this.desires) {
        $desires.append($("<span>", { text: req }));
      }
    }
    this.$el.append($desires);
    
    
    
    let $money = $("<div>", {
      class: "money",
    });
    $money.append($("<span>", { class: "payout", text: "Payout: $" + util.prettyPrint(this.payout) }));
    let $fine = $("<span>", { class: "fine", text: "Fine: $" + (util.prettyPrint(this.fine)) });
    if (this.needs.length === 0) {
      $fine.addClass("na");
      $fine.text("Fine: N/A");
    }
    let $bonus = $("<span>", { class: "bonus", text: "Bonus: $" + util.prettyPrint(this.bonus) });
    if (this.desires.length === 0) {
      $bonus.addClass("na");
      $bonus.text("Bonus: N/A");
    }
    $money.append($fine, $bonus);
    this.$el.append($money);
    
    console.log(this.id + " -- payout: $" + this.payout + "; fine: $" + this.fine + "; bonus: $" + this.bonus);
    
    return this.$el;
  }
};