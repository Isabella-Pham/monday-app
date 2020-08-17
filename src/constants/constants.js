import mondaySdk from "monday-sdk-js";

const cursorCentered = false;
const monday = mondaySdk();

monday.setToken(process.env.REACT_APP_MONDAY_TOKEN);

class Constants {

  static get cursorCentered() {
      return cursorCentered;
  }

  static get monday() {
    return monday;
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