"use strict";

const Person = require("../class/person");

const newPersonInterval = 5;
const startingPeople = 5;
const maxPeople = 10;

var count = 0;
var people = {};

let $lobby = $("#lobby .content");
let $header = $("#lobby h1");

module.exports = {
  setup() {
    // TODO
  },
  
  start() {
    this._timer = setInterval(this.addNew.bind(this), newPersonInterval * 1000);
    
    for (var i = 0; i < startingPeople; i++) {
      this.addNew();
    }
  },
  
  teardown() {
    clearInterval(this._timer);
  },
  
  addNew() {
    if (count < maxPeople) {
      let newPerson = new Person();
      $lobby.append(newPerson.toHTML());
      newPerson.setupDragging();
      people[newPerson.id] = newPerson;
      count++;
    }
    $header.text("Lobby (" + count + "/" + maxPeople + ")");
  },
  
  // TODO: Call this when a person is dropped on a ship
  get(id) {
    return people[id];
  },
  
  remove(id) {
    let person = people[id];
    delete people[id];
    count--;
    
    person.$el.detach();
    $header.text("Lobby (" + count + "/" + maxPeople + ")");
    return person;
  },
  
  refresh() {
    $lobby.empty();
    
    for (let person of people) {
      $lobby.append(person.toHTML());
    }
  },
};