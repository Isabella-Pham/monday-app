import React from 'react';
import * as d3 from 'd3';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faEdit } from '@fortawesome/free-solid-svg-icons';

import WorkspaceNode from './WorkspaceNode';
import WorkspaceLine from './WorkspaceLine';
import WorkspaceText from './WorkspaceText';
import WorkspaceTools from './WorkspaceTools';
import Constants from '../../constants/constants';
import Shapes from '../../assets/shapes';
import '../styles/Workspace.css';
import '../styles/react-contextmenu.css';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SketchPicker from 'react-color';
import '../styles/material-ui.css';

class Workspace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: [],
      colorModalShow: false,
      gridModalShow: false,
      validWidth: false,
      validHeight: false,
      gridButtonIsDisabled: true,
      textModalShow: false,
      newColor: '#ffffff',
      newBorder: "#ffffff",
      newText: '',
      newWidth: -1,
      newHeight: -1,
      contextIndex: -1,
      copiedNode: undefined,
      contextIsNode: false
    };

    let bindFunctions = [
      this.addNode,
      this.drawWorkspace,
      this.deleteNode,
      this.duplicateNode,
      this.shiftNode,
      this.updateNode,
      this.incZoom,
      this.decZoom,
      this.removeGrid,
      this.toggleGrid,
      this.storeCopiedNode,
      this.contextChange,
      this.changeColor,
      this.changeText,
      this.dummyMethod,
      this.pasteNode,
      this.handleTextChange,
      this.handleGridChange,
      this.changeGrid
    ];

    for (let func of bindFunctions) {
      this[func.name] = this[func.name].bind(this);
    }

    this.widthInput = React.createRef();
    this.heightInput = React.createRef();
  }

  componentDidMount() {
    this.drawWorkspace();
    window.addEventListener('resize', this.drawWorkspace, false);
    window.addEventListener('resize', this.forceUpdate, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawWorkspace, false);
    window.removeEventListener('resize', this.forceUpdate, false);
  }

  incZoom() {
    if (Constants.WORKSPACE_SETTINGS.canInc()) {
      Constants.WORKSPACE_SETTINGS.incZoom();
      this.drawWorkspace();
      this.forceUpdate();
    }
  }

  decZoom() {
    if (Constants.WORKSPACE_SETTINGS.canDec()) {
      Constants.WORKSPACE_SETTINGS.decZoom()
      this.drawWorkspace();
      this.forceUpdate();
    }
  }

  drawWorkspace() {
    let gridPixels = Constants.WORKSPACE_SETTINGS.getWorkspacePixels();
    let gridWidth = gridPixels.width;
    let gridHeight = gridPixels.height;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    this.removeGrid();

    let gridSvg = d3.select('.grid')
      .style('width', gridWidth)
      .style('height', gridHeight);

    let widthTooSmall = windowWidth <= gridWidth;
    let heightTooSmall = windowHeight <= gridHeight;

    let translateX = widthTooSmall ? '0%' : '50%';
    d3.select('.workspace').style('width', `${widthTooSmall ? gridWidth : windowWidth}px`);
    gridSvg.style('left', translateX);

    let translateY = heightTooSmall ? '0%' : '50%';
    d3.select('.workspace').style('height', `${heightTooSmall ? gridHeight : windowHeight}px`);
    gridSvg.style('top', translateY);

    gridSvg.style('transform', `translate(-${translateX}, -${translateY})`)

    let offsetX = widthTooSmall ? 0 : parseFloat(windowWidth - gridWidth) / 2;
    let offsetY = heightTooSmall ? 0 : parseFloat(windowHeight - gridHeight) / 2;
    Constants.setGridOffset(offsetX, offsetY);

    if (Constants.gridEnabled) {
      gridSvg.append('g')
        .attr('class', 'grid-lines')
        .selectAll('line')
        .data(d3.range(Constants.WORKSPACE_SETTINGS.getHorizontalBoxes() + 1))
        .enter()
        .append('line')
        .attr('class', 'grid-line')
        .attr('x1', (d, i) => i)
        .attr('y1', 0)
        .attr('x2', (d, i) => i)
        .attr('y2', gridHeight)
        .attr('stroke', '#000000')
        .attr('stroke-width', '0.05')
        .exit()
        .data(d3.range(Constants.WORKSPACE_SETTINGS.getVerticalBoxes() + 1))
        .enter()
        .append('line')
        .attr('class', 'grid-line')
        .attr('x1', 0)
        .attr('y1', (d, i) => i)
        .attr('x2', gridWidth)
        .attr('y2', (d, i) => i)
        .attr('stroke', '#000000')
        .attr('stroke-width', '0.05');
    }

    this.forceUpdate();
  }

  removeGrid() {
    d3.select('.grid').select('.grid-lines').remove();
  }

  addNode(attributes) {
    attributes.key = Constants.getUniqueReactKey();
    let newNodes = this.state.nodes.concat(attributes);
    this.setState({
      nodes: newNodes
    });
  }

  duplicateNode(index) {
    let attributes = Object.assign({}, this.state.nodes[index]);
    if (Shapes.isLine(attributes.type)) {
      let newX = attributes.x + 1;
      let newY = attributes.y + 1;
      let dX = attributes.endX - attributes.x;
      let dY = attributes.endY - attributes.y;
      let adjustedCoord = Constants.getAdjustedLine(newX, newY, dX, dY);
      attributes.x = adjustedCoord.x;
      attributes.y = adjustedCoord.y;
      attributes.endX = adjustedCoord.x + dX;
      attributes.endY = adjustedCoord.y + dY;
    }
    else {
      let newX = attributes.x + 1;
      let newY = attributes.y + 1;
      let adjustedCoord = Constants.getAdjustedCoord(newX, newY, attributes.width, attributes.height);
      attributes.x = adjustedCoord.x;
      attributes.y = adjustedCoord.y;
    }
    this.addNode(attributes);
  }

  shiftNode(index, moveToFront = true) {
    let newNodes = this.state.nodes.slice();
    if (moveToFront) {
      newNodes.push(newNodes.splice(index, 1)[0]);
    }
    else {
      newNodes.unshift(newNodes.splice(index, 1)[0]);
    }
    this.setState({
      nodes: newNodes
    });
  }

  deleteNode(index) {
    this.setState({
      nodes: this.state.nodes.filter((v, i) => {
        return i !== index;
      })
    });
  }

  updateNode(index, props) {
    let newNodes = this.state.nodes.slice();
    newNodes[index] = {
      ...newNodes[index],
      ...props
    };
    this.setState({ nodes: newNodes });
  }

  getGraphJson() {
    return {
      nodes: this.state.nodes.slice(),
      settings: {
        zoom: Constants.ZOOM_SETTINGS,
        verticalBoxCount: Constants.WORKSPACE_SETTINGS.getVerticalBoxes(),
        horizontalBoxCount: Constants.WORKSPACE_SETTINGS.getHorizontalBoxes()
      }
    };
  }

  toggleGrid() {
    if (Constants.gridToggle()) {
      this.drawWorkspace();
      window.addEventListener('resize', this.drawWorkspace);
    } else {
      this.removeGrid();
      window.removeEventListener('resize', this.drawWorkspace);
    }
  }

  storeCopiedNode(index) {
    this.setState({
      copiedNode: Object.assign({}, this.state.nodes[index])
    });
  }

  dummyMethod() {
    console.log('Dummy method');
  }

  pasteNode(e) {
    let copiedNode = Object.assign({}, this.state.copiedNode);
    if (copiedNode !== undefined) {
      let offset = Constants.getGridOffset();
      let xCoord, yCoord, width, height;
      if (Shapes.isLine(copiedNode.type)) {
        width = copiedNode.endX - copiedNode.x;
        height = copiedNode.endY - copiedNode.y;
        if (Constants.gridEnabled) {
          let closestCoord = Constants.getClosestPosition(e.pageX, e.pageY);
          xCoord = Constants.getGridCoord(closestCoord.x, width, offset.x);
          yCoord = Constants.getGridCoord(closestCoord.y, height, offset.y);
        }
        else {
          xCoord = Constants.getGridCoord(e.pageX, width, offset.x);
          yCoord = Constants.getGridCoord(e.pageY, height, offset.y);
        }
        let adjustedCord = Constants.getAdjustedLine(
          xCoord,
          yCoord,
          width,
          height
        );
        copiedNode = {
          ...copiedNode,
          x: adjustedCord.x,
          y: adjustedCord.y,
          endX: adjustedCord.x + width,
          endY: adjustedCord.y + height
        };
      }
      else if (copiedNode.type === Shapes.TYPES.TEXT_BOX) {
        width = copiedNode.width * Constants.ZOOM_SETTINGS;
        height = copiedNode.height * Constants.ZOOM_SETTINGS;

        if (Constants.gridEnabled) {
          let closestCoord = Constants.getClosestPosition(e.pageX, e.pageY);
          xCoord = Constants.getGridCoord(closestCoord.x, width, offset.x);
          yCoord = Constants.getGridCoord(closestCoord.y, height, offset.y);
        }
        else {
          xCoord = Constants.getGridCoord(e.pageX, width, offset.x);
          yCoord = Constants.getGridCoord(e.pageY, height, offset.y);
        }

        let adjustedCord = Constants.getAdjustedCoord(
          xCoord,
          yCoord,
          copiedNode.width,
          copiedNode.height
        );
        copiedNode = {
          ...copiedNode,
          ...adjustedCord
        }
      } 
      else {
        let gridDimensions = Shapes.getDefaultDimensions(copiedNode.type);
        width = gridDimensions.width * copiedNode.multiplier * Constants.ZOOM_SETTINGS;
        height = gridDimensions.height * copiedNode.multiplier * Constants.ZOOM_SETTINGS;

        if (Constants.gridEnabled) {
          let closestCoord = Constants.getClosestPosition(e.pageX, e.pageY);
          xCoord = Constants.getGridCoord(closestCoord.x, width, offset.x);
          yCoord = Constants.getGridCoord(closestCoord.y, height, offset.y);
        }
        else {
          xCoord = Constants.getGridCoord(e.pageX, width, offset.x);
          yCoord = Constants.getGridCoord(e.pageY, height, offset.y);
        }

        let adjustedCord = Constants.getAdjustedCoord(
          xCoord,
          yCoord,
          copiedNode.width,
          copiedNode.height
        );
        copiedNode = {
          ...copiedNode,
          ...adjustedCord
        }
      }
      this.addNode(copiedNode);
    }
  }

  contextChange(index, action) {
    switch (action) {
      case "color":
        this.setState({ colorModalShow: true, contextIndex: index, newColor: this.state.nodes[index].fillColor }, () => {
          if (!Shapes.isLine(this.state.nodes[index].type) && this.state.nodes[index].type !== Shapes.TYPES.TEXT_BOX) {
            console.log("HERE");
            this.setState({ contextIsNode: true })
          }
        });
        break;
      case "text":
        this.setState({ textModalShow: true, contextIndex: index, newText: this.state.nodes[index].text });
        break;
      case "grid":
        this.setState({ 
          gridModalShow: true, 
        })
        break;
      default:
        break;
    }
  }

  changeColor() {
    if (this.state.contextIsNode) {
      this.setState({ colorModalShow: false, contextIsNode: false}, () => {
        this.updateNode(this.state.contextIndex, {
          fillColor: this.state.newColor,
          borderColor: this.state.newBorder
        })
      });
    } else {
      this.setState({ colorModalShow: false, contextIsNode: false}, () => {
        this.updateNode(this.state.contextIndex, {
          fillColor: this.state.newColor
        })
      });
    }
  }

  handleTextChange(e) {
    this.setState({ newText: e.target.value })
  }

  changeText() {
    this.setState({ textModalShow: false }, () => {
      this.updateNode(this.state.contextIndex, {
        text: this.state.newText.trim()
      })
    });
  }

  gridDimensionsValid() {
    return this.state.newWidth >= Constants.MIN_GRID && this.state.newWidth <= Constants.MAX_GRID && this.state.newHeight >= Constants.MIN_GRID && this.state.newHeight <= Constants.MAX_GRID
  }

  handleGridChange(e) {
    let intVal = Constants.getInteger(e.target.value)
    console.log(intVal);

    console.log(e.target)

    if (!isNaN(intVal)) {
      if (this.widthInput.current.contains(e.target)) {
        this.setState({ newWidth: intVal }, () => {
            this.setState({ gridButtonIsDisabled: !this.gridDimensionsValid() })
        })
      } else if (this.heightInput.current.contains(e.target)) {
        this.setState({ newHeight: intVal }, () => {
          this.setState({ gridButtonIsDisabled: !this.gridDimensionsValid() })
        })
      }
    } else {
      this.setState({ gridButtonIsDisabled: true })
    }

    console.log(this.state.newWidth, this.state.newHeight)
  }

  changeGrid() {
    if (!this.gridDimensionsValid()) {
      return;
    }

    let newWidth = this.state.newWidth;
    let newHeight = this.state.newHeight;

    let newNodes = this.state.nodes.filter(attributes => {
      if (Shapes.isLine(attributes.type)) {
        let startIncluded = attributes.x <= newWidth && attributes.y <= newHeight;
        let endIncluded = attributes.endX <= newWidth && attributes.endY <= newHeight;
        return startIncluded && endIncluded;
      }
      else if (attributes.type === Shapes.TYPES.TEXTBOX) {
        return attributes.x + attributes.width <= newWidth && attributes.y + attributes.height <= newHeight;
      }
      else {
        let nodeDimensions = Shapes.getDefaultDimensions(attributes.type);
        let width = nodeDimensions.width * attributes.multiplier;
        let height = nodeDimensions.height * attributes.multiplier;
        return attributes.x + width <= newWidth && attributes.y + height <= newHeight;
      }
    });

    Constants.WORKSPACE_SETTINGS.setHorizontalBoxes(this.state.newWidth);
    Constants.WORKSPACE_SETTINGS.setVerticalBoxes(this.state.newHeight);
    this.setState({ nodes: newNodes, gridModalShow: false });
    this.drawWorkspace();
  }

  render() {
    return (
      <div className="workspace">
        <WorkspaceTools
          incZoom={this.incZoom}
          decZoom={this.decZoom}
          toggleGrid={this.toggleGrid} />
        <ContextMenuTrigger id="gridContextMenu" holdToDisplay={-1}>
          <svg className="grid" viewBox={`0 0 ${Constants.WORKSPACE_SETTINGS.getHorizontalBoxes()} ${Constants.WORKSPACE_SETTINGS.getVerticalBoxes()}`}>

          </svg>
        </ContextMenuTrigger>
        <ContextMenu id="gridContextMenu" className="react-contextmenu">
          <MenuItem disabled={this.state.copiedNode === undefined} className="react-contextmenu-item" onClick={this.pasteNode}>
            <FontAwesomeIcon icon={faClipboard} style={{ paddingRight: 10 }} />
              Paste
          </MenuItem>
          <MenuItem className="react-contextmenu-item" onClick={() => this.contextChange(-1, "grid")}>
            <FontAwesomeIcon icon={faEdit} style={{ paddingRight: 10 }} />
              Edit Grid
          </MenuItem>
        </ContextMenu>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="modal"
          open={this.state.colorModalShow}
          onClose={() => this.setState({ colorModalShow: false, contextIsNode: false })}
          closeAfterTransition
          disableEnforceFocus={true}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.colorModalShow}>
            <div className="paper">
              <p id="transition-modal-title"><b>Select Color</b></p>
              <div style={this.state.contextIsNode ? { display: "flex" } : { display: "block" }}>
                <div className="sketch">
                  {this.state.contextIsNode ? <p>Fill</p> : null}
                  <SketchPicker color={this.state.newColor} onChange={(color) => this.setState({ newColor: color.hex })} disableAlpha={true} className="picker" />
                </div>
                {this.state.contextIsNode ? 
                <div className="sketch">
                  <p>Border</p>
                  <SketchPicker color={this.state.newBorder} onChange={(color) => this.setState({ newBorder: color.hex })} disableAlpha={true} className="picker" />
                </div>
                : null
                }
              </div>
              <span className={this.state.contextIsNode ? "color-buttons-2" : "color-buttons"}>
                <Button variant="outlined" size="medium" color="primary" onClick={() => this.setState({ colorModalShow: false, contextIsNode: false })} className="done">
                  Cancel
                </Button>
                <Button variant="outlined" size="medium" color="primary" onClick={this.changeColor} className="done">
                  Submit
                </Button>
              </span>
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="modal"
          open={this.state.textModalShow}
          onClose={() => this.setState({ textModalShow: false })}
          closeAfterTransition
          disableEnforceFocus={true}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.textModalShow}>
            <div className="paper">
              <p id="transition-modal-title">Edit Text</p>
              <TextField id="outlined-basic" label="Enter Text" value={this.state.newText} variant="outlined" multiline={true} onChange={this.handleTextChange} style={{ paddingBottom: 20 }}/>
              <span className="text-buttons">
                <Button variant="outlined" size="medium" color="primary" onClick={() => this.setState({ textModalShow: false })} className="done">
                  Cancel
                </Button>
                <Button variant="outlined" size="medium" color="primary" onClick={this.changeText} className="done">
                  Submit
                </Button>
              </span>
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="modal"
          open={this.state.gridModalShow}
          onClose={() => this.setState({ gridModalShow: false })}
          closeAfterTransition
          disableEnforceFocus={true}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.gridModalShow}>
            <div className="paper">
              <p id="transition-modal-title">Enter Grid Dimensions (10-1000 Boxes)</p>
              <p style={{fontSize: 14}}>Nodes outside the new grid will be removed</p>
              <span className="grid-fields">
                <TextField ref={this.widthInput} id="outlined-basic" label="Width" variant="outlined" multiline={false} onChange={this.handleGridChange} style={{ paddingBottom: 20, paddingRight: 60 }}/>
                <TextField ref={this.heightInput} id="outlined-basic" label="Height" variant="outlined" multiline={false} onChange={this.handleGridChange} style={{ paddingBottom: 20 }}/>
              </span>
              <span className="grid-buttons">
                <Button variant="outlined" size="medium" color="primary" onClick={() => this.setState({ gridModalShow: false })} className="done">
                  Cancel
                </Button>
                <Button variant="outlined" size="medium" color="primary" disabled={this.state.gridButtonIsDisabled} onClick={this.changeGrid} className="done">
                  Submit
                </Button>
              </span>
            </div>
          </Fade>
        </Modal>
        {this.state.nodes.map((attributes, i) => {
          if (Shapes.isLine(attributes.type)) {
            return <WorkspaceLine
              updateSelf={this.updateNode}
              onDelete={this.deleteNode}
              onDuplicate={this.duplicateNode}
              onShift={this.shiftNode}
              onContextChange={this.contextChange}
              copySelf={this.storeCopiedNode}
              index={i}
              menuId={attributes.key}
              key={attributes.key}
              attributes={attributes}
            />
          } else if (attributes.type === Shapes.TYPES.TEXT_BOX) {
            return <WorkspaceText
              updateSelf={this.updateNode}
              onDelete={this.deleteNode}
              onDuplicate={this.duplicateNode}
              onShift={this.shiftNode}
              onContextChange={this.contextChange}
              copySelf={this.storeCopiedNode}
              index={i}
              menuId={attributes.key}
              key={attributes.key}
              attributes={attributes}
            />
          } else {
            return <WorkspaceNode
              updateSelf={this.updateNode}
              onDelete={this.deleteNode}
              onDuplicate={this.duplicateNode}
              onShift={this.shiftNode}
              onContextChange={this.contextChange}
              copySelf={this.storeCopiedNode}
              index={i}
              menuId={attributes.key}
              key={attributes.key}
              attributes={attributes}
            />
          }
      })}
      </div>
    );
  }
}

export default Workspace;