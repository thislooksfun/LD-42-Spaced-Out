"use strict";

const attributes = require("../lib/attributes");
const util = require("../lib/util");
const diffScale = require("../section/score").diffScale;


const maxAttributes = 5;

const moneyScale = 5;
const payoutMin  = 1000;
const fineMin    = 1500;
const bonusMin   = 1000;


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
    
    let scaledAttrMax = Math.floor(1 + ((maxAttributes - 1) * diffScale()));
    let max = Math.min(scaledAttrMax, maxAttributes);
    
    this.needs   = attributes.random(util.rand(max));
    this.desires = attributes.random(util.rand(max), this.needs.unused);
    this.inShip  = false;
    
    
    // Subtract one so that the max is `payoutMin + (payoutMin * (moneyScale-1)) = payoutMin * moneyScale`
    // rather than `payoutMin + (payoutMin * moneyScale)`
    let ms = moneyScale - 1;
    this.payout = payoutMin + util.rand(Math.floor(ms * payoutMin * this.needs.length   / maxAttributes));
    this.fine   = fineMin   + util.rand(Math.floor(ms * fineMin   * this.needs.length   / maxAttributes));
    this.bonus  = bonusMin  + util.rand(Math.floor(ms * bonusMin  * this.desires.length / maxAttributes));
    
    
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
    
    
    /** Needs **/
    
    let $needs = $("<div>", {
      class: "needs",
    });
    $needs.append($("<span>", { text: "Needs" }));
    let $needsList = $("<div>", { class: "icon-list" });
    for (let req of this.needs) {
      $needsList.append(attributes.buildElFrom(req));
    }
    $needs.append($needsList);
    
    let $fine = $("<div>", { class: "fine" });
    $fine.append($("<span>", { text: "Fine:"}));
    let $fineTxt = $("<span>", { class: "price cost", text: "-$" + (util.prettyPrint(this.fine)) + "/item" });
    if (this.needs.length === 0) {
      $fine.addClass("na");
      $fineTxt.text("N/A");
    }
    $fine.append($fineTxt);
    $needs.append($fine);
    
    this.$el.append($needs);
    
    
    
    /** Desires **/
    
    let $desires = $("<div>", {
      class: "desires",
    });
    $desires.append($("<span>", { text: "Desires" }));
    let $desiresList = $("<div>", { class: "icon-list" });
    for (let des of this.desires) {
      $desiresList.append(attributes.buildElFrom(des));
    }
    $desires.append($desiresList);
    
    let $bonus = $("<div>", { class: "bonus" });
    $bonus.append($("<span>", { text: "Bonus:"}));
    let $bonusTxt = $("<span>", { class: "price earn", text: "+$" + (util.prettyPrint(this.bonus)) + "/item" });
    if (this.desires.length === 0) {
      $bonus.addClass("na");
      $bonusTxt.text("N/A");
    }
    $bonus.append($bonusTxt);
    $desires.append($bonus);
    
    this.$el.append($desires);
    
    
    
    /** Face + ticket price **/
    
    let $bottom = $("<div>", {
      class: "face-and-ticket",
    });
    
    let $face = $("<img>", {
      src: "assets/img/person.png",
      alt: "face",
      class: "icon face",
    });
    $bottom.append($face);
    
    let $ticket = $("<div>", {
      class: "ticket"
    });
    let $ticketInner = $("<span>", { text: "Ticket: " });
    $ticketInner.append($("<span>", { class: "price earn", text: "+$" + (util.prettyPrint(this.payout)) }));
    $ticket.append($ticketInner);
    $bottom.append($ticket);
    
    this.$el.append($bottom);
    
    
    return this.$el;
  }
};