const CURSOR_CENTERED = true;
const ROUND_DECIMALS = 4;
const MIN_MULTIPLIER = 0.25;
const MIN_GRID = 10;
const MAX_GRID = 1000;
const NOT_FOUND_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAABBlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPHhtcE1NOkRlcml2ZWRGcm9tIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgPHN0UmVmOmluc3RhbmNlSUQ+eG1wLmlpZDpCQTM2MTVFMEE5MzYxMUU3QkM0NkRFRTUzMTQwNTdDNjwvc3RSZWY6aW5zdGFuY2VJRD4KICAgICAgICAgICAgPHN0UmVmOmRvY3VtZW50SUQ+eG1wLmRpZDpERUM1QUJBOEE5OUMxMUU3QkM0NkRFRTUzMTQwNTdDNjwvc3RSZWY6ZG9jdW1lbnRJRD4KICAgICAgICAgPC94bXBNTTpEZXJpdmVkRnJvbT4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDpERUM1QUJBQUE5OUMxMUU3QkM0NkRFRTUzMTQwNTdDNjwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDpERUM1QUJBOUE5OUMxMUU3QkM0NkRFRTUzMTQwNTdD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Jd2QG5iCqBkvfIFV2H/7mps6hevX8VdpU+v0lo4HTX9B8ExWBPuNNY9xMbfpp5Oj+LAV4adguSLeIVCb6dTrnWl+xxiYghgZ0bl/wlKVzUVJfmfTkF9KOdqrNY+ECTb+5FIZ/8+Y0I/PDndj1mqBr3EcNa0c33GSr3EkF46/rgz/AedSfF0k5CQEqiDGxWtKXZ487765XqlmTF3lm/RYwdfDGPzUtqZ5aLtuiE2KTya+n0qrR32SXodY9Sfq+x5fHeU7BaognBtV8vyLAPYm33MWG8F9+A/zx2Kt/DNVrzvw6UJfF7EsOdiAebRzMDDfY7H3z9i8EBcn6ICn8PXT1OcdvjoqEApcQThX+POZ6/AIZqCncZVmyQtXBIKmKRKsPyyHcQx4m8nar9fN6Av8BDt1V/oVga3czrjIu4LGQUnm2bp7banVG9R4/8Vei00mLyMKwglCjX4ZgL0lWeLSdlP6Xpr1wsUKEaUtKwUBUJLZqNVPQVA/V59XoS9+KmbQ0jnLkkLuqoMcNW0L5RSMRhreSV2Ig5CadyIXjqGuMwLdrYCyk1nSQ8adDXDvhMp4eRCHN0dODrJblQxFPYc64n7y++Hnp8n8uXbT9ArCXIaJgSC7cvbJnNcfd7u3uQEzlVfBg5eXyfFmxOuoz7v32Efsr23GFYSzp48/51DKqeKB7blgPnOQKvE/6LyAm/emqJnPBtvdcJBi/SldCG/XoELo7sB7Mi/cfbsZLVSGp81tkrh01FCMMacgjyNsXN1ZaeLF5etxYfUSdwG9850VChLNjh4ytj8m1i7Gfa+4VsZNi4JtLCr0Jrozj2J8MzcqLxufGn8rQ41QEWjj4rWBSKPTbi6flee8PYVb2J/FLey8cTB7aenJfM0sjxdGgt2cQsSYTb9tzJD1fbck0xnMKgWJgqGLx7YlnTOEVLgYinIk7DugQOG4p/FHKhV4YuuKXg+3ReDZlK9K1PTnMrW+Ek2266f+jI5BoOHgwchfN+SrHd6jhYm7Frx/jccYn2DZ7yM1mBbCXL9o2aiuFFbFKPAnoOLrg8RzV7olmMseKz3vatgAt0XwNxu2JehOZe/ZGiRWSBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEBAFBQBAQBAQBQUAQEAQEAUFAEBAEDnQE/h9sQyD9Maf1KwAAAABJRU5ErkJggg==';

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
    this.horizontalBoxes = 100;
    this.verticalBoxes = 100;
  }

  getOffset() {
    return {
      x: this.offsetX,
      y: this.offsetY
    };
  }

  getHorizontalBoxes() {
    return this.horizontalBoxes;
  }

  getVerticalBoxes() {
    return this.verticalBoxes;
  }

  setHorizontalBoxes(boxes) {
    this.horizontalBoxes = boxes;
  }

  setVerticalBoxes(boxes) {
    this.verticalBoxes = boxes;
  }

  getWorkspacePixels() {
    return {
      width: this.horizontalBoxes * this.getZoom(),
      height: this.verticalBoxes * this.getZoom()
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
    return CURSOR_CENTERED;
  }

  static get gridEnabled() {
    return gridEnabled;
  }

  static gridToggle() {
    gridEnabled = !gridEnabled;
    
    return gridEnabled;
  }

  static get MIN_MULTIPLIER() {
    return MIN_MULTIPLIER;
  }

  static get ZOOM_SETTINGS() {
    return Constants.WORKSPACE_SETTINGS.getZoom();
  }

  static get DEFAULT_ZOOM() {
    return Constants.WORKSPACE_SETTINGS.getDefaultZoom();
  }

  static get MIN_GRID() {
    return MIN_GRID;
  }

  static get MAX_GRID() {
    return MAX_GRID;
  }

  static get NOT_FOUND_IMAGE() {
    return NOT_FOUND_IMAGE;
  }

  static getClosestPosition(x, y) {
    let dimension = Constants.ZOOM_SETTINGS;
    let closeX = x + dimension / 2;
    closeX -= closeX % dimension;
    let closeY = y + dimension / 2;
    closeY -= closeY % dimension;
    let offset = Constants.WORKSPACE_SETTINGS.getOffset();
    return {
      x: Constants.roundFloat(closeX + (offset.x % dimension)),
      y: Constants.roundFloat(closeY + (offset.y % dimension))
    };
  }

  static getGridCoord(mouseCoord, length, gridOffset, strictCursor=true) {
    let coord = ((mouseCoord - (Constants.cursorCentered && strictCursor ? length/2 : 0)) - gridOffset) / Constants.ZOOM_SETTINGS;
    return Constants.roundFloat(coord);
  }

  static setGridOffset(x, y) {
    Constants.WORKSPACE_SETTINGS.setOffset(x, y);
  }

  static getGridOffset() {
    return Constants.WORKSPACE_SETTINGS.getOffset();
  }

  static coordIsValid(x, y, width, height) {
    let xValid = x >= 0 && x + width <= Constants.WORKSPACE_SETTINGS.horizontalBoxes;
    let yValid = y >= 0 && y + height <= Constants.WORKSPACE_SETTINGS.verticalBoxes;
    return xValid && yValid;
  }

  static getAdjustedCoord(xCord, yCord, width, height) {
    if (xCord < 0) {
      xCord = 0;
    }
    else if (xCord + width > Constants.WORKSPACE_SETTINGS.horizontalBoxes) {
      xCord = Constants.WORKSPACE_SETTINGS.horizontalBoxes - width;
    }
    if (yCord < 0) {
      yCord = 0;
    }
    else if (yCord + height > Constants.WORKSPACE_SETTINGS.verticalBoxes) {
      yCord = Constants.WORKSPACE_SETTINGS.verticalBoxes - height;
    }
    return {
      x: xCord,
      y: yCord
    };
  }

  static getInteger(x) {
    if ((typeof x !== "number" && typeof x !== "string") || x === "") {
        return NaN;
    } else {
        x = Number(x);
        return x === Math.floor(x) ? x : NaN;
    }
  }

  static getAdjustedLine(xCord, yCord, deltaX, deltaY) {
    let leftToRight = deltaX >= 0;
    if (xCord < 0 || xCord+deltaX < 0) {
      xCord = leftToRight ? 0 : Math.abs(deltaX);
    }
    else if (xCord + deltaX > Constants.WORKSPACE_SETTINGS.horizontalBoxes || xCord > Constants.WORKSPACE_SETTINGS.horizontalBoxes) {
      xCord = Constants.WORKSPACE_SETTINGS.horizontalBoxes - (leftToRight ? deltaX : 0);
    }

    let topToBottom = deltaY >= 0;
    if (yCord < 0 || yCord+deltaY < 0) {
      yCord = topToBottom ? 0 : Math.abs(deltaY);
    }
    else if (yCord + deltaY > Constants.WORKSPACE_SETTINGS.verticalBoxes || yCord > Constants.WORKSPACE_SETTINGS.verticalBoxes) {
      yCord = Constants.WORKSPACE_SETTINGS.verticalBoxes - (topToBottom ? deltaY : 0);
    }

    return {
      x: xCord,
      y: yCord
    };
  }

  static getUniqueReactKey() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
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

  static roundFloat(num, decimals=0) {
    if (!decimals) decimals = ROUND_DECIMALS;
    return Number(Math.round(num+'e'+decimals)+'e-'+decimals);
  }

  static isUrl(s) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
      '(\\#[-a-z\\d_]*)?$','i');
    return !!pattern.test(s);
  }

  static getImageSourceDimensions(url, callback) {
    let image = new Image();
    image.onload = function() {
      callback(url, image.width, image.height);
    }
    image.onerror = function() {
      callback(url, 0, 0);
    }
    image.src = url;
  }
}

export default Constants;