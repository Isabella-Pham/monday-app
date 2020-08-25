import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCut, faCopy, faEdit, faTextHeight, faTrashAlt, faFileAlt, faVectorSquare, faUndo, faExpand, faPalette, faSortAmountUpAlt, faSortAmountDownAlt, faClone } from '@fortawesome/free-solid-svg-icons';

import Shapes from '../assets/Shapes';
import Constants from '../constants/constants';
import './WorkspaceNode.css';
import './react-contextmenu.css';

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
      this.cutNode,
      this.moveToBack,
      this.moveToFront
    ];
    for (let func of bindFunctions) {
      this[func.name] = this[func.name].bind(this);
    }
  }

  static getDefault(x, y, type) {
    return {
      x: x,
      y: y,
      type: type,
      multiplier: 1,
      fillColor: '#FFFFFF',
      borderColor: '#000000'
    }
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
      let position = this.getPosition();
      this.setState({
        isSelected: true,
        offset: {
          x: e.pageX - position.x,
          y: e.pageY - position.y
        },
        isMoving: true
      });
    } else {
      this.setState({ isSelected: false });
    }
  }

  getGridDimensions() {
    let gridDimensions = Shapes.getDefaultDimensions(this.props.attributes.type);
    return {
      width: gridDimensions.width * this.props.attributes.multiplier,
      height: gridDimensions.height * this.props.attributes.multiplier,
    }
  }

  getRealDimensions() {
    let dimensions = this.getGridDimensions();
    return {
      width: dimensions.width * Constants.ZOOM_SETTINGS,
      height: dimensions.height * Constants.ZOOM_SETTINGS
    };
  }

  getPosition() {
    let offset = Constants.getGridOffset();
    return {
      x: this.props.attributes.x * Constants.ZOOM_SETTINGS + offset.x,
      y: this.props.attributes.y * Constants.ZOOM_SETTINGS + offset.y
    };
  }

  moveNode(e) {
    if (this.state.isSelected && this.state.isMoving) {
      let position = {};
      if (Constants.gridEnabled) {
        position = Constants.getClosestPosition(
          e.pageX - this.state.offset.x,
          e.pageY - this.state.offset.y
        );
      } else {
        position = {
          x: e.pageX - this.state.offset.x,
          y: e.pageY - this.state.offset.y,
        }
      }
      let offset = Constants.getGridOffset();
      let realDimensions = this.getRealDimensions();
      let xCord = Constants.getGridCoord(
        position.x,
        realDimensions.width,
        offset.x
      );
      let yCord = Constants.getGridCoord(
        position.y,
        realDimensions.height,
        offset.y
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
        adjustedCord.x,
        adjustedCord.y
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

  render() {
    let dimensions = this.getRealDimensions();
    let position = this.getPosition();
    return (
      <div>
        <ContextMenuTrigger id={this.props.menuId} holdToDisplay={-1}>
          <div
            className={'work-node' + (this.state.isSelected ? ' selected' : '')}
            style={{
              top: position.y,
              left: position.x,
              width: dimensions.width,
              height: dimensions.height,
              fill: this.props.attributes.fillColor,
              stroke: this.props.attributes.borderColor
            }}>
            <svg 
            ref={node => this.node = node}
            viewBox="0 0 100 100"
            >
              { Shapes.renderShape(this.props.attributes.type, false) }
            </svg>
          </div>
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
            <MenuItem className="react-contextmenu-item" onClick={this.dummyMethod}>
              <FontAwesomeIcon icon={faTextHeight} style={{paddingRight: 10}}/>
              Text
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
          <SubMenu 
            title={
              <div style={{display: "inline"}}>
                <FontAwesomeIcon icon={faVectorSquare} style={{paddingRight: 10}}/>
                <span>Styling</span>
              </div>
            }
            hoverDelay={100}>
            <MenuItem className="react-contextmenu-item" onClick={this.dummyMethod}>
              <FontAwesomeIcon icon={faUndo} style={{paddingRight: 10}}/>
              Rotate
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.dummyMethod}>
              <FontAwesomeIcon icon={faExpand} style={{paddingRight: 10}}/>
              Resize
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.dummyMethod}>
              <FontAwesomeIcon icon={faPalette} style={{paddingRight: 10}}/>
              Change Color
            </MenuItem>
          </SubMenu>
        </ContextMenu>
      </div>
    );
  }
}

export default WorkspaceNode;