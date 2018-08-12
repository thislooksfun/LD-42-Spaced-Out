"use strict";

const requirements = require("../lib/requirements");

const maxPassengers = 5;

module.exports = class Person {
  
  constructor() {
    // TODO: Start between 0/1, and work up to 0/5
    this.requirements = requirements.random(1);
    self.passengers = [];
  }
  
  addPassenger(p) {
    if (self.passengers.length >= maxPassengers) { return false; }
    self.passengers.push(p);
    
    return true;
  }
  
};