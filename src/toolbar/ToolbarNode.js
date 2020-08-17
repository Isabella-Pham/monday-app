import React from 'react';
import "./ToolbarNode.css";
import Shapes from './Shapes';

class ToolbarNode extends React.Component {
  static onMouseDown;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div data-type={this.props.type} className="node" onMouseDown={ToolbarNode.onMouseDown}>
        <svg viewBox="0 0 100 100">
          {Shapes.renderShape(this.props.type)}
        </svg>
      </div>
    );
  }
}

export default ToolbarNode;