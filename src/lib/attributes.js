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
  
  buildPalette(currentAttrs, onSelect) {
    // Make a copy of the array
    var groups = this.groups.slice(this.groups);
    
    // Filter out any attrs that are already in the target list
    for (let a of currentAttrs) {
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
    
    
    let $container = $("<div>", {class: "attr-select"});
    let $groups = $("<div>", {class: "groups"});
    for (let g of groups) {
      let $group = $("<div>", {class: "group"});
      for (let o of g.opts) {
        let name = g.name + "." + o;
        let $opt = this.buildElFrom(name);
        $opt.addClass("clickable");
        $opt.click(function() {
          onSelect(name);
        });
        $group.append($opt);
      }
      $groups.append($group);
    }
    $container.append($groups);
    
    let $closeBtn = $("<button>", {class: "close", text: "Close"});
    $closeBtn.click(function() {
      $container.remove();
    });
    $container.append($closeBtn);
    
    
    return $container;
  },
  
  groups: [
    {name: "cats",        opts: [ "none" , "some"               ]},
    {name: "clouds",      opts: [ "none" , "low", "med", "high" ]},
    {name: "desert",      opts: [ "none" , "some"               ]},
    {name: "grass",       opts: [ "none" , "low", "med", "high" ]},
    {name: "moons",       opts: [ "none" , "one", "two"         ]},
    // {name: "rain",        opts: [ "none" , "some"               ]}, // missing: none, some
    {name: "rings",       opts: [ "none" , "some"               ]},
    {name: "size",        opts: [ "small", "large"              ]},
    // {name: "snow",        opts: [ "none" , "some"               ]}, // missing: none, some
    // {name: "storms",      opts: [ "none" , "some"               ]}, // missing: none, some
    {name: "temperature", opts: [ "cold" , "moderate", "hot"    ]},
    {name: "trees",       opts: [ "none" , "some"               ]},
  ],
  
  buildElFrom(name) {
    return $("<img>", {
      src: assetBasePath + name + ext,
      alt: name,
      title: name,  // Todo: try to prettify this?
      class: "icon attribute",
    });
  },
  
};