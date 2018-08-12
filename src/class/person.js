"use strict";

const requirements = require("../lib/requirements");
const util = require("../lib/util");


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
    // TODO: Start between 0/1, and work up to 0/5
    let numReqs = util.rand(1);
    let numDes  = util.rand(1);
    
    this.id = util.uuidv4();
    
    this.requirements = requirements.random(numReqs);
    this.desires      = requirements.random(numDes, this.requirements.unused);
    
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
    
    let $requirements = $("<div>", {
      class: "requirements",
    });
    if (this.requirements.length === 0) {
      $requirements.append($("<span>", { text: "-- no requirements --" }));
    } else {
      for (let req of this.requirements) {
        $requirements.append($("<span>", { text: req }));
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
    
    this.$el.append($requirements, $desires);
    
    return this.$el;
  }
};