const cursorCentered = false;

let gridEnabled = true;

const ZOOM_SETTINGS = Object.freeze({
  LIST: [
    window.screen.width / 40,
    window.screen.width / 60,
    window.screen.width / 80,
    window.screen.width / 100,
    window.screen.width / 125,
    window.screen.width / 150,
    window.screen.width / 175,
    window.screen.width / 200,
    window.screen.width / 300
  ],
  DEFAULT: 3
});

class WorkspaceSettings {
  constructor() {
    this.zoomIndex = ZOOM_SETTINGS.DEFAULT;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  getOffset() {
    return {
      x: this.offsetX,
      y: this.offsetY
    };
  }

  setOffset(x, y) {
    this.offsetX = x;
    this.offsetY = y;
  }

  canInc() {
    return this.zoomIndex - 1 > -1;
  }

  canDec() {
    return this.zoomIndex + 1 < ZOOM_SETTINGS.LIST.length;
  }

  /*
    increase zoom index if possible
    returns zoom settings prior to any changes
  */
  decZoom() {
    let oldZoom = this.getZoom();
    if (this.canDec()) {
      this.zoomIndex++;
    }
    return oldZoom;
  }

  /*
    decreases zoom index if possible
    returns zoom settings prior to any changes
  */
  incZoom() {
    let oldZoom = this.getZoom();
    if (this.canInc()) {
      this.zoomIndex--;
    }
    return oldZoom;
  }

  getZoom() {
    return ZOOM_SETTINGS.LIST[this.zoomIndex];
  }

  getDefaultZoom() {
    return ZOOM_SETTINGS.LIST[ZOOM_SETTINGS.DEFAULT];
  }
}

class Constants {
  static WORKSPACE_SETTINGS = new WorkspaceSettings();

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
    return Constants.WORKSPACE_SETTINGS.getZoom();
  }

  static get DEFAULT_ZOOM() {
    return Constants.WORKSPACE_SETTINGS.getDefaultZoom();
  }

  static getClosestPosition(x, y) {
    let dimension = Constants.ZOOM_SETTINGS;
    let closeX = x + dimension / 2;
    closeX -= closeX % dimension;
    let closeY = y + dimension / 2;
    closeY -= closeY % dimension;
    let offset = Constants.WORKSPACE_SETTINGS.getOffset();
    return {
      x: closeX + (offset.x % dimension),
      y: closeY + (offset.y % dimension)
    };
  }

  static getGridCoord(val, dimension, offset) {
    return ((val - (Constants.cursorCentered ? dimension / 2 : 0)) - offset) / Constants.ZOOM_SETTINGS;
  }

  static setGridOffset(x, y) {
    Constants.WORKSPACE_SETTINGS.setOffset(x, y);
  }
  static getGridOffset() {
    return Constants.WORKSPACE_SETTINGS.getOffset();
  }

  static isLeftClick(event) {
    if ('which' in event) {
      return event.which === 1;
    }
    else if ('type' in event) {
      return event.type === 'click';
    }
    else if ('button' in event) {
      return event.button === 0;
    }
  }

  static isRightClick(event) {
    if ('which' in event) {
      return event.which === 3;
    }
    else if ('type' in event) {
      return event.type === 'contextmenu';
    }
    else if ('button' in event) {
      return event.button === 2;
    }
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