"use strict";

const requirements = require("../lib/requirements");
const util = require("../lib/util");
const dnd = require("../lib/dragAndDrop");

module.exports = class Person {
  
  constructor() {
    // TODO: Start between 0/1, and work up to 0/5
    let numReqs = util.rand(1);
    let numDes  = util.rand(1);
    
    this.requirements = requirements.random(numReqs);
    this.desires      = requirements.random(numDes, this.requirements.unused);
  }
  
  asHTML() {
    let $div = $("<div>", {
      class: "person",
      draggable: true,
    });
    
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
    
    $div.append($requirements, $desires);
    dnd.addSource($div);
    
    return $div;
  }
};