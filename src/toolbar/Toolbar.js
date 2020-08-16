import React from 'react';
import ToolbarNode from './ToolbarNode';
import "./Toolbar.css"

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true
    }
  }

  render() {
    return (
      <div className="toolbar">
        <div className="nodes">
          <ToolbarNode type={ToolbarNode.TYPES.RECT} />
          <ToolbarNode type={ToolbarNode.TYPES.ROUND_RECT} />
          <ToolbarNode type={ToolbarNode.TYPES.CIRCLE} />
          <ToolbarNode type={ToolbarNode.TYPES.ELLIPSE} />
          <ToolbarNode type={ToolbarNode.TYPES.DIAMOND} />
          <ToolbarNode type={ToolbarNode.TYPES.ROUND_RECT} />
        </div>
      </div>
    )
  }
}

export default Toolbar