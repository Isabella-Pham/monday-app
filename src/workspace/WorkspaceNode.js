import React from 'react';
import * as d3 from 'd3';
import "./WorkspaceNode.css";
import Shapes from '../assets/Shapes';

class WorkspaceNode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected: true
    }

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false)
    // add svg to node
    // use attributes to create svg using d3
  }

  handleClick(e) {
    if (this.node.contains(e.target)){
      this.setState({ isSelected: true });
    } else {
      this.setState({ isSelected: false });
    }
  }

  render() {
    return (
      <div
           ref={node => this.node = node}
           className={'work-node' + (this.state.isSelected ? ' selected' : '')}
           style={{top: this.props.attributes.y, left: this.props.attributes.x, width: this.props.attributes.width, height: this.props.attributes.height}}>
        <svg viewBox="0 0 100 100">
          {Shapes.renderShape(this.props.attributes.type, false)}
        </svg>
      </div>
    );
  }
}

export default WorkspaceNode;