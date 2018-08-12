"use strict";

const attributes = require("../lib/attributes");
const lobby = require("../section/lobby");

const maxPassengers = 5;


function dragOver(ev) {
  let e = ev.originalEvent;
  if (typeof e.preventDefault === "function") {
    e.preventDefault();
  }
  
  e.dataTransfer.dropEffect = "move";
}

function dragEnter() {
  $(this).addClass("dragged-over");
}

function dragLeave() {
  $(this).removeClass("dragged-over");
}


module.exports = class Person {
  
  constructor() {
    this.attributes = attributes.random(1);
    this.passengers = [];
    
    this.$el = $("<div>", {
      class: "ship"
    });
  }
  
  addPassenger(person) {
    if (this.passengers.length >= maxPassengers) { return false; }
    this.passengers.push(person);
    
    return true;
  }
  
  setupDragTarget(redraw) {
    this.$el.on("dragover",  dragOver);
    this.$el.on("dragenter", dragEnter);
    this.$el.on("dragleave", dragLeave);
    
    let _this = this;
    this.$el.on("drop", function(ev) {
      let e = ev.originalEvent;
      if(e.preventDefault) { e.preventDefault(); }
      if(e.stopPropagation) { e.stopPropagation(); }
      
      $(".dragged-over").removeClass("dragged-over");
      
      let id = e.dataTransfer.getData("text/plain");
      let passenger = lobby.get(id);
      
      if (!_this.addPassenger(passenger)) {
        // Can't add passenger, probably full
        return;
      }
      
      lobby.remove(id);
      
      passenger.$el.data("removeOnDragEnd", true);
      passenger.$el.trigger("dragend");
      
      redraw();
    });
  }
  
  toHTML() {
    this.$el.empty();
    
    for (let p of this.passengers) {
      this.$el.append(p.toHTML());
    }
    for (var i = 0; i < maxPassengers - this.passengers.length; i++) {
      this.$el.append($("<div>", {class: "slot empty"}));
    }
    
    let $launchBtn = $("<button>", {class: "launch", text: "Launch!"});
    $launchBtn.click(this.launch.bind(this));
    
    if (this.passengers.length == 0) {
      $launchBtn.prop("disabled", true);
    }
    
    this.$el.append($launchBtn);
    
    return this.$el;
  }
  
  launch() {
    // TODO:
    console.log("Launching ship!", this.passengers);
  }
  
};