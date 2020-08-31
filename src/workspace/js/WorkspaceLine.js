import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCut, faCopy, faEdit, faTrashAlt, faFileAlt, faUndo, faPalette, faSortAmountUpAlt, faSortAmountDownAlt, faClone } from '@fortawesome/free-solid-svg-icons';

import Shapes from '../../assets/shapes';
import Constants from '../../constants/constants';
import '../styles/WorkspaceLine.css';
import '../styles/react-contextmenu.css';

class WorkspaceLine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelected: true,
      moving: {
        offset: {
          x: -1,
          y: -1,
          endX: -1,
          endY: -1
        },
        deltas: {
          x: 0,
          y: 0,
          absX: 0,
          absY: 0
        },
        isMoving: false
      },
      resizing: {
        offset: {
          x: -1,
          y: -1
        },
        isResizing: false,
        isEnd: false
      }
    }

    this.handleClick = this.handleClick.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.placeNode = this.placeNode.bind(this);
    this.deleteSelf = this.deleteSelf.bind(this);
    this.duplicateSelf = this.duplicateSelf.bind(this);
    this.getRealDimensions = this.getRealDimensions.bind(this);
    this.copyNode = this.copyNode.bind(this);
    this.cutNode = this.cutNode.bind(this);
    this.moveToBack = this.moveToBack.bind(this);
    this.moveToFront = this.moveToFront.bind(this);
    this.colorChange = this.colorChange.bind(this);
    this.flipLine = this.flipLine.bind(this);    
  }

  static getDefault(x, y, type) {
    return {
      x: x,
      y: y,
      endX: x + 10,
      endY: y,
      type: type,
      fillColor: '#000000'
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
      y: this.props.attributes.y * Constants.ZOOM_SETTINGS + offset.y,
      endX: this.props.attributes.endX * Constants.ZOOM_SETTINGS + offset.x,
      endY: this.props.attributes.endY * Constants.ZOOM_SETTINGS + offset.y,
    };
  }

  handleClick(e) {
    if (this.node.contains(e.target)) {
      if (e.target.tagName === 'circle') {
        // change x/y or endX/endY
        let isEnd = e.target.className.baseVal === 'endCircle';
        let position = this.getPosition();
        this.setState({
          resizing: {
            isEnd: isEnd,
            isResizing: true,
            offset: {
              x: e.pageX - position[isEnd ? 'endX' : 'x'],
              y: e.pageY - position[isEnd ? 'endY' : 'y']
            }
          }
        });
      }
      else {
        // move line
        let position = this.getPosition();
        this.setState({
          isSelected: true,
          moving: {
            isMoving: true,
            offset: {
              x: e.pageX - position.x,
              y: e.pageY - position.y,
              endX: e.pageX - position.endX,
              endY: e.pageY - position.endY
            },
            deltas: this.getDeltas()
          }
        });
      }
    } else {
      this.setState({ isSelected: false });
    }
  }

  getDeltas() {
    let deltas = {
      x: this.props.attributes.endX - this.props.attributes.x,
      y: this.props.attributes.endY - this.props.attributes.y,
      absX: 0,
      absY: 0
    };
    deltas.absX = Math.abs(deltas.x);
    deltas.absY = Math.abs(deltas.y);
    return deltas;
  }

  getRealDimensions() {
    let dimensions = this.getDeltas();
    return {
      width: dimensions.absX * Constants.ZOOM_SETTINGS,
      height: dimensions.absY * Constants.ZOOM_SETTINGS
    };
  }

  moveNode(e) {
    if (this.state.isSelected) {
      if (this.state.moving.isMoving) {
        let position = {};
        if (Constants.gridEnabled) {
          position = Constants.getClosestPosition(
            e.pageX - this.state.moving.offset.x,
            e.pageY - this.state.moving.offset.y
          );
        } else {
          position = {
            x: e.pageX - this.state.moving.offset.x,
            y: e.pageY - this.state.moving.offset.y
          }
        }
        let offset = Constants.getGridOffset();
        let xCord = Constants.getGridCoord(
          position.x,
          this.state.moving.deltas.x,
          offset.x,
          false
        );
        let yCord = Constants.getGridCoord(
          position.y,
          this.state.moving.deltas.y,
          offset.y,
          false
        );
        let adjustedCord = Constants.getAdjustedLine(
          xCord,
          yCord,
          this.state.moving.deltas.x,
          this.state.moving.deltas.y
        );
        let updateCoord = {
          x: adjustedCord.x,
          y: adjustedCord.y,
          endX: adjustedCord.x + this.state.moving.deltas.x,
          endY: adjustedCord.y + this.state.moving.deltas.y
        };
        this.props.updateSelf(
          this.props.index,
          updateCoord
        );
      }
      else if (this.state.resizing.isResizing) {
        let position = {};
        if (Constants.gridEnabled) {
          position = Constants.getClosestPosition(
            e.pageX - this.state.resizing.offset.x,
            e.pageY - this.state.resizing.offset.y
          );
        } else {
          position = {
            x: e.pageX - this.state.resizing.offset.x,
            y: e.pageY - this.state.resizing.offset.y,
          }
        }
        let offset = Constants.getGridOffset();
        let xCord = Constants.getGridCoord(
          position.x,
          0,
          offset.x,
          false
        );
        let yCord = Constants.getGridCoord(
          position.y,
          0,
          offset.y,
          false
        );
        let adjustedCord = Constants.getAdjustedCoord(
          xCord,
          yCord,
          0,
          0
        );
        let updateCoord = this.state.resizing.isEnd ? {
          endX: adjustedCord.x,
          endY: adjustedCord.y
        } : {
          x: adjustedCord.x,
          y: adjustedCord.y,
        };
        let newDx = Math.abs(adjustedCord.x - this.props.attributes[this.state.resizing.isEnd ? 'x' : 'endX']);
        let newDy = Math.abs(adjustedCord.y - this.props.attributes[this.state.resizing.isEnd ? 'y' : 'endY']);
        if (newDx >= 1 || newDy >= 1) {
          this.props.updateSelf(
            this.props.index,
            updateCoord
          );
        }
      }
    }
  }

  placeNode() {
    this.setState({
      moving: {
        ...this.state.moving,
        isMoving: false
      },
      resizing: {
        ...this.state.resizing,
        isResizing: false
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

  colorChange() {
    this.props.onContextChange(this.props.index, "color")
  }

  flipLine() {
    this.props.updateSelf(this.props.index, {
      x: this.props.attributes.endX,
      y: this.props.attributes.endY,
      endX: this.props.attributes.x,
      endY: this.props.attributes.y
    });
  }

  render() {
    let vBox = Constants.WORKSPACE_SETTINGS.getVerticalBoxes();
    let hBox = Constants.WORKSPACE_SETTINGS.getHorizontalBoxes();
    let gridPixels = Constants.WORKSPACE_SETTINGS.getWorkspacePixels();
    let offset = Constants.WORKSPACE_SETTINGS.getOffset();
    let renderProps = {
      toolbar: false,
      x: this.props.attributes.x,
      y: this.props.attributes.y,
      endX: this.props.attributes.endX,
      endY: this.props.attributes.endY
    };
    return (
      <div>
        <ContextMenuTrigger id={this.props.attributes.key} holdToDisplay={-1}>
          <div
            className={'line-node' + (this.state.isSelected ? ' selected' : '')}
            style={{
              top: offset.y,
              left: offset.x,
              width: gridPixels.width,
              height: gridPixels.height,
              fill: this.props.attributes.fillColor,
              stroke: this.props.attributes.fillColor
            }}>
            <svg
              ref={node => this.node = node}
              viewBox={`0 0 ${vBox} ${hBox}`}>
              {
                this.state.isSelected ? <path
                  style={{
                    strokeWidth: 0.3,
                    stroke: "#4a98fd",
                    strokeDasharray: 0.25,
                  }}
                  d={`
                  M${renderProps.x},${renderProps.y}
                  L${renderProps.endX},${renderProps.endY}
                `} /> : null
              }
              { Shapes.renderShape(this.props.attributes.type, renderProps) }
              {this.state.isSelected ? [
                <circle
                  className="startCircle"
                  key="startCircle"
                  style={{
                    stroke: "#bedafd",
                    fill: "#bedafd",
                    strokeWidth: 0.1,
                  }} cx={renderProps.x} cy={renderProps.y} r={0.25}></circle>,
                <circle
                  className="endCircle"
                  key="endCircle"
                  style={{
                    stroke: "#bedafd",
                    fill: "#bedafd",
                    strokeWidth: 0.1,
                  }} cx={renderProps.endX} cy={renderProps.endY} r={0.25}></circle>
              ] : null}
            </svg>
          </div>
        </ContextMenuTrigger>
        <ContextMenu id={this.props.attributes.key} className="react-contextmenu">
          <MenuItem className="react-contextmenu-item" onClick={() => { this.props.onDelete(this.props.index) }}>
            <FontAwesomeIcon icon={faTrashAlt} style={{ paddingRight: 10 }} />
              Delete
          </MenuItem>
          <SubMenu
            title={
              <div style={{ display: "inline" }}>
                <FontAwesomeIcon icon={faEdit} style={{ paddingRight: 10 }} />
                <span>Edit</span>
              </div>
            }
            hoverDelay={100}>
            <MenuItem className="react-contextmenu-item" onClick={this.copyNode}>
              <FontAwesomeIcon icon={faCopy} style={{ paddingRight: 10 }} />
              Copy
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.cutNode}>
              <FontAwesomeIcon icon={faCut} style={{ paddingRight: 10 }} />
              Cut
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.duplicateSelf}>
              <FontAwesomeIcon icon={faClone} style={{ paddingRight: 10 }} />
              Duplicate
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.flipLine}>
              <FontAwesomeIcon icon={faUndo} style={{ paddingRight: 10 }} />
              Flip
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.colorChange}>
              <FontAwesomeIcon icon={faPalette} style={{ paddingRight: 10 }} />
              Color
            </MenuItem>
          </SubMenu>
          <SubMenu
            title={
              <div style={{ display: "inline" }}>
                <FontAwesomeIcon icon={faFileAlt} style={{ paddingRight: 10 }} />
                <span>Wrapping</span>
              </div>
            }
            hoverDelay={100}>
            <MenuItem className="react-contextmenu-item" onClick={this.moveToFront}>
              <FontAwesomeIcon icon={faSortAmountUpAlt} style={{ paddingRight: 10 }} />
              Bring To Front
            </MenuItem>
            <MenuItem className="react-contextmenu-item" onClick={this.moveToBack}>
              <FontAwesomeIcon icon={faSortAmountDownAlt} style={{ paddingRight: 10 }} />
              Send To Back
            </MenuItem>
          </SubMenu>
        </ContextMenu>
      </div>
    );
  }
}

export default WorkspaceLine;