"use strict";

const requirements = require("requirements");

module.exports = class Person {
  
  constructor() {
    // TODO: Start between 0/1, and work up to 0/5
    this.requirements = requirements.random(1);
  }
  
};