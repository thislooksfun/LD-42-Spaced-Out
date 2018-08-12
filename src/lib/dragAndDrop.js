"use strict";

var sources = [];
var targets = [];



const sourceActions = {
  dragStart(i, e) {
    $(this).addClass("dragging");
    
    let dt = e.originalEvent.dataTransfer;
    dt.effectAllowed = "move";
    dt.setData("text/plain", "" + i);
  },
  
  dragEnd() {
    $(this).removeClass("dragging");
    $(".launchpad").removeClass("dragged-over");
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

  drop(num, ev) {
    let e = ev.originalEvent;
    if(e.preventDefault) { e.preventDefault(); }
    if(e.stopPropagation) { e.stopPropagation(); }
    
    console.log("Dropped on " + num);
    
    let $el = sources[parseInt(e.dataTransfer.getData("text/plain"))];
    $(".launchpad:nth-child(" + (num + 1) + ")").append($el.detach());
    // TODO: Move things around!
    
    return false;
  }
};


function setupSource(i, $el) {
  $el.on("dragstart", function(e) {
    sourceActions.dragStart.call(this, i, e);
  });
  $el.on("dragend", sourceActions.dragEnd);
  
  sources.push($el);
}

function setupTarget(i, $el) {
  $el.on("dragover",  targetActions.dragOver);
  $el.on("dragenter", targetActions.dragEnter);
  $el.on("dragleave", targetActions.dragLeave);
  
  $el.on("drop", function(e) {
    targetActions.drop.call(this, i, e);
  });
}


module.exports = {
  
  addSource(el) {
    $(el).each(function() {
      let $el = $(this);
      setupSource(sources.length, $el);
      sources.push($el);
    });
  },
  
  addTarget(el) {
    $(el).each(function() {
      let $el = $(this);
      setupTarget(targets.length, $el);
      targets.push($el);
    });
  },
  
};