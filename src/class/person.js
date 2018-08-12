"use strict";

const attributes = require("../lib/attributes");
const util = require("../lib/util");


// Duration of difficulty ramp in seconds
const difficultyRampsOver = 5 * 60;  // 5 minutes
const maxAttributes = 5;

// Time in ms
const diffRamp = difficultyRampsOver * 1000;

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
    
    let time = runningTime();
    let scaledAttrMax =  Math.floor(1 + ((maxAttributes - 1) * (time / diffRamp)));
    let max = Math.min(scaledAttrMax, maxAttributes);
    
    this.needs   = attributes.random(util.rand(max));
    this.desires = attributes.random(util.rand(max), this.needs.unused);
    
    this.$el = $("<div>", { class: "person" });
  }
  
  setupDragging() {
    console.log("Setting up dragging");
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
    
    this.$el.append($needs, $desires);
    
    return this.$el;
  }
};