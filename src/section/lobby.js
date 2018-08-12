"use strict";

const Person = require("../class/person");

const newPersonInterval = 5;
const startingPeople = 5;
const maxPeople = 10;

var people = [];

let $lobby = $("#lobby");
let $header = $lobby.children("h1");

module.exports = {
  setup() {
    // TODO
    this._timer = setInterval(this.addNew.bind(this), newPersonInterval * 1000);
    
    for (var i = 0; i < startingPeople; i++) {
      this.addNew();
    }
  },
  
  teardown() {
    clearInterval(this._timer);
  },
  
  addNew() {
    if (people.length < maxPeople) {
      let newPerson = new Person();
      people.push(newPerson);
      $lobby.append(newPerson.asHTML());
    }
    $header.text("Lobby (" + people.length + "/" + maxPeople + ")");
  },
  
  remove(at) {
    $lobby.children(".person:nth-child(" + at + ")").remove();
    let person = people.splice(at, 1);
    $header.text("Lobby (" + people.length + "/" + maxPeople + ")");
    return person;
  },
  
  refresh() {
    $lobby.empty();
    
    for (let person of people) {
      $lobby.append(person.asHTML());
    }
  },
};