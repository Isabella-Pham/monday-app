import React from 'react';
import * as d3 from 'd3';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faEdit } from '@fortawesome/free-solid-svg-icons';

import WorkspaceNode from './WorkspaceNode';
import WorkspaceTools from './WorkspaceTools';
import Constants from '../../constants/constants';
import Shapes from '../../assets/shapes';
import '../styles/Workspace.css';
import '../styles/react-contextmenu.css';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import SketchPicker from 'react-color';
import '../styles/material-ui.css';
import WorkspaceLine from './WorkspaceLine';

class Workspace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nodes: [],
      colorModalShow: false,
      color: '#ffffff',
      newColor: '#ffffff',
      contextIndex: -1,
      copiedNode: undefined
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
      this.dummyMethod,
      this.pasteNode,
    ];

    for (let func of bindFunctions) {
      this[func.name] = this[func.name].bind(this);
    }
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
        this.setState({ colorModalShow: true, contextIndex: index });
        break;
      default:
        break;
    }
  }

  changeColor() {
    this.setState({ colorModalShow: false, color: this.state.newColor, newColor: "#FFFFFF" }, () => {
      this.updateNode(this.state.contextIndex, {
        fillColor: this.state.color
      })
    });
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
          <MenuItem className="react-contextmenu-item" onClick={this.dummyMethod}>
            <FontAwesomeIcon icon={faEdit} style={{ paddingRight: 10 }} />
              Edit Grid
          </MenuItem>
        </ContextMenu>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="modal"
          open={this.state.colorModalShow}
          onClose={() => this.setState({ colorModalShow: false })}
          closeAfterTransition
          disableEnforceFocus={true}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.colorModalShow}>
            <div className="paper">
              <p id="transition-modal-title">Select Color</p>
              <SketchPicker color={this.state.newColor} onChange={(color) => this.setState({ newColor: color.hex })} disableAlpha={true} className="sketch" />
              <span className="buttons">
                <Button variant="outlined" size="medium" color="primary" onClick={() => this.setState({ colorModalShow: false })} className="done">
                  Cancel
                </Button>
                <Button variant="outlined" size="medium" color="primary" onClick={this.changeColor} className="done">
                  Submit
                </Button>
              </span>
            </div>
          </Fade>
        </Modal>
        {this.state.nodes.map((item, i) =>
          Shapes.isLine(item.type) ?
            <WorkspaceLine
              updateSelf={this.updateNode}
              onDelete={this.deleteNode}
              onDuplicate={this.duplicateNode}
              onShift={this.shiftNode}
              onContextChange={this.contextChange}
              copySelf={this.storeCopiedNode}
              index={i}
              menuId={item.key}
              key={item.key}
              attributes={item}
            /> :
            <WorkspaceNode
              updateSelf={this.updateNode}
              onDelete={this.deleteNode}
              onDuplicate={this.duplicateNode}
              onShift={this.shiftNode}
              onContextChange={this.contextChange}
              copySelf={this.storeCopiedNode}
              index={i}
              menuId={item.key}
              key={item.key}
              attributes={item}
            />
        )}
      </div>
    );
  }
}

export default Workspace;