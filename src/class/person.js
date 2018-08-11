"use strict";

const requirements = require("../lib/requirements");

module.exports = class Person {
  
  constructor() {
    // TODO: Start between 0/1, and work up to 0/5
    this.requirements = requirements.random(1);
  }
  
  asHTML() {
    let item = $("<div>");
    item.text(this.requirements.toString());
    return item;
  }
  
};