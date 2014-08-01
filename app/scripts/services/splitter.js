'use strict';


PhonicsApp.service('Splitter', function Splitter() {
  var sides = {
    left: { width: null, visible: false, hideListeners: [], showListeners: []},
    right: { width: null, visible: false, hideListeners: [], showListeners: []}
  };
  var that = this;

  this.toggle = function (side) {
    sides[side].visible = !sides[side].visible;
    if (!sides[side].visible) {
      that.hidePane(side);
    } else {
      that.showPane(side);
    }
  };

  this.registerSide = function (side, width, invisible) {
    sides[side].width = width;
    sides[side].visible = !invisible;
  };

  this.addHideListener = function (side, fn) {
    sides[side].hideListeners.push(fn);
  };

  this.addShowListener = function (side, fn) {
    sides[side].showListeners.push(fn);
  };

  this.hidePane = function (side) {
    sides[side].hideListeners.forEach(function (listener) {
      listener();
    });
  };

  this.showPane = function (side) {
     sides[side].showListeners.forEach(function (listener) {
      listener(sides[side].width);
    });
  };

  this.isVisible = function (side) {
    return sides[side].visible;
  };
});
