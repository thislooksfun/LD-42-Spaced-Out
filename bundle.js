(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

const attributes = require("../lib/attributes");
const util = require("../lib/util");
const diffScale = require("../section/score").diffScale;

const maxAttributes = 5;

const moneyScale = 10;
const payoutMin = 500;
const fineMin = 50;
const bonusMin = 25;

function dragStart(e, id) {
  $(this).addClass("dragging");

  let dt = e.originalEvent.dataTransfer;
  dt.effectAllowed = "move";
  dt.setData("text/plain", id);
}

function dragEnd() {
  let $el = $(this);
  $el.removeClass("dragging");
  $(".launchpad").removeClass("dragged-over");

  if ($el.data("removeOnDragEnd")) {
    $el.off("dragstart");
    $el.off("dragend");
    $el.removeAttr("draggable");
  }
}

module.exports = class Person {

  constructor() {
    this.id = util.uuidv4();

    let scaledAttrMax = Math.floor(1 + (maxAttributes - 1) * diffScale());
    let max = Math.min(scaledAttrMax, maxAttributes);

    this.needs = attributes.random(util.rand(max));
    this.desires = attributes.random(util.rand(max), this.needs.unused);
    this.inShip = false;

    // Subtract one so that the max is `payoutMin + (payoutMin * (moneyScale-1)) = payoutMin * moneyScale`
    // rather than `payoutMin + (payoutMin * moneyScale)`
    let ms = moneyScale - 1;
    this.payout = payoutMin + util.rand(Math.floor(ms * payoutMin * this.needs.length / maxAttributes));
    this.fine = payoutMin + util.rand(Math.floor(ms * fineMin * this.needs.length / maxAttributes));
    this.bonus = payoutMin + util.rand(Math.floor(ms * bonusMin * this.desires.length / maxAttributes));

    this.$el = $("<div>", { class: "person" });
  }

  setupDragging() {
    let id = this.id;
    this.$el.on("dragstart", function (e) {
      dragStart.call(this, e, id);
    });
    this.$el.on("dragend", dragEnd);
    this.$el.attr("draggable", true);
  }

  toHTML() {
    this.$el.empty();

    let $needs = $("<div>", {
      class: "needs"
    });
    if (this.needs.length === 0) {
      $needs.append($("<span>", { text: "-- no needs --" }));
    } else {
      for (let req of this.needs) {
        $needs.append($("<span>", { text: req }));
      }
    }
    this.$el.append($needs);

    let $desires = $("<div>", {
      class: "desires"
    });
    if (this.desires.length === 0) {
      $desires.append($("<span>", { text: "-- no desires --" }));
    } else {
      for (let req of this.desires) {
        $desires.append($("<span>", { text: req }));
      }
    }
    this.$el.append($desires);

    let $money = $("<div>", {
      class: "money"
    });
    if (!this.inShip) {
      $money.append($("<span>", { class: "payout", text: "Payout: $" + util.prettyPrint(this.payout) }));
    }
    let $fine = $("<span>", { class: "fine", text: "Fine: $" + util.prettyPrint(this.fine) });
    if (this.needs.length === 0) {
      $fine.addClass("na");
      $fine.text("Fine: N/A");
    }
    let $bonus = $("<span>", { class: "bonus", text: "Bonus: $" + util.prettyPrint(this.bonus) });
    if (this.desires.length === 0) {
      $bonus.addClass("na");
      $bonus.text("Bonus: N/A");
    }
    $money.append($fine, $bonus);
    this.$el.append($money);

    console.log(this.id + " -- payout: $" + this.payout + "; fine: $" + this.fine + "; bonus: $" + this.bonus);

    return this.$el;
  }
};

},{"../lib/attributes":4,"../lib/util":5,"../section/score":10}],2:[function(require,module,exports){
"use strict";

const attributes = require("../lib/attributes");
const lobby = require("../section/lobby");
const bank = require("../section/bank");

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

  constructor(pad, redraw) {
    this.attributes = attributes.random(1);
    this.passengers = [];

    this._pad = pad;
    this._redraw = redraw;

    this.$el = $("<div>", {
      class: "ship"
    });
  }

  addPassenger(person) {
    if (this.passengers.length >= maxPassengers) {
      return false;
    }
    this.passengers.push(person);
    person.inShip = true;
    bank.earn(person.payout);

    return true;
  }

  setupDragTarget() {
    this.$el.on("dragover", dragOver);
    this.$el.on("dragenter", dragEnter);
    this.$el.on("dragleave", dragLeave);

    let _this = this;
    this.$el.on("drop", function (ev) {
      let e = ev.originalEvent;
      if (e.preventDefault) {
        e.preventDefault();
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }

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

      _this._redraw();
    });
  }

  toHTML() {
    this.$el.empty();

    for (let p of this.passengers) {
      this.$el.append(p.toHTML());
    }
    for (var i = 0; i < maxPassengers - this.passengers.length; i++) {
      this.$el.append($("<div>", { class: "slot empty" }));
    }

    let $launchBtn = $("<button>", { class: "launch", text: "Launch!" });
    $launchBtn.click(this.launch.bind(this));

    if (this.passengers.length == 0) {
      $launchBtn.prop("disabled", true);
    }

    this.$el.append($launchBtn);

    return this.$el;
  }

  launch() {
    console.log("Launching ship!", this.passengers);

    // TODO: Handle fines and bonuses


    this._pad.ship = null;
    this._redraw();
  }

};

},{"../lib/attributes":4,"../section/bank":7,"../section/lobby":9}],3:[function(require,module,exports){
"use strict";

var sections = [require("./section/bank"), require("./section/launchpads"), require("./section/lobby"), require("./section/score"), require("./section/spaceOnEarth")];

function setup() {
  for (let s of sections) {
    if (typeof s.setup === "function") {
      s.setup();
    }
  }
}

function start() {
  for (let s of sections) {
    if (typeof s.start === "function") {
      s.start();
    }
  }
}

module.exports = {
  begin() {
    setup();
    start();
  },

  end(reason) {
    console.log("Ending game -- reason: " + reason);
    for (let s of sections) {
      if (typeof s.teardown === "function") {
        s.teardown();
      }
    }

    // TODO: Display end-of-game screen
  }
};

},{"./section/bank":7,"./section/launchpads":8,"./section/lobby":9,"./section/score":10,"./section/spaceOnEarth":11}],4:[function(require,module,exports){
"use strict";

const utils = require("./util");

module.exports = {
  random(count = 5, list = null) {
    var out = [];
    if (list == null) {
      // Make a copy of the array
      list = this.list.slice(this.list);
    }

    while (count > 0 && list.length > 0) {
      let index = utils.rand(list.length - 1);
      out.push(list[index]);
      list.splice(index, 1);
      count--;
    }

    out.unused = list;
    return out;
  },

  list: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
};

},{"./util":5}],5:[function(require,module,exports){
"use strict";

module.exports = {
  rand(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
  },

  prettyPrint(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

},{}],6:[function(require,module,exports){
(function (global){
"use strict";

$(function () {
  let start = Date.now();
  global.runningTime = function () {
    return Date.now() - start;
  };

  // TODO: make a "start" button?
  require("./game").begin();
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./game":3}],7:[function(require,module,exports){
"use strict";

const game = require("../game");
const prettyPrint = require("../lib/util").prettyPrint;

const startingMoney = 100000;

var money = -1;
let $balance = $("#balance");
function redraw() {
  $balance.text("$" + prettyPrint(money));
}

module.exports = {

  setup() {
    money = startingMoney;
    redraw();
  },

  canSpend(amt) {
    return money >= amt;
  },

  spend(cost) {
    if (cost < 0) {
      return this.earn(-cost);
    }
    money -= cost;
    if (money < 0) {
      game.end("Out of money!");
    }
    redraw();
  },

  earn(amount) {
    if (amount < 0) {
      return this.spend(-amount);
    }
    money += amount;
    redraw();
  }
};

},{"../game":3,"../lib/util":5}],8:[function(require,module,exports){
"use strict";

const Ship = require("../class/ship");
const prettyPrint = require("../lib/util").prettyPrint;
const bank = require("./bank");

// const buildTimeInSeconds = 5;

const priceToBuildShip = 5000;
const priceToBuyPad = 10000;

let pad1 = { ship: null, bought: true, $el: $("#pad1"), $content: $("#pad1 .content") };
let pad2 = { ship: null, bought: false, $el: $("#pad2"), $content: $("#pad2 .content") };
let pad3 = { ship: null, bought: false, $el: $("#pad3"), $content: $("#pad3 .content") };

module.exports = {

  setup() {
    // TODO: ?
  },

  start() {
    pad1.ship = new Ship(pad1, this.redraw.bind(this, pad1));

    this.redraw(pad1);
    this.redraw(pad2);
    this.redraw(pad3);
  },

  // startBuild() {
  //   if (this.ships.count < this.maxShips) {
  //     this.ships.push(new Ship());
  //   }
  //   setTimeout(this.deliverShip.bind(this), buildTimeInSeconds * 1000);
  //   console.log("Started building ship!");
  // },

  redraw(pad) {
    pad.$content.empty();
    if (pad.ship != null) {
      pad.$el.removeClass("locked empty");
      pad.$content.append(pad.ship.toHTML());
      pad.ship.setupDragTarget();
    } else if (pad.bought) {
      pad.$el.removeClass("locked");
      pad.$el.addClass("empty");

      pad.$content.append($("<h2>", { text: "Empty" }));
      let buildBtn = $("<button>", { class: "build", text: "Build ($" + prettyPrint(priceToBuildShip) + ")" });
      let _this = this;
      buildBtn.click(function () {
        if (!bank.canSpend(priceToBuildShip)) {
          // TODO: Visualize that it failed becaue of money
          // Maybe flash balance?
          return;
        }
        bank.spend(priceToBuildShip);

        pad.ship = new Ship(pad, _this.redraw.bind(_this, pad));
        _this.redraw(pad);
      });
      pad.$content.append(buildBtn);
    } else {
      pad.$el.removeClass("empty");
      pad.$el.addClass("locked");

      pad.$content.append($("<h2>", { text: "Locked" }));
      let buyBtn = $("<button>", { class: "unlock", text: "Unlock ($" + prettyPrint(priceToBuyPad) + ")" });
      let _this = this;
      buyBtn.click(function () {
        if (!bank.canSpend(priceToBuyPad)) {
          // TODO: Visualize that it failed becaue of money
          // Maybe flash balance?
          return;
        }
        bank.spend(priceToBuyPad);

        pad.bought = true;
        _this.redraw(pad);
      });
      pad.$content.append(buyBtn);
    }
  },

  deliverShip() {
    $(".ship").addClass("built");
    console.log("Ship has been delivered!");
  }
};

},{"../class/ship":2,"../lib/util":5,"./bank":7}],9:[function(require,module,exports){
"use strict";

const Person = require("../class/person");

const newPersonInterval = 2.5;
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
  }
};

},{"../class/person":1}],10:[function(require,module,exports){
"use strict";

const prettyPrint = require("../lib/util").prettyPrint;

// How many people you have to save to get the hardest difficulty
const hardestDifficultyAt = 100;

var saved = -1;
let $saved = $("#saved");
function redraw() {
  $saved.text(prettyPrint(saved) + " " + (saved === 1 ? "person" : "people"));
}

module.exports = {

  setup() {
    saved = 0;
    redraw();
  },

  save(count) {
    saved += count;
    redraw();
  },

  // Starts at '0' (easiest), and goes to '1' (hardest) over the course of the game
  diffScale() {
    return Math.min(saved / hardestDifficultyAt, 1);
  }

};

},{"../lib/util":5}],11:[function(require,module,exports){
"use strict";

const secondsBetweenDecrement = 2;
var space = 100;
// var space = 10;

module.exports = {

  setup() {
    // TODO
  },

  start() {
    this.refresh();

    this._timer = setInterval(this.decrement.bind(this), secondsBetweenDecrement * 1000);
  },

  teardown() {
    clearInterval(this._timer);
  },

  decrement() {
    space--;

    // TODO: Check for 'space' reaching 0, then end the game
    if (space <= 0) {
      require("../game").end("Out of space!");
    }

    this.refresh();
  },

  refresh() {
    $("#room-left").text(space);
  }
};

},{"../game":3}]},{},[6])

//# sourceMappingURL=maps/bundle.js.map
