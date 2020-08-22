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
      scrolling: {
        enabled: false,
        xDis: 0,
        yDis: 0
      }
    }

    this.handleClick = this.handleClick.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.placeNode = this.placeNode.bind(this);
    this.deleteSelf = this.deleteSelf.bind(this);
    this.getDimensions = this.getDimensions.bind(this);
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
      this.setState({
        isSelected: true,
        offset: {
          x: e.pageX - this.props.attributes.x,
          y: e.pageY - this.props.attributes.y
        },
        isMoving: true
      });
    } else {
      this.setState({ isSelected: false });
    }
  }

  getDimensions() {
    let dimensions = Shapes.getDefaultDimensions(this.props.attributes.type);
    let width = dimensions.width * Constants.ZOOM_SETTINGS;
    let height = dimensions.height * Constants.ZOOM_SETTINGS;
    return {
      width: width,
      height: height
    };
  }

  // x and y and current page coordinates of WorkspaceNode
  // xDif is difference between current pageX and clientX
  // yDif is difference between current pageY and clientY
  scrollWorkspace(x, y, xDif, yDif) {
    let dimensions = this.getDimensions();
    let width = dimensions.width;
    let height = dimensions.height;

    let scrollXDis = 0;
    let scrollYDis = 0;

    if (x + width > window.innerWidth + xDif) {
      scrollXDis = Constants.ZOOM_SETTINGS;
    }
    else if (x < xDif) {
      scrollXDis = -Constants.ZOOM_SETTINGS;
    }

    if (y + height > window.innerHeight + yDif) {
      scrollYDis = Constants.ZOOM_SETTINGS;
    }
    else if (y < yDif) {
      scrollYDis = -Constants.ZOOM_SETTINGS;
    }

    if (scrollXDis || scrollYDis) {
      this.props.startScroll(scrollXDis, scrollYDis);
    }
  }

  moveNode(e) {
    if (this.state.isSelected && this.state.isMoving) {
      const newCoord = Constants.getClosestCoord(
        e.pageX - this.state.offset.x,
        e.pageY - this.state.offset.y,
        Constants.ZOOM_SETTINGS
      );
      this.props.updateSelf(this.props.index, newCoord.x, newCoord.y);
      this.scrollWorkspace(
        newCoord.x,
        newCoord.y,
        e.pageX - e.clientX,
        e.pageY - e.clientY
      );
    }
  }

  placeNode() {
    this.setState({
      isMoving: false
    });
    this.props.endScroll();
  }

  deleteSelf(e) {
    if (this.state.isSelected && (e.key === 'Backspace' || e.key === 'Delete')) {
      this.props.onDelete(this.props.index);
    }
  }

  render() {
    let dimensions = this.getDimensions();
    
    return (
      <div
        ref={node => this.node = node}
        className={'work-node' + (this.state.isSelected ? ' selected' : '')}
        style={{
          top: this.props.attributes.y,
          left: this.props.attributes.x,
          width: dimensions.width,
          height: dimensions.height
        }}>
        <svg viewBox="0 0 100 100">
          { Shapes.renderShape(this.props.attributes.type, false) }
        </svg>
      </div>
    );
  }
}

export default WorkspaceNode;