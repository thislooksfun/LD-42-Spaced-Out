"use strict";

const utils = require("./util");

const assetBasePath = "assets/attributes/icons/";
const ext = ".png";

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
    {name: "cats",        opts: [ "none" , "some"               ]},
    // {name: "clouds",      opts: [ "none" , "low", "med", "high" ]}, // missing: none, med, high
    {name: "desert",      opts: [ "none" , "some"               ]},
    {name: "grass",       opts: [ "none" , "low", "med", "high" ]},
    {name: "moons",       opts: [ "none" , "one", "two"         ]},
    // {name: "rain",        opts: [ "none" , "some"               ]}, // missing: none, some
    // {name: "rings",       opts: [ "none" , "some"               ]}, // missing: none
    {name: "size",        opts: [ "small", "large"              ]},
    // {name: "snow",        opts: [ "none" , "some"               ]}, // missing: none, some
    // {name: "storms",      opts: [ "none" , "some"               ]}, // missing: none, some
    // {name: "temperature", opts: [ "cold" , "moderate", "hot"    ]}, // mssing: moderate
    // {name: "trees",       opts: [ "none" , "some"               ]}, // missing: none
  ],
  
  buildElFrom(name) {
    return $("<img>", {
      src: assetBasePath + name + ext,
      alt: name,
      class: "icon attribute",
    });
  },
  
};