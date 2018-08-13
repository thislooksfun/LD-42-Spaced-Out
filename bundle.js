(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

const attributes = require("../lib/attributes");
const util = require("../lib/util");
const diffScale = require("../section/score").diffScale;

const maxAttributes = 4;

const moneyScale = 5;
const payoutMin = 1000;
const fineMin = 1500;
const bonusMin = 1000;

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
    this.fine = fineMin + util.rand(Math.floor(ms * fineMin * this.needs.length / maxAttributes));
    this.bonus = bonusMin + util.rand(Math.floor(ms * bonusMin * this.desires.length / maxAttributes));

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

    /** Needs **/

    let $needs = $("<div>", {
      class: "needs"
    });
    $needs.append($("<span>", { text: "Needs" }));
    let $needsList = $("<div>", { class: "icon-list" });
    for (let req of this.needs) {
      $needsList.append(attributes.buildElFrom(req));
    }
    $needs.append($needsList);

    let $fine = $("<div>", { class: "fine" });
    $fine.append($("<span>", { text: "Fine:" }));
    let $fineTxt = $("<span>", { class: "price cost", text: "-$" + util.prettyPrint(this.fine) + "/item" });
    if (this.needs.length === 0) {
      $fine.addClass("na");
      $fineTxt.text("N/A");
    }
    $fine.append($fineTxt);
    $needs.append($fine);

    this.$el.append($needs);

    /** Desires **/

    let $desires = $("<div>", {
      class: "desires"
    });
    $desires.append($("<span>", { text: "Desires" }));
    let $desiresList = $("<div>", { class: "icon-list" });
    for (let des of this.desires) {
      $desiresList.append(attributes.buildElFrom(des));
    }
    $desires.append($desiresList);

    let $bonus = $("<div>", { class: "bonus" });
    $bonus.append($("<span>", { text: "Bonus:" }));
    let $bonusTxt = $("<span>", { class: "price earn", text: "+$" + util.prettyPrint(this.bonus) + "/item" });
    if (this.desires.length === 0) {
      $bonus.addClass("na");
      $bonusTxt.text("N/A");
    }
    $bonus.append($bonusTxt);
    $desires.append($bonus);

    this.$el.append($desires);

    /** Face + ticket price **/

    let $bottom = $("<div>", {
      class: "face-and-ticket"
    });

    let $face = $("<img>", {
      src: "assets/img/person.png",
      alt: "face",
      class: "icon face"
    });
    $bottom.append($face);

    let $ticket = $("<div>", {
      class: "ticket"
    });
    let $ticketInner = $("<span>", { text: "Ticket: " });
    $ticketInner.append($("<span>", { class: "price earn", text: "+$" + util.prettyPrint(this.payout) }));
    $ticket.append($ticketInner);
    $bottom.append($ticket);

    this.$el.append($bottom);

    return this.$el;
  }
};

},{"../lib/attributes":4,"../lib/util":5,"../section/score":10}],2:[function(require,module,exports){
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
    if (this.passengers.length >= maxPassengers) {
      return false;
    }
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

    this.$attributes = $("<div>", { class: "attributes" });
    this.redrawAttributes();
    this.$el.append(this.$attributes);

    this.$content = $("<div>", { class: "content" });
    this.redrawContent();
    this.$el.append(this.$content);

    this.$el.append($("<div>", { class: "fade down" }));
    this.$el.append($("<div>", { class: "fade up" }));

    this.$launchBtn = $("<button>", { class: "launch", text: "Find Planet" });
    this.$launchBtn.click(this.launch.bind(this));

    this.redrawLaunchBtn();

    this.$el.append(this.$launchBtn);

    this.$capacity = $("<span>", { class: "capacity", text: "??/??" });
    this.$el.append(this.$capacity);
    this.redrawCapacity();

    return this.$el;
  }

  redrawAttributes(paletteOpen = false) {
    this.$attributes.empty();

    this.$attributes.append($("<span>", { class: "desc", text: "Target planet attributes: " }));

    let $list = $("<div>", { class: "attr-list" });
    for (let a of this.attributes) {
      let $container = $("<div>", { class: "attr-container" });
      $container.append(attributes.buildElFrom(a));
      $list.append($container);
    }
    for (var i = 0; i < maxAttributes - this.attributes.length; i++) {
      $list.append($("<div>", { class: "attr-container" }));
    }
    this.$attributes.append($list);

    let $addBtn = $("<button>", { class: "add", text: "Add" });
    $addBtn.click(this.displayPalette.bind(this));

    if (paletteOpen) {
      this.displayPalette();
    }

    this.$attributes.append($addBtn);

    if (this.$launchBtn != null) {
      this.redrawLaunchBtn();
    }
  }

  displayPalette() {
    let _this = this;
    let $pal = attributes.buildPalette(this.attributes, function (name) {
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
      this.$content.append($("<div>", { class: "slot empty" }));
    }
  }

  redrawLaunchBtn() {
    if (this.attributes.length < maxAttributes) {
      this.$launchBtn.text("Find Planet");
      this.$launchBtn.removeAttr("disabled");
    } else {
      this.$launchBtn.text("Launch!");

      if (this.passengers.length > 0) {
        this.$launchBtn.removeAttr("disabled");
      } else {
        this.$launchBtn.attr("disabled", true);
      }
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

  findPlanet() {
    let missing = maxAttributes - this.attributes.length;
    let fromList = attributes.allExcept(this.attributes);
    let rand = attributes.random(missing, fromList);
    this.attributes = this.attributes.concat(rand);

    this.redrawAttributes();
  }

  launch() {
    if (this.attributes.length < maxAttributes) {
      this.findPlanet();
      return;
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

},{"../lib/attributes":4,"../section/bank":7,"../section/lobby":9,"../section/score":10}],3:[function(require,module,exports){
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

var $overlay = $("<div>", { class: "overlay" });
var $overlayContainer = $("<div>", { class: "container" });
$overlay.append($overlayContainer);

module.exports = {
  begin() {
    $overlayContainer.empty();
    $overlayContainer.append($("<h1>", { text: "Spaced Out" }));
    $overlayContainer.append($("<span>", { text: "v" + (window.game_version || ".dev") }));
    let $startBtn = $("<button>", { text: "Start Game" });
    $startBtn.click(function () {
      $overlay.detach();
      setup();
      start();
    });
    $overlayContainer.append($startBtn);

    $("body").append($overlay);
  },

  end(reason) {
    console.log("Ending game -- reason: " + reason);
    for (let s of sections) {
      if (typeof s.teardown === "function") {
        s.teardown();
      }
    }

    $overlayContainer.empty();
    $overlayContainer.append($("<h1>", { text: "Game Over" }));
    let score = require("./section/score").format();
    $overlayContainer.append($("<span>", { text: reason }));
    $overlayContainer.append($("<span>", { text: "But hey, at least you saved " + score + "." }));
    let $startBtn = $("<button>", { text: "Retry?" });
    $startBtn.click(function () {
      $overlay.detach();
      setup();
      start();
    });
    $overlayContainer.append($startBtn);

    $("body").append($overlay);
  }
};

},{"./section/bank":7,"./section/launchpads":8,"./section/lobby":9,"./section/score":10,"./section/spaceOnEarth":11}],4:[function(require,module,exports){
"use strict";

const utils = require("./util");

const assetBasePath = "assets/attributes/icons/";
const ext = ".png";

module.exports = {
  random(count = 5, fromList = null) {
    var out = [];
    let tmp = fromList || this.groups;
    // Make a copy of the array
    var list = tmp.slice();

    while (count > 0 && list.length > 0) {
      let index = utils.rand(list.length - 1);
      let entry = list[index];
      let opt = entry.opts[utils.rand(entry.opts.length - 1)];
      out.push(entry.name + "." + opt);
      list.splice(index, 1);
      count--;
    }

    out.unused = list;
    return out;
  },

  allExcept(list) {
    // Make a copy of the array
    console.log(this.groups);
    var groups = this.groups.slice(this.groups);

    // Filter out any attrs that are already in the target list
    for (let a of list) {
      let parts = a.split(".");

      var i = 0;
      while (i < groups.length) {
        if (groups[i].name === parts[0]) {
          groups.splice(i, 1);
          continue;
        }
        i++;
      }
    }
    console.log(this.groups);
    return groups;
  },

  buildPalette(currentAttrs, onSelect) {
    let groups = this.allExcept(currentAttrs);

    let $container = $("<div>", { class: "attr-select" });
    let $groups = $("<div>", { class: "groups" });
    for (let g of groups) {
      let $group = $("<div>", { class: "group" });
      for (let o of g.opts) {
        let name = g.name + "." + o;
        let $opt = this.buildElFrom(name);
        $opt.addClass("clickable");
        $opt.click(function () {
          onSelect(name);
        });
        $group.append($opt);
      }
      $groups.append($group);
    }
    $container.append($groups);

    let $closeBtn = $("<button>", { class: "close", text: "Close" });
    $closeBtn.click(function () {
      $container.remove();
    });
    $container.append($closeBtn);

    return $container;
  },

  groups: [{ name: "cats", opts: ["none", "some"] }, { name: "clouds", opts: ["none", "low", "med", "high"] }, { name: "desert", opts: ["none", "some"] }, { name: "grass", opts: ["none", "low", "med", "high"] }, { name: "moons", opts: ["none", "one", "two"] },
  // {name: "rain",        opts: [ "none" , "some"               ]}, // missing: none, some
  { name: "rings", opts: ["none", "some"] }, { name: "size", opts: ["small", "large"] },
  // {name: "snow",        opts: [ "none" , "some"               ]}, // missing: none, some
  // {name: "storms",      opts: [ "none" , "some"               ]}, // missing: none, some
  { name: "temperature", opts: ["cold", "moderate", "hot"] }, { name: "trees", opts: ["none", "some"] }],

  buildElFrom(name) {
    return $("<img>", {
      src: assetBasePath + name + ext,
      alt: name,
      title: name, // Todo: try to prettify this?
      class: "icon attribute"
    });
  }

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

  require("./game").begin();
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./game":3}],7:[function(require,module,exports){
"use strict";

const prettyPrint = require("../lib/util").prettyPrint;

const startingMoney = 100000;

var money = -1;
let $bank = $("#bank");
let $balance = $("#balance");
function redraw() {
  $balance.text("$" + prettyPrint(money));
}

const timeBetweenFlows = 250;
var lastFlow = 0;
var queue = [];
function queueCashflow($el) {
  queue.push($el);

  if (queue.length === 1) {
    let timeSinceLastFlow = Date.now() - lastFlow;
    if (timeSinceLastFlow >= timeBetweenFlows) {
      animateCashflow(queue.shift());
    } else {
      setTimeout(function () {
        animateCashflow(queue.shift());
      }, timeBetweenFlows - timeSinceLastFlow);
    }
  }
}
function animateCashflow($el) {
  lastFlow = Date.now();

  $bank.append($el);
  setTimeout(function () {

    setTimeout(function () {
      if (queue.length > 0) {
        animateCashflow(queue.shift());
      }
    }, timeBetweenFlows);

    $el.addClass("animate");
    setTimeout(function () {
      $el.remove();
    }, 1250);
  }, 50);
}

module.exports = {

  setup() {
    money = startingMoney;
    redraw();
  },

  canSpend(amt) {
    let res = money >= amt;
    if (!res) {
      $balance.addClass("flash");
      setTimeout(function () {
        $balance.removeClass("flash");
      }, 600);
    }
    return res;
  },

  spend(cost) {
    if (cost == 0) {
      return;
    }
    if (cost < 0) {
      return this.earn(-cost);
    }
    money -= cost;
    if (money < 0) {
      require("../game").end("You, the last commercial space flight company have run out of money. Thus, the no one can leave the planet and it has run out of space.");
    }

    queueCashflow($("<span>", {
      class: "cashflow out",
      text: "-$" + prettyPrint(cost)
    }));

    redraw();
  },

  earn(amount) {
    if (amount == 0) {
      return;
    }
    if (amount < 0) {
      return this.spend(-amount);
    }

    queueCashflow($("<span>", {
      class: "cashflow in",
      text: "+$" + prettyPrint(amount)
    }));

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
const priceToBuyPad = 75000;

let pad1;
let pad2;
let pad3;

module.exports = {

  setup() {
    pad1 = { ship: null, bought: true, $el: $("#pad1"), $pad: $("#pad1 .pad") };
    pad2 = { ship: null, bought: false, $el: $("#pad2"), $pad: $("#pad2 .pad") };
    pad3 = { ship: null, bought: false, $el: $("#pad3"), $pad: $("#pad3 .pad") };
  },

  start() {
    pad1.ship = new Ship(pad1, this.redraw.bind(this, pad1));

    this.redraw(pad1);
    this.redraw(pad2);
    this.redraw(pad3);
  },

  redraw(pad) {
    pad.$pad.empty();
    if (pad.ship != null) {
      pad.$el.removeClass("locked empty");
      pad.$pad.append(pad.ship.toHTML());
      pad.ship.setupDragTarget();
    } else if (pad.bought) {
      pad.$el.removeClass("locked");
      pad.$el.addClass("empty");

      pad.$pad.append($("<h2>", { text: "Empty" }));
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
      pad.$pad.append(buildBtn);
    } else {
      pad.$el.removeClass("empty");
      pad.$el.addClass("locked");

      pad.$pad.append($("<h2>", { text: "Locked" }));
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
      pad.$pad.append(buyBtn);
    }

    this.ensureCanBuild();
  },

  ensureCanBuild() {
    if (pad1.ship == null && pad2.ship == null && pad3.ship == null && !bank.canSpend(priceToBuildShip)) {
      // We have no ships, and not enough money to build another one
      require("../game").end("You, the last commercial space flight company have do not have enough money to build another ship. Thus, the no one can leave the planet and it has run out of space.");
    }
  },

  deliverShip() {
    $(".ship").addClass("built");
    console.log("Ship has been delivered!");
  }
};

},{"../class/ship":2,"../game":3,"../lib/util":5,"./bank":7}],9:[function(require,module,exports){
"use strict";

const Person = require("../class/person");

const numberOfPeople = 5;

var people = {};

let $lobby = $("#lobby .content");

module.exports = {
  setup() {
    people = {};
    $lobby.empty();
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
  }
};

},{"../class/person":1}],10:[function(require,module,exports){
"use strict";

const prettyPrint = require("../lib/util").prettyPrint;
const soe = require("./spaceOnEarth");

// How many people you have to save to get the hardest difficulty
const hardestDifficultyAt = 50;

var saved = -1;
let $saved = $("#saved");
function redraw() {
  $saved.text(format());
}

function format() {
  return prettyPrint(saved) + " " + (saved === 1 ? "person" : "people");
}

module.exports = {

  setup() {
    saved = 0;
    redraw();
  },

  format: format,

  save(count) {
    saved += count;
    redraw();

    soe.add(count);
  },

  // Starts at '0' (easiest), and goes to '1' (hardest) over the course of the game
  diffScale() {
    return Math.min(saved / hardestDifficultyAt, 1);
  }

};

},{"../lib/util":5,"./spaceOnEarth":11}],11:[function(require,module,exports){
"use strict";

const secondsBetweenDecrement = 3;
const startingSpace = 100;

var space = -1;

module.exports = {

  setup() {
    space = startingSpace;
  },

  start() {
    this.redraw();

    this._timer = setInterval(this.decrement.bind(this), secondsBetweenDecrement * 1000);
  },

  teardown() {
    clearInterval(this._timer);
  },

  decrement() {
    space--;

    if (space <= 0) {
      require("../game").end("The Earth has run out of space.");
    }

    this.redraw();
  },

  add(count) {
    space += count;
    this.redraw();
  },

  redraw() {
    $("#room-left").text(space);
  }
};

},{"../game":3}]},{},[6])

//# sourceMappingURL=maps/bundle.js.map
