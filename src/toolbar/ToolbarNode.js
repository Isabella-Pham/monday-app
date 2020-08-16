import React from 'react';
import "./ToolbarNode.css"

class ToolbarNode extends React.Component {
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

  constructor(props) {
    super(props);
  }

  getRect() {
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

  getRoundedRect() {
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

  getCircle() {
    return (
      <path d="
        M50,50
        m-35,0
        a35,35 0 0 1 70,0
        a35,35 0 0 1 -70,0
        Z"></path>
    )
  }

  getEllipse() {
    return (
      <path d="
        M50,50
        m-35,0
        a35,25 0 0 1 70,0
        a35,25 0 0 1 -70,0
        Z"></path>
    )
  }

  getDiamond() {
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

  renderShape() {
    switch (this.props.type) {
      case ToolbarNode.TYPES.RECT: return this.getRect();
      case ToolbarNode.TYPES.ROUND_RECT: return this.getRoundedRect();
      case ToolbarNode.TYPES.CIRCLE: return this.getCircle();
      case ToolbarNode.TYPES.ELLIPSE: return this.getEllipse();
      case ToolbarNode.TYPES.DIAMOND: return this.getDiamond();
    }
    return null;
  }

  render() {
    return (
      <div className="node">
        <svg viewBox="0 0 100 100">
          {this.renderShape()}
        </svg>
      </div>
    )
  }
}

export default ToolbarNode;