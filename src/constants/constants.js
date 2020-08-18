import React from 'react';

const cursorCentered = true;

class Constants {

  static get cursorCentered() {
      return cursorCentered;
  }

  // TODO: Change to relative percentage
  static viewportToPixels(value) {
    var parts = value.match(/([0-9.]+)(vh|vw)/)
    var q = Number(parts[1])
    var side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]]
    return side * (q / 100)
  }
}

export default Constants;