"use strict";

const Person = require("../class/person");

const numberOfPeople = 5;

var people = {};

let $lobby = $("#lobby .content");

module.exports = {
  setup() {
    // TODO
  },
  
  start() {
    for (var i = 0; i < numberOfPeople; i++) {
      this.addNew();
    }
  },
  
  teardown() {
    clearInterval(this._timer);
  },
  
  addNew() {
    let newPerson = new Person();
    $lobby.append(newPerson.toHTML());
    newPerson.setupDragging();
    people[newPerson.id] = newPerson;
  },
  
  // TODO: Call this when a person is dropped on a ship
  get(id) {
    return people[id];
  },
  
  remove(id) {
    let person = people[id];
    delete people[id];
    person.$el.detach();
    
    // Add a new person to replace the one we just removed
    this.addNew();
    
    return person;
  },
  
  refresh() {
    $lobby.empty();
    
    for (let person of people) {
      $lobby.append(person.toHTML());
    }
  },
};