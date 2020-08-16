import React from 'react';
import "./ToolbarNode.css";
import Shapes from './Shapes';

class ToolbarNode extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="node" onMouseDown={this.props.onMouseDown}>
        <svg viewBox="0 0 100 100">
          {Shapes.renderShape(this.props.type)}
        </svg>
      </div>
    );
  }
}

export default ToolbarNode;