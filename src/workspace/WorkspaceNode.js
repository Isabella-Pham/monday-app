import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";

import Shapes from '../assets/Shapes';
import Constants from '../constants/constants';
import { faCut, faCopy, faEdit, faTextHeight, faTrashAlt, faFileAlt, faVectorSquare, faUndo, faExpand, faPalette, faSortAmountUpAlt, faSortAmountDownAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import './WorkspaceNode.css';
import './react-contextmenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import './node-modals/NodeColorModal.css';
import SketchPicker from 'react-color'

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
      },
      colorModalShow: false,
      color: '#ffffff',
      newColor: '#ffffff'
    }

    this.handleClick = this.handleClick.bind(this);
    this.moveNode = this.moveNode.bind(this);
    this.placeNode = this.placeNode.bind(this);
    this.deleteSelf = this.deleteSelf.bind(this);
    this.duplicateSelf = this.duplicateSelf.bind(this);
    this.getRealDimensions = this.getRealDimensions.bind(this);
    this.dummyMethod = this.dummyMethod.bind(this);
    this.copyNode = this.copyNode.bind(this);
    this.moveToBack = this.moveToBack.bind(this);
    this.moveToFront = this.moveToFront.bind(this);
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

  getRealDimensions() {
    let width = this.props.attributes.width * Constants.ZOOM_SETTINGS;
    let height = this.props.attributes.height * Constants.ZOOM_SETTINGS;
    return {
      width: width,
      height: height
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
      let dimensions = this.getRealDimensions();
      let xCord = Constants.getGridCoord(
        position.x,
        dimensions.width,
        offset.x
      );
      let yCord = Constants.getGridCoord(
        position.y,
        dimensions.height,
        offset.y
      );
      if (xCord < 0) {
        xCord = 0;
      }
      else if (xCord + this.props.attributes.width > Constants.WORKSPACE_SETTINGS.horizontalBoxes) {
        xCord = Constants.WORKSPACE_SETTINGS.horizontalBoxes - this.props.attributes.width;
      }
      if (yCord < 0) {
        yCord = 0;
      }
      else if (yCord + this.props.attributes.height > Constants.WORKSPACE_SETTINGS.verticalBoxes) {
        yCord = Constants.WORKSPACE_SETTINGS.verticalBoxes - this.props.attributes.height;
      }
      this.props.updateSelf(
        this.props.index,
        xCord,
        yCord
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

  dummyMethod() {
    console.log("Dummy method");
  }

  render() {
    let dimensions = this.getRealDimensions();
    let position = this.getPosition();
    return (
      <div>
        <ContextMenuTrigger id={this.props.menu_id} holdToDisplay={-1}>
          <div
            ref={node => this.node = node}
            className={'work-node' + (this.state.isSelected ? ' selected' : '')}
            style={{
              top: position.y,
              left: position.x,
              width: dimensions.width,
              height: dimensions.height
            }}>
            <svg viewBox="0 0 100 100">
              { Shapes.renderShape(this.props.attributes.type, false) }
            </svg>
          </div>
        </ContextMenuTrigger>
        <ContextMenu id={this.props.menu_id} className="react-contextmenu">
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
            <MenuItem className="react-contextmenu-item" onClick={this.dummyMethod}>
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
            <MenuItem className="react-contextmenu-item" onClick={() => this.setState({ colorModalShow: true })}>
              <FontAwesomeIcon icon={faPalette} style={{paddingRight: 10}}/>
              Change Color
            </MenuItem>
          </SubMenu>
        </ContextMenu>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="modal"
          open={this.state.colorModalShow}
          onClose={() => this.setState({ colorModalShow: false })}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.colorModalShow}>
            <div className="paper">
              <p id="transition-modal-title">Select Color</p>
              <SketchPicker color={this.state.newColor} onChange={(color) => this.setState({ newColor: color.hex })} className="sketch"/>
              <span className="buttons">
                <Button variant="outlined" size="medium" color="primary" onClick={() => this.setState({ colorModalShow: false })} className="done">
                  CANCEL
                </Button>
                <Button variant="outlined" size="medium" color="primary" onClick={() => { this.setState({ colorModalShow: false, color: this.state.newColor }) }} className="done">
                  SUBMIT
                </Button>
              </span>
            </div>
          </Fade>
        </Modal>
      </div>
    );
  }
}

export default WorkspaceNode;