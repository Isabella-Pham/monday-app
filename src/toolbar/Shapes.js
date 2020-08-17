import React from 'react';

class Shapes {
    static TYPES = {
        RECT: 0,
        ROUND_RECT: 1,
        ELLIPSE: 2,
        DIAMOND: 3,
        POST_IT: 4,
        UPRIGHT_CYCLINDER: 5,
        TEXTBOX: 6,
        IMAGE: 7,
        CIRCLE: 8
    };

    static getRect() {
        // 70x50 rectangle
        return (
            <path d="
            M15,25
            l70,0
            l0,50
            l-70,0
            Z"></path>
        )
    }

    static getRoundedRect() {
        // 70x50 rectangle w/ 10 radius corner
        return (
            <path d="
            M15,35
            a10,10 0 0 1 10,-10 
            l50,0 
            a10,10 0 0 1 10,10
            l0,30
            a10,10 0 0 1 -10,10
            l-50,0
            a10,10 0 0 1 -10,-10
            Z"></path>
        )
    }

    static getCircle() {
        return (
            <path d="
            M50,50
            m-35,0
            a35,35 0 0 1 70,0
            a35,35 0 0 1 -70,0
            Z"></path>
        )
    }

    static getEllipse() {
        return (
            <path d="
            M50,50
            m-35,0
            a35,25 0 0 1 70,0
            a35,25 0 0 1 -70,0
            Z"></path>
        )
    }

    static getDiamond() {
        // 70x70 space
        return (
            <path d="
            M15,50
            l35,-35
            l35,35
            l-35,35
            Z"></path>
        )
    }

    static renderShape(type) {
        switch (type) {
            case Shapes.TYPES.RECT: return Shapes.getRect();
            case Shapes.TYPES.ROUND_RECT: return Shapes.getRoundedRect();
            case Shapes.TYPES.CIRCLE: return Shapes.getCircle();
            case Shapes.TYPES.ELLIPSE: return Shapes.getEllipse();
            case Shapes.TYPES.DIAMOND: return Shapes.getDiamond();
            default: return null;
        }
    }
}

export default Shapes;