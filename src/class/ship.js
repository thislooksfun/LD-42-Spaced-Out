"use strict";

const attributes = require("../lib/attributes");
const bank = require("../section/bank");
const lobby = require("../section/lobby");
const score = require("../section/score");

const maxAttributes = 5;
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
  
  constructor(pad, redrawPad) {
    this.attributes = attributes.random(1);
    this.passengers = [];
    
    this._pad = pad;
    this._redrawPad = redrawPad;
    
    this.$el = $("<div>", {
      class: "ship"
    });
  }
  
  addPassenger(person) {
    if (this.passengers.length >= maxPassengers) { return false; }
    this.passengers.push(person);
    person.inShip = true;
    bank.earn(person.payout);
    
    if (this.passengers.length >= maxPassengers) {
      console.log("Full!");
      this.clearDragTarget();
    }
    
    this.redrawCapacity();
    this.$launchBtn.removeAttr("disabled");
    
    return true;
  }
  
  setupDragTarget() {
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
      
      _this.redrawContent();
    });
  }
  
  clearDragTarget() {
    console.log("Clearing drag targets...", this.$el);
    this.$el.off("dragover");
    this.$el.off("dragenter");
    this.$el.off("dragleave");
    this.$el.off("drop");
  }
  
  toHTML() {
    this.$el.empty();
    
    
    this.$attributes = $("<div>", {class: "attributes"});
    this.redrawAttributes();
    this.$el.append(this.$attributes);
    
    
    this.$content = $("<div>", {class: "content"});
    this.redrawContent();
    this.$el.append(this.$content);
    
    this.$el.append($("<div>", {class: "fade down"}));
    this.$el.append($("<div>", {class: "fade up"}));
    
    this.$launchBtn = $("<button>", {class: "launch", text: "Launch!"});
    this.$launchBtn.click(this.launch.bind(this));
    
    if (this.passengers.length == 0) {
      this.$launchBtn.prop("disabled", true);
    }
    
    this.$el.append(this.$launchBtn);
    
    this.$capacity = $("<span>", {class: "capacity", text: "??/??"});
    this.$el.append(this.$capacity);
    this.redrawCapacity();
    
    return this.$el;
  }
  
  redrawAttributes(paletteOpen = false) {
    this.$attributes.empty();
    
    this.$attributes.append($("<span>", {class: "desc", text: "Target planet attributes: "}));
    
    let $list = $("<div>", {class: "attr-list"});
    for (let a of this.attributes) {
      let $container = $("<div>", {class: "attr-container"});
      $container.append(attributes.buildElFrom(a));
      $list.append($container);
    }
    for (var i = 0; i < maxAttributes - this.attributes.length; i++) {
      $list.append($("<div>", {class: "attr-container"}));
    }
    this.$attributes.append($list);
    
    let $addBtn = $("<button>", {class: "add", text: "Add"});
    $addBtn.click(this.displayPalette.bind(this));
    
    if (paletteOpen) {
      this.displayPalette();
    }
    
    this.$attributes.append($addBtn);
  }
  
  displayPalette() {
    let _this = this;
    let $pal = attributes.buildPalette(this.attributes, function(name) {
      console.log("Clicked on attribute", name);
      _this.attributes.push(name);
      _this.redrawAttributes(true);
    });
    this.$attributes.append($pal);
  }
  
  redrawCapacity() {
    this.$capacity.text(this.passengers.length + "/" + maxPassengers);
  }
  
  redrawContent() {
    this.$content.empty();
    
    for (let p of this.passengers) {
      this.$content.append(p.toHTML());
    }
    for (var i = 0; i < maxPassengers - this.passengers.length; i++) {
      this.$content.append($("<div>", {class: "slot empty"}));
    }
  }
  
  hasAttr(a) {
    for (let at of this.attributes) {
      if (at === a) {
        return true;
      }
    }
    return false;
  }
  
  launch() {
    if (this.attributes.length < maxAttributes) {
      let missing = maxAttributes - this.attributes.length;
      let fromList = attributes.allExcept(this.attributes);
      let rand = attributes.random(missing, fromList);
      this.attributes = this.attributes.concat(rand);
    }
    
    console.log("Launching ship!", this);
    
    var bonuses = 0;
    var fines = 0;
    
    for (let p of this.passengers) {
      for (let d of p.desires) {
        if (this.hasAttr(d)) {
          bonuses += p.bonus;
        }
      }
      
      for (let n of p.needs) {
        if (!this.hasAttr(n)) {
          fines += p.fine;
        }
      }
    }
    
    // Process bonuses first just in case the fines would put the balance below zero.
    // For example: say the balance is $300, and we need to process $400 in fines and $700 in bonuses.
    // If we process the fines first, the balance would go to -$100, and the game would end before the +$700
    // in bonuses is added.
    // This way around we only trigger the end-game condition if the final sum is invalid.
    bank.earn(bonuses);
    bank.spend(fines);
    
    score.save(this.passengers.length);
    
    this._pad.ship = null;
    this._redrawPad();
  }
  
};