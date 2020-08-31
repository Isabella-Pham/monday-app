import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCut, faCopy, faEdit, faTrashAlt, faFileAlt, faSortAmountUpAlt, faSortAmountDownAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { Resizable } from 'react-resizable';

import Constants from '../../constants/constants';
import '../styles/WorkspaceImage.css';
import '../styles/react-contextmenu.css';
import '../styles/react-resizable.css';

class WorkspaceImage extends React.Component {
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
    this.resize = this.resize.bind(this);
    this.imageChange = this.imageChange.bind(this);    
  }

  static getDefault(x, y, type) {
    return {
      x: x,
      y: y,
      type: type,
      multiplier: 1,
      srcWidth: 200,
      srcHeight: 200,
      imageUrl: Constants.NOT_FOUND_IMAGE,
      isOriginal: true
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
    document.addEventListener('mouseup', this.placeNode, false);
    document.addEventListener('mousemove', this.moveNode, false);
    document.addEventListener('keydown', this.deleteSelf, false);

    if (this.props.attributes.isOriginal) {
      this.imageChange();
    }
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

  static getDefaultDimensions(srcWidth, srcHeight) {
    return {
      width: srcWidth / window.screen.width * 100,
      height: srcHeight / window.screen.width * 100
    }
  }

  getDefaultDimensions() {
    return WorkspaceImage.getDefaultDimensions(
      this.props.attributes.srcWidth,
      this.props.attributes.srcHeight
    );
  }

  getGridDimensions() {
    let dimensions = this.getDefaultDimensions();
    return {
      width: dimensions.width * this.props.attributes.multiplier,
      height: dimensions.height * this.props.attributes.multiplier,
    };
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

  imageChange() {
      this.props.onContextChange(this.props.index, "image");
  }

  resize(e, {size}) {
    let defaultDimensions = this.getDefaultDimensions();
    let newMultiplier = parseFloat(size.width) / (defaultDimensions.width * Constants.ZOOM_SETTINGS);
    let isTooSmall = newMultiplier < Constants.MIN_MULTIPLIER;

    if (isTooSmall) {
      newMultiplier = Constants.MIN_MULTIPLIER;
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
        <ContextMenuTrigger id={this.props.attributes.key} holdToDisplay={-1}>
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
              className={'image-node' + (this.state.isResizing ? ' resizing' : '') + (this.state.isSelected ? ' selected' : '')}
              style={{
                top: position.y,
                left: position.x,
                width: dimensions.width,
                height: dimensions.height
              }}>
              <img
                draggable={false}
                ref={node => this.node = node}
                alt="Could not load"
                width={dimensions.width}
                height={dimensions.height}
                src={this.props.attributes.imageUrl}
              />
            </div>
          </Resizable>
        </ContextMenuTrigger>
        <ContextMenu id={this.props.attributes.key} className="react-contextmenu">
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
            <MenuItem className="react-contextmenu-item" onClick={this.imageChange}>
              <FontAwesomeIcon icon={faLink} style={{paddingRight: 10}}/>
              URL
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

export default WorkspaceImage;