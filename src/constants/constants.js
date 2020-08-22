const cursorCentered = true;

let gridEnabled = true;

const ZOOM_SETTINGS = Object.freeze({
  DEFAULT: window.screen.width / 100
});

class Constants {
  static get cursorCentered() {
    return cursorCentered;
  }

  static get gridEnabled() {
    return gridEnabled;
  }

  static gridToggle() {
    gridEnabled = !gridEnabled;
    
    return gridEnabled;
  }

  static get ZOOM_SETTINGS() {
    return ZOOM_SETTINGS;
  }

  static getClosestCoord(x, y, dimension) {
    let closeX = x + dimension / 2;
    closeX -= closeX % dimension;
    let closeY = y + dimension / 2;
    closeY -= closeY % dimension;
    return {
      x: closeX,
      y: closeY
    };
  }

  static getUniqueReactKey() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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