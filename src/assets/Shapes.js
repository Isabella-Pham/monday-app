import React from 'react';

const LINE_ARROW_UNIT = 0.3;
const LINE_ARROW_ANGLE = Math.PI / 6;

const TYPES = Object.freeze({
  RECT: 0,
  ROUND_RECT: 1,
  ELLIPSE: 2,
  DIAMOND: 3,
  POST_IT: 4,
  UPRIGHT_CYLINDER: 5,
  TEXT_BOX: 6,
  IMAGE: 7,
  CIRCLE: 8,
  SQUARE: 9,
  ROUNDED_SQUARE: 10,
  ROUNDED_DIAMOND: 11,
  RIGHT_ARROW: 12,
  LEFT_ARROW: 13,
  DOUBLE_ARROW: 14,
  FOUR_ARROW: 15,
  LINE: 16,
  ARROW_LINE: 17,
  DOUBLE_LINE: 18,
  UP_ARROW: 19,
  DOWN_ARROW: 20,
  DOUBLE_VERT_ARROW: 21,
  FOUR_DIAG_ARROW: 22
});

class Shapes {
  static get TYPES() {
    return TYPES;
  }

  static isLine(type) {
    return type === TYPES.LINE ||
      type === TYPES.ARROW_LINE ||
      type === TYPES.DOUBLE_LINE;
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

  static getSquare() {
    return (
      <path d={`
        M0,0
        l100,0
        l0,100
        l-100,0
        Z`}></path>
    );
  }

  static getRoundedSquare() {
    // 10 radius corner
    return (
      <path d={`
        M0,10
        a10,10 0 0 1 10,-10 
        l80,0 
        a10,10 0 0 1 10,10
        l0,80
        a10,10 0 0 1 -10,10
        l-80,0
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

  static getLeftArrow(fitInSquare) {
    return (
      <path d={`
        M0,${fitInSquare ? 50 : 25}
        l25,-25
        l0,12.5
        l75,0
        l0,25
        l-75,0
        l0,12.5
        Z`}></path>
    )
  }

  static getRightArrow(fitInSquare) {
    return (
      <path d={`
        M100,${fitInSquare ? 50 : 25}
        l-25,-25
        l0,12.5
        l-75,0
        l0,25
        l75,0
        l0,12.5
        Z`}></path>
    )
  }

  static getDoubleArrow(fitInSquare) {
    return (
      <path d={`
        M0,${fitInSquare ? 50 : 25}
        l25,-25
        l0,12.5
        l50,0
        l0,-12.5
        l25,25
        l-25,25
        l0,-12.5
        l-50,0
        l0,12.5
        Z`}></path>
    )
  }

  static getFourArrow() {
    return (
      <path d={`
        M0,50
        l18.75,-18.75
        l0,12.5
        l25,0
        l0,-25
        l-12.5,0
        l18.75,-18.75
        l18.75,18.75
        l-12.5,0
        l0,25
        l25,0
        l0,-12.5
        l18.75,18.75
        l-18.75,18.75
        l0,-12.5
        l-25,0
        l0,25
        l12.5,0
        l-18.75,18.75
        l-18.75,-18.75
        l12.5,0
        l0,-25
        l-25,0
        l0,12.5
        Z`}></path>
    )
  }

  static getUpArrow(fitInSquare) {
    return (
      <path d={`
        M${fitInSquare ? 50 : 25},0
        l-25,25
        l12.5,0
        l0,75
        l25,0
        l0,-75
        l12.5,0
        Z`}></path>
    )
  }

  static getDownArrow(fitInSquare) {
    return (
      <path d={`
        M${fitInSquare ? 50 : 25},100
        l-25,-25
        l12.5,0
        l0,-75
        l25,0
        l0,75
        l12.5,0
        Z`}></path>
    )
  }

  static getDoubleVertArrow(fitInSquare) {
    return (
      <path d={`
        M${fitInSquare ? 50 : 25},0
        l-25,25
        l12.5,0
        l0,50
        l-12.5,0
        l25,25
        l25,-25
        l-12.5,0
        l0,-50
        l12.5,0
        Z`}></path>
    )
  }

  static getFourDiagArrow() {
    return (
      <path d={`
        M0,0
        l0,37.5
        l12.5,-12.5
        l25,25
        l-25,25
        l-12.5,-12.5
        l0,37.5
        l37.5,0
        l-12.5,-12.5
        l25,-25
        l25,25
        l-12.5,12.5
        l37.5,0
        l0,-37.5
        l-12.5,12.5
        l-25,-25
        l25,-25
        l12.5,12.5
        l0,-37.5
        l-37.5,0
        l12.5,12.5
        l-25,25
        l-25,-25
        l12.5,-12.5
        Z`}></path>
    )
  }

  static getLine(props) {
    if (props.toolbar) {
      return (
        <path
          style={{
            fill: '#000000'
          }}
          d={`
          M0,100
          l100,-100
        `} />
      )
    }
    return (
      <path
        d={`
        M${props.x},${props.y}
        L${props.endX},${props.endY}
      Z`} />
    );
  }

  static getArrowLine(props) {
    if (props.toolbar) {
      return (
        <path
          style={{
            fill: '#000000'
          }}
          d={`
          M0,100
          l95,-95
          m5,-5
          l-10,2.68
          l7.32,7.32
          l2.68,-10
        Z`} />
      )
    }
    let theta = Math.atan2(-props.endY + props.y, props.endX - props.x) * (180 / Math.PI);
    if (theta < 0) theta += 360;
    return (
      <g>
        <path
          d={`
          M${props.x},${props.y}
          L${props.endX},${props.endY}
        Z`} />
        <polygon
          strokeWidth={0.13}
          points={`
            0,0
            ${-LINE_ARROW_UNIT},${-LINE_ARROW_UNIT * Math.tan(LINE_ARROW_ANGLE)}
            ${-LINE_ARROW_UNIT},${LINE_ARROW_UNIT * Math.tan(LINE_ARROW_ANGLE)}
          `} transform={`
            translate(${props.endX}, ${props.endY})
            rotate(${-theta} 0 0)
          `}
        />
      </g>
    );
  }

  static getDoubleLine(props) {
    if (props.toolbar) {
      return (
        <path
          style={{
            fill: '#000000'
          }}
          d={`
          M0,100
          l10,-2.68
          l-7.32,-7.32
          l-2.68,10
          Z
          m5,-5
          l90,-90
          m5,-5
          l-10,2.68
          l7.32,7.32
          l2.68,-10
        Z`} />
      )
    }
    let theta = Math.atan2(-props.endY + props.y, props.endX - props.x) * (180 / Math.PI);
    if (theta < 0) theta += 360;
    return (
      <g>
        <path
          d={`
          M${props.x},${props.y}
          L${props.endX},${props.endY}
        Z`} />
        <polygon points={`
          0,0
          ${LINE_ARROW_UNIT},${-LINE_ARROW_UNIT * Math.tan(LINE_ARROW_ANGLE)}
          ${LINE_ARROW_UNIT},${LINE_ARROW_UNIT * Math.tan(LINE_ARROW_ANGLE)}
        `} transform={`
          translate(${props.x}, ${props.y})
          rotate(${-theta} 0 0)
        `} />
        <polygon points={`
          0,0
          ${-LINE_ARROW_UNIT},${-LINE_ARROW_UNIT * Math.tan(LINE_ARROW_ANGLE)}
          ${-LINE_ARROW_UNIT},${LINE_ARROW_UNIT * Math.tan(LINE_ARROW_ANGLE)}
        `} transform={`
          translate(${props.endX}, ${props.endY})
          rotate(${-theta} 0 0)
        `} />
      </g>
    );
  }

  static getPostIt() {
    return (
      <path d={`
        M80,0
        l-80,0
        l0,100
        l100,0
        l0,-80
        l-20,-20
        Z
        l0,20
        l20,0
        `}></path>
    );
  }

  static getCylinder() {
    // radius 1 = 50
    // radius 2 = 12.5
    return (
      <g>
        <path d={`
        M0,12.5
        l0,75
        a50,12.5 0 0 0 100,0
        l0,-75
        Z`}></path>
        <path d={`
        M50,12.5
        m-50,0
        a50,12.5 0 0 1 100,0
        a50,12.5 0 0 1 -100,0
        Z`}></path>
      </g>
    )
  }

  static renderShape(type, props = { toolbar: true }) {
    type = parseInt(type);
    switch (type) {
      case Shapes.TYPES.RECT: return Shapes.getRect(props.toolbar);
      case Shapes.TYPES.ROUND_RECT: return Shapes.getRoundedRect(props.toolbar);
      case Shapes.TYPES.CIRCLE: return Shapes.getCircle();
      case Shapes.TYPES.ELLIPSE: return Shapes.getEllipse(props.toolbar);
      case Shapes.TYPES.DIAMOND: return Shapes.getDiamond();
      case Shapes.TYPES.ROUNDED_DIAMOND: return Shapes.getRoundedDiamond();
      case Shapes.TYPES.SQUARE: return Shapes.getSquare();
      case Shapes.TYPES.ROUNDED_SQUARE: return Shapes.getRoundedSquare();
      case Shapes.TYPES.LEFT_ARROW: return Shapes.getLeftArrow(props.toolbar);
      case Shapes.TYPES.RIGHT_ARROW: return Shapes.getRightArrow(props.toolbar);
      case Shapes.TYPES.DOUBLE_ARROW: return Shapes.getDoubleArrow(props.toolbar);
      case Shapes.TYPES.FOUR_ARROW: return Shapes.getFourArrow();
      case Shapes.TYPES.LINE: return Shapes.getLine(props);
      case Shapes.TYPES.ARROW_LINE: return Shapes.getArrowLine(props);
      case Shapes.TYPES.DOUBLE_LINE: return Shapes.getDoubleLine(props);
      case Shapes.TYPES.UP_ARROW: return Shapes.getUpArrow(props.toolbar);
      case Shapes.TYPES.DOWN_ARROW: return Shapes.getDownArrow(props.toolbar);
      case Shapes.TYPES.DOUBLE_VERT_ARROW: return Shapes.getDoubleVertArrow(props.toolbar);
      case Shapes.TYPES.FOUR_DIAG_ARROW: return Shapes.getFourDiagArrow();
      case Shapes.TYPES.POST_IT: return Shapes.getPostIt();
      case Shapes.TYPES.UPRIGHT_CYLINDER: return Shapes.getCylinder();
      default: return null;
    }
  }

  static getDefaultDimensions(type, props = {}) {
    type = parseInt(type);
    let dimensions = [0, 0];
    switch (type) {
      case Shapes.TYPES.RECT:
      case Shapes.TYPES.ROUND_RECT:
      case Shapes.TYPES.LEFT_ARROW:
      case Shapes.TYPES.RIGHT_ARROW:
      case Shapes.TYPES.DOUBLE_ARROW:
      case Shapes.TYPES.ELLIPSE:
        dimensions = [8, 4];
        break;
      case Shapes.TYPES.UP_ARROW:
      case Shapes.TYPES.DOWN_ARROW:
      case Shapes.TYPES.DOUBLE_VERT_ARROW:
        dimensions = [4, 8];
        break;
      case Shapes.TYPES.DIAMOND:
      case Shapes.TYPES.CIRCLE:
      case Shapes.TYPES.SQUARE:
      case Shapes.TYPES.ROUNDED_SQUARE:
      case Shapes.TYPES.ROUNDED_DIAMOND:
      case Shapes.TYPES.FOUR_ARROW:
      case Shapes.TYPES.FOUR_DIAG_ARROW:
      case Shapes.TYPES.POST_IT:
      case Shapes.TYPES.UPRIGHT_CYLINDER:
      case Shapes.TYPES.IMAGE:
        dimensions = [8, 8];
        break;
      case Shapes.TYPES.LINE:
      case Shapes.TYPES.ARROW_LINE:
      case Shapes.TYPES.DOUBLE_LINE:
        dimensions = [10, 0];
        break;
      case Shapes.TYPES.TEXT_BOX:
        dimensions = [8, 6];
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