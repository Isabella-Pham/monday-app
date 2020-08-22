import React from 'react';
import * as d3 from 'd3';
import "./WorkspaceNode.css";
import Shapes from '../assets/Shapes';
import Constants from '../constants/constants';

class WorkspaceNode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected: true,
      offset: {
        x: -1,
        y: -1
      },
      isMoving: false,
      x: this.props.attributes.x,
      y: this.props.attributes.y
    }

    this.handleClick = this.handleClick.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.placeNode = this.placeNode.bind(this);
    this.deleteSelf = this.deleteSelf.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
    document.addEventListener('mouseup', this.placeNode, false);
    document.addEventListener('mousemove', this.moveNode, false);
    document.addEventListener('keydown', this.deleteSelf, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
    document.removeEventListener('mouseup', this.placeNode, false);
    document.removeEventListener('mousemove', this.moveNode, false);
    document.removeEventListener('keydown', this.deleteSelf, false);
  }

  handleClick(e) {
    if (this.node.contains(e.target)) {
      this.setState({ isSelected: true, offset: { x: e.pageX - this.state.x, y: e.pageY - this.state.y }, isMoving: true });
    } else {
      this.setState({ isSelected: false });
    }
  }

  moveNode(e) {
    if (this.state.isSelected && this.state.isMoving) {
      let newCoord = {}
      if (Constants.gridEnabled) {
        newCoord = Constants.getClosestCoord(
          e.pageX - this.state.offset.x,
          e.pageY - this.state.offset.y,
          Constants.ZOOM_SETTINGS.DEFAULT
        );
      } else {
        newCoord = {
          x: e.pageX - this.state.offset.x,
          y: e.pageY - this.state.offset.y,
        }
      }
      this.setState({ x: newCoord.x, y: newCoord.y })
    }
  }

  placeNode() {
    this.setState({ isMoving: false });
  }

  deleteSelf(e) {
    if (this.state.isSelected && (e.key === 'Backspace' || e.key === 'Delete')) {
      this.props.onDelete(this.props.index);
    }
  }

  render() {
    return (
      <div
        ref={node => this.node = node}
        className={'work-node' + (this.state.isSelected ? ' selected' : '')}
        style={{ top: this.state.y, left: this.state.x, width: this.props.attributes.width, height: this.props.attributes.height }}>
        <svg viewBox="0 0 100 100">
          {Shapes.renderShape(this.props.attributes.type, false)}
        </svg>
      </div>
    );
  }
}

export default WorkspaceNode;