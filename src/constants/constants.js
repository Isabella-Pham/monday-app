const CURSOR_CENTERED = true;
const ROUND_DECIMALS = 4;
const MIN_MULTIPLIER = 0.25;
const MIN_GRID = 10;
const MAX_GRID = 1000;
const MONDAY_LOGO = 'data:image/png;base64,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';
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

  static get MONDAY_LOGO() {
    return MONDAY_LOGO;
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