"use strict";

const utils = require("./util");

module.exports = {
  random(count = 5, list = null) {
    var out = [];
    if (list == null) {
      // Make a copy of the array
      list = this.groups.slice(this.groups);
    }
    
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
  
  groups: [
    {name: "clouds", opts: [ "none", "low", "med", "high" ]},
    {name: "grass",  opts: [ "none", "low", "med", "high" ]},
    {name: "desert", opts: [ "none", "some" ]},
    {name: "cats",   opts: [ "none", "some" ]},
    {name: "temperature", opts: [ "cold", "moderate", "hot" ]},
    {name: "snow", opts: [ "none", "some" ]},
    {name: "rain", opts: [ "none", "some" ]},
    {name: "storms", opts: [ "none", "some" ]},
    {name: "moons", opts: [ "none", "one", "two" ]},
    {name: "rings", opts: [ "none", "some" ]},
    {name: "planet-size", opts: [ "small", "large" ]},
  ],
  
};