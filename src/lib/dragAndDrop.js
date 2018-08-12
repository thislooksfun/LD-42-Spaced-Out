"use strict";

const uuid = require("../lib/util").uuidv4;

var sources = {};
var targets = {};



const sourceActions = {
  dragStart(key, e) {
    $(this).addClass("dragging");
    
    let dt = e.originalEvent.dataTransfer;
    dt.effectAllowed = "move";
    dt.setData("text/plain", key);
  },
  
  dragEnd(key) {
    let $this = $(this);
    $this.removeClass("dragging");
    $(".launchpad").removeClass("dragged-over");
    
    if ($this.data("removeOnDragEnd")) {
      remove(key);
    }
  }
};


const targetActions = {
  dragOver(ev) {
    let e = ev.originalEvent;
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    
    // TODO
  },

  dragEnter() {
    $(this).addClass("dragged-over");
  },

  dragLeave() {
    $(this).removeClass("dragged-over");
  },

  drop(key, ev, sticky) {
    let e = ev.originalEvent;
    if(e.preventDefault) { e.preventDefault(); }
    if(e.stopPropagation) { e.stopPropagation(); }
    
    let sourceKey = e.dataTransfer.getData("text/plain");
    let $el = sources[sourceKey];
    $(this).append($el.detach());
    
    if (sticky) {
      // Don't let it leave!
      $el.data("removeOnDragEnd", true);
    }
    
    return false;
  }
};


function setupSource(key, $el) {
  $el.on("dragstart", function(e) {
    sourceActions.dragStart.call(this, key, e);
  });
  $el.on("dragend", function(e) {
    sourceActions.dragEnd.call(this, key, e);
  });
}

function setupTarget(key, $el, opts) {
  opts = opts || {};
  
  $el.on("dragover",  targetActions.dragOver);
  $el.on("dragenter", targetActions.dragEnter);
  $el.on("dragleave", targetActions.dragLeave);
  
  $el.on("drop", function(e) {
    targetActions.drop.call(this, key, e, opts.sticky);
  });
}


function remove(key) {
  
  if (sources[key] != null) {
    let $el = sources[key];
    delete sources[key];
    // Trigger "dragend", just in case
    $el.trigger("dragend");
    
    $el.off("dragstart");
    $el.off("dragend");
    $el.removeAttr("draggable");
  } else if (targets[key] != null) {
    let $el = targets[key];
    delete targets[key];
    $el.off("dragover");
    $el.off("dragenter");
    $el.off("dragleave");
    $el.off("drag");
  }
  
}


module.exports = {
  addSource(el) {
    $(el).each(function() {
      let $el = $(this);
      let key = uuid();
      $el.attr("draggable", true);
      sources[key] = $el;
      setupSource(key, $el);
    });
  },
  
  addTarget(el, opts) {
    $(el).each(function() {
      let $el = $(this);
      let key = uuid();
      targets[key] = $el;
      setupTarget(key, $el, opts);
    });
  },
};