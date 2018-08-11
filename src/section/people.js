"use strict";

const Person = require("../class/person");

const newPersonInterval = 5;
const startingPeople = 5;
const maxPeople = 10;

var people = [];

module.exports = {
  setup() {
    // TODO
    setInterval(this.addNew.bind(this), newPersonInterval * 1000);
    
    for (var i = 0; i < startingPeople; i++) {
      this.addNew();
    }
  },
  
  addNew() {
    if (people.length < maxPeople) {
      let newPerson = new Person();
      people.push(newPerson);
      this.refresh();
    }
  },
  
  refresh() {
    $("#people").empty();
    
    for (let person of people) {
      $("#people").append(person.asHTML());
    }
  },
};