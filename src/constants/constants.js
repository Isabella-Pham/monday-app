const cursorCentered = false;

const ZOOM_SETTINGS = Object.freeze({
  DEFAULT: window.screen.width / 100
});

class Constants {
  static get cursorCentered() {
      return cursorCentered;
  }

  static get ZOOM_SETTINGS() {
    return ZOOM_SETTINGS;
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