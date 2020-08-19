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
  CIRCLE: 8
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

    static renderShape(type, fitInSquare=true) {
        type = parseInt(type);
        switch (type) {
            case Shapes.TYPES.RECT: return Shapes.getRect(fitInSquare);
            case Shapes.TYPES.ROUND_RECT: return Shapes.getRoundedRect(fitInSquare);
            case Shapes.TYPES.CIRCLE: return Shapes.getCircle();
            case Shapes.TYPES.ELLIPSE: return Shapes.getEllipse(fitInSquare);
            case Shapes.TYPES.DIAMOND: return Shapes.getDiamond();
            default: return null;
        }
    }

    static getDefaultDimensions(type) {
      type = parseInt(type);
      let dimensions = [0, 0];
      switch (type) {
        case Shapes.TYPES.RECT:
          dimensions = [200, 100];
          break;
        case Shapes.TYPES.ROUND_RECT:
          dimensions = [200, 100];
          break;
        case Shapes.TYPES.CIRCLE:
          dimensions = [200, 200];
          break;
        case Shapes.TYPES.ELLIPSE:
          dimensions = [200, 100];
          break;
        case Shapes.TYPES.DIAMOND:
          dimensions = [200, 200];
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