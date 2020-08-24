import React from 'react';

const TYPES = Object.freeze({
  RECT: 0,
  ROUND_RECT: 1,
  ELLIPSE: 2,
  DIAMOND: 3,
  POST_IT: 4,
  UPRIGHT_CYCLINDER: 5,
  TEXTBOX: 6,
  IMAGE: 7,
  CIRCLE: 8,
  SQUARE: 9,
  ROUNDED_SQUARE: 10,
  ROUNDED_DIAMOND: 11,
  RIGHT_ARROW: 12,
  LEFT_ARROW: 13,
  DOUBLE_ARROW: 14,
  FOUR_ARROW: 15
});

class Shapes {
  static get TYPES() {
    return TYPES;
  }

  static getRect(fitInSquare) {
    // 100x50 rectangle
    return (
      <path d={`
            M0,${fitInSquare ? 25 : 0}
            l100,0
            l0,50
            l-100,0
            Z`}></path>
    )
  }

  static getRoundedRect(fitInSquare) {
    // 100x50 rectangle w/ 10 radius corner
    return (
      <path d={`
            M0,${fitInSquare ? 35 : 10}
            a10,10 0 0 1 10,-10 
            l80,0 
            a10,10 0 0 1 10,10
            l0,30
            a10,10 0 0 1 -10,10
            l-80,0
            a10,10 0 0 1 -10,-10
            Z`}></path>
    )
  }

  static getSquare(fitInSquare) {
    // 80x80 if toolbar 100x100 if grid
    let start = fitInSquare ? '10,10' : '0,0';
    let len = fitInSquare ? '80' : '100';
    return (
      <path d={`
        M${start}
        l${len},0
        l0,${len}
        l-${len},0
        Z`}></path>
    );
  }

  static getRoundedSquare(fitInSquare) {
    // 10 radius corner
    // 80x80 if toolbar 100x100 if grid
    let start = fitInSquare ? '10,20' : '0,10';
    let len = fitInSquare ? '60' : '80';
    return (
    <path d={`
    M${start}
    a10,10 0 0 1 10,-10 
    l${len},0 
    a10,10 0 0 1 10,10
    l0,${len}
    a10,10 0 0 1 -10,10
    l-${len},0
    a10,10 0 0 1 -10,-10
    Z`}></path>
      );
  }

  static getCircle() {
    // radius = 50
    return (
      <path d={`
            M50,50
            m-50,0
            a50,50 0 0 1 100,0
            a50,50 0 0 1 -100,0
            Z`}></path>
    )
  }

  static getEllipse(fitInSquare) {
    // radius 1 = 50
    // radius 2 = 25
    return (
      <path d={`
            M50,${fitInSquare ? 50 : 25}
            m-50,0
            a50,25 0 0 1 100,0
            a50,25 0 0 1 -100,0
            Z`}></path>
    )
  }

  static getDiamond() {
    // 100x100 space
    return (
      <path d={`
        M0,50
        l50,-50
        l50,50
        l-50,50
        Z`}></path>
    )
  }

  static getRoundedDiamond() {
    // 100x100 space
    return (
      <path d={`
      M2.929,57.071
      a10,10 0 0 1 0,-14.142
      l40,-40
      a10,10 0 0 1 14.142,0 
      l40,40
      a10,10 0 0 1 0,14.142
      l-40,40
      a10,10 0 0 1 -14.142,0 
      Z`}></path>
    )
  }

  static renderShape(type, fitInSquare = true) {
    type = parseInt(type);
    switch (type) {
      case Shapes.TYPES.RECT: return Shapes.getRect(fitInSquare);
      case Shapes.TYPES.ROUND_RECT: return Shapes.getRoundedRect(fitInSquare);
      case Shapes.TYPES.CIRCLE: return Shapes.getCircle();
      case Shapes.TYPES.ELLIPSE: return Shapes.getEllipse(fitInSquare);
      case Shapes.TYPES.DIAMOND: return Shapes.getDiamond();
      case Shapes.TYPES.ROUNDED_DIAMOND: return Shapes.getRoundedDiamond();
      case Shapes.TYPES.SQUARE: return Shapes.getSquare(fitInSquare);
      case Shapes.TYPES.ROUNDED_SQUARE: return Shapes.getRoundedSquare(fitInSquare);
      default: return null;
    }
  }

  static getDefaultDimensions(type) {
    type = parseInt(type);
    let dimensions = [0, 0];
    switch (type) {
      case Shapes.TYPES.RECT:
        dimensions = [8, 4];
        break;
      case Shapes.TYPES.ROUND_RECT:
        dimensions = [8, 4];
        break;
      case Shapes.TYPES.CIRCLE:
        dimensions = [8, 8];
        break;
      case Shapes.TYPES.ELLIPSE:
        dimensions = [8, 4];
        break;
      case Shapes.TYPES.DIAMOND:
        dimensions = [8, 8];
        break;
      case Shapes.TYPES.SQUARE:
        dimensions = [8, 8];
        break;
      case Shapes.TYPES.ROUNDED_SQUARE:
        dimensions = [8, 8];
        break;
      case Shapes.TYPES.ROUNDED_DIAMOND:
        dimensions = [8, 8];
        break;
      default: break;
    }
    return {
      width: dimensions[0],
      height: dimensions[1]
    };
  }
}

export default Shapes;