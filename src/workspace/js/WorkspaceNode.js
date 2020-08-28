import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCut, faCopy, faEdit, faTrashAlt, faFileAlt, faPalette, faSortAmountUpAlt, faSortAmountDownAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { Resizable } from 'react-resizable';

import Shapes from '../../assets/shapes';
import Constants from '../../constants/constants';
import '../styles/WorkspaceNode.css';
import '../styles/react-contextmenu.css';
import '../styles/react-resizable.css';

class WorkspaceNode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected: true,
      moving: {
        isMoving: false,
        offset: {
          x: -1,
          y: -1
        }
      },
      isResizing: false
    }

    let bindFunctions = [
      this.handleClick,
      this.moveNode,
      this.placeNode,
      this.deleteSelf,
      this.duplicateSelf,
      this.getRealDimensions,
      this.dummyMethod,
      this.copyNode,
      this.cutNode,
      this.moveToBack,
      this.moveToFront,
      this.colorChange,
      this.resize,
    ];

    for (let func of bindFunctions) {
      this[func.name] = this[func.name].bind(this);
    }

    let viewDimension = 100;
    if (this.props.attributes.defaultDimensions.width < this.props.attributes.defaultDimensions.height) {
      viewDimension /= 2;
    }
    this.viewbox = `0 0 ${viewDimension} ${viewDimension}`;
    this.renderedShape = Shapes.renderShape(this.props.attributes.type, {
      toolbar: false
    });
  }

  static getDefault(x, y, type) {
    let gridDimensions = Shapes.getDefaultDimensions(type);
    return {
      x: x,
      y: y,
      type: type,
      multiplier: 1,
      fillColor: '#FFFFFF',
      borderColor: '#000000',
      defaultDimensions: gridDimensions
    };
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

  getPosition() {
    let offset = Constants.getGridOffset();
    return {
      x: this.props.attributes.x * Constants.ZOOM_SETTINGS + offset.x,
      y: this.props.attributes.y * Constants.ZOOM_SETTINGS + offset.y
    };
  }

  handleClick(e) {
    if (this.node.contains(e.target)) {
      let position = this.getPosition();
      this.setState({
        isSelected: true,
        moving: {
          offset: {
            x: e.pageX - position.x,
            y: e.pageY - position.y
          },
          isMoving: true
        }
      });
    } else {
      if (!this.state.isResizing) {
        this.setState({ isSelected: false });
      }
    }
  }

  getGridDimensions() {
    return {
      width: this.props.attributes.defaultDimensions.width * this.props.attributes.multiplier,
      height: this.props.attributes.defaultDimensions.height * this.props.attributes.multiplier,
    }
  }

  getRealDimensions() {
    let dimensions = this.getGridDimensions();
    return {
      width: dimensions.width * Constants.ZOOM_SETTINGS,
      height: dimensions.height * Constants.ZOOM_SETTINGS
    };
  }

  moveNode(e) {
    if (this.state.isSelected && this.state.moving.isMoving) {
      let position = {};
      if (Constants.gridEnabled) {
        position = Constants.getClosestPosition(
          e.pageX - this.state.moving.offset.x,
          e.pageY - this.state.moving.offset.y
        );
      } else {
        position = {
          x: e.pageX - this.state.moving.offset.x,
          y: e.pageY - this.state.moving.offset.y,
        }
      }
      let offset = Constants.getGridOffset();
      let realDimensions = this.getRealDimensions();
      let xCord = Constants.getGridCoord(
        position.x,
        realDimensions.width,
        offset.x,
        false
      );
      let yCord = Constants.getGridCoord(
        position.y,
        realDimensions.height,
        offset.y,
        false
      );
      let gridDimensions = this.getGridDimensions();
      let adjustedCord = Constants.getAdjustedCoord(
        xCord,
        yCord,
        gridDimensions.width,
        gridDimensions.height
      )
      this.props.updateSelf(
        this.props.index,
        {
          x: adjustedCord.x,
          y: adjustedCord.y
        }
      );
    }
  }

  placeNode() {
    this.setState({
      moving: {
        ...this.state.moving,
        isMoving: false
      }
    });
  }

  deleteSelf(e) {
    if (this.state.isSelected && (e.key === 'Backspace' || e.key === 'Delete')) {
      this.props.onDelete(this.props.index);
    }
  }

  moveToFront(e) {
    this.props.onShift(this.props.index, true);
  }

  moveToBack(e) {
    this.props.onShift(this.props.index, false);
  }

  duplicateSelf(e) {
    this.props.onDuplicate(this.props.index);
  }

  copyNode() {
    this.props.copySelf(this.props.index);
  }

  cutNode() {
    this.props.copySelf(this.props.index);
    this.props.onDelete(this.props.index);
  }

  dummyMethod() {
    console.log("Dummy method");
  }

  colorChange() {
    this.props.onContextChange(this.props.index, "color")
  }

  resize(e, {size}) {
    let defaultDimensions = this.props.attributes.defaultDimensions;
    let newMultiplier = parseFloat(size.width) / (defaultDimensions.width * Constants.ZOOM_SETTINGS);
    let isTooSmall = newMultiplier < Constants.MIN_MULTIPLIER;
    let isTooLarge = newMultiplier > Constants.MAX_MULTIPLIER;

    if (isTooSmall) {
      newMultiplier = Constants.MIN_MULTIPLIER;
    }
    else if (isTooLarge) {
      newMultiplier = Constants.MAX_MULTIPLIER;
    }

    let isOutsideGridWidth = (this.props.attributes.x + (newMultiplier * defaultDimensions.width)) > Constants.WORKSPACE_SETTINGS.getHorizontalBoxes();
    let isOutsideGridHeight = (this.props.attributes.y + (newMultiplier * defaultDimensions.height)) > Constants.WORKSPACE_SETTINGS.getVerticalBoxes();
  
    if (!(isOutsideGridWidth || isOutsideGridHeight)) {
      this.props.updateSelf(this.props.index, {
        multiplier: newMultiplier
      });
    }
  }

  render() {
    let dimensions = this.getRealDimensions();
    let position = this.getPosition();
    return (
      <div>
        <ContextMenuTrigger id={this.props.menuId} holdToDisplay={-1}>
          <Resizable
            className={'resize-' + (this.state.isSelected ? 'active' : 'inactive')}
            width={dimensions.width} 
            height={dimensions.height} 
            lockAspectRatio={true}
            onResize={this.resize}
            draggableOpts={{offsetParent: document.body}}
            onResizeStart={() => this.setState({ isResizing: true })}
            onResizeStop={() => this.setState({ isResizing: false })}
          >
            <div
              className={'work-node' + (this.state.isResizing ? ' resizing' : '') + (this.state.isSelected ? ' selected' : '')}
              style={{
                top: position.y,
                left: position.x,
                width: dimensions.width,
                height: dimensions.height,
                fill: this.props.attributes.fillColor,
                stroke: this.props.attributes.borderColor,
                outlineWidth: Math.max(dimensions.width * 0.01, Constants.ZOOM_SETTINGS * 0.1)
              }}>
              <svg 
              ref={node => this.node = node}
              viewBox={this.viewbox}>
                { this.renderedShape }
              </svg>
            </div>
          </Resizable>
        </ContextMenuTrigger>
        <ContextMenu id={this.props.menuId} className="react-contextmenu">
          <MenuItem className="react-contextmenu-item" onClick={() => {this.props.onDelete(this.props.index)}}>
              <FontAwesomeIcon icon={faTrashAlt} style={{paddingRight: 10}}/>
              Delete
          </MenuItem>
          <SubMenu 
            title={
              <div style={{display: "inline"}}>
                <FontAwesomeIcon icon={faEdit} style={{paddingRight: 10}}/>
                <span>Edit</span>
              </div>
            }
            hoverDelay={100}>
            <MenuItem className="react-contextmenu-item" onClick={this.copyNode}>
              <FontAwesomeIcon icon={faCopy} style={{paddingRight: 10}}/>
              Copy
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.cutNode}>
              <FontAwesomeIcon icon={faCut} style={{paddingRight: 10}}/>
              Cut
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.duplicateSelf}>
              <FontAwesomeIcon icon={faClone} style={{paddingRight: 10}}/>
              Duplicate
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.colorChange}>
              <FontAwesomeIcon icon={faPalette} style={{paddingRight: 10}}/>
              Color
            </MenuItem>
          </SubMenu>
          <SubMenu 
            title={
              <div style={{display: "inline"}}>
                <FontAwesomeIcon icon={faFileAlt} style={{paddingRight: 10}}/>
                <span>Wrapping</span>
              </div>
            }
            hoverDelay={100}>
            <MenuItem className="react-contextmenu-item" onClick={this.moveToFront}>
              <FontAwesomeIcon icon={faSortAmountUpAlt} style={{paddingRight: 10}}/>
              Bring To Front
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.moveToBack}>
              <FontAwesomeIcon icon={faSortAmountDownAlt} style={{paddingRight: 10}}/>
              Send To Back
            </MenuItem>
          </SubMenu>
        </ContextMenu>
      </div>
    );
  }
}

export default WorkspaceNode;