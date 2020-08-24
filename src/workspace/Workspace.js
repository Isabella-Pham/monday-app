import React from 'react';
import * as d3 from 'd3';

import WorkspaceNode from './WorkspaceNode';
import WorkspaceTools from './WorkspaceTools';
import Constants from '../constants/constants';
import './Workspace.css';

class Workspace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        nodes: [],
        scrolling: {
          enabled: false,
          xDis: 0,
          yDis: 0
        },
        horizontalBoxCount: Constants.WORKSPACE_SETTINGS.horizontalBoxes,
        verticalBoxCount: Constants.WORKSPACE_SETTINGS.verticalBoxes
    };

    this.addNode = this.addNode.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.duplicateNode = this.duplicateNode.bind(this);
    this.shiftNode = this.shiftNode.bind(this);
    this.startScroll = this.startScroll.bind(this);
    this.endScroll = this.endScroll.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.incZoom = this.incZoom.bind(this);
    this.decZoom = this.decZoom.bind(this);
    this.removeGrid = this.removeGrid.bind(this);
    this.toggleGrid = this.toggleGrid.bind(this);
    this.storeCopiedNode = this.storeCopiedNode.bind(this);
  }

  componentDidMount() {
    this.drawGrid();
    window.addEventListener('resize', this.drawGrid, false);
    window.addEventListener('resize', this.forceUpdate, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawGrid, false);
    window.removeEventListener('resize', this.forceUpdate, false);
  }

  startScroll(xDis, yDis) {
    this.setState({
      scrolling: {
        ...this.state.scrolling,
        enabled: true,
        xDis: xDis,
        yDis: yDis
      }
    });
  }

  endScroll() {
    this.setState({
      scrolling: {
        ...this.state.scrolling,
        enabled: false,
        xDis: 0,
        yDis: 0
      }
    });
  }

  incZoom() {
    if (Constants.WORKSPACE_SETTINGS.canInc()) {
      Constants.WORKSPACE_SETTINGS.incZoom();
      this.drawGrid();
      this.forceUpdate();
    }
  }

  decZoom() {
    if (Constants.WORKSPACE_SETTINGS.canDec()) {
      Constants.WORKSPACE_SETTINGS.decZoom()
      this.drawGrid();
      this.forceUpdate();
    }
  }

  drawGrid() {
    let gridDimension = Constants.ZOOM_SETTINGS;
    let gridWidth = this.state.horizontalBoxCount * gridDimension;
    let gridHeight = this.state.verticalBoxCount * gridDimension;
  
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

    let offsetX = widthTooSmall ? 0 : parseFloat(windowWidth-gridWidth)/2;
    let offsetY = heightTooSmall ? 0 : parseFloat(windowHeight-gridHeight)/2;
    Constants.setGridOffset(offsetX, offsetY);

    if (Constants.gridEnabled) {
      gridSvg.selectAll('line')
      .data(d3.range(this.state.horizontalBoxCount+1))
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', (d, i) => gridDimension * i)
      .attr('y1', 0)
      .attr('x2', (d, i) => gridDimension * i)
      .attr('y2', gridHeight)
      .attr('stroke', '#000000')
      .attr('stroke-width', '0.5')
      .exit()
      .data(d3.range(this.state.verticalBoxCount+1))
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('y1', (d, i) => gridDimension * i)
      .attr('x2', gridWidth)
      .attr('y2', (d, i) => gridDimension * i)
      .attr('stroke', '#000000')
      .attr('stroke-width', '0.5');
    }

    this.forceUpdate();
  }

  removeGrid() {
    d3.select('.grid').selectAll('.grid-line').remove();
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
    attributes.x++;
    attributes.y++;
    this.addNode(attributes);
  }

  shiftNode(index, moveToFront=true) {
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
    this.setState({nodes: this.state.nodes.filter((v, i) => {
      return i !== index;
    })});
  }

  updateNode(index, x, y) {
    let newNodes = this.state.nodes.slice();
    newNodes[index].x = x;
    newNodes[index].y = y;
    this.setState({nodes: newNodes});
  }

  getGraphJson() {
    return {
      nodes: this.state.nodes.slice(),
      settings: {
        zoom: Constants.ZOOM_SETTINGS,
        verticalBoxCount: this.state.verticalBoxCount,
        horizontalBoxCount: this.state.horizontalBoxCount
      }
    };
  }

  toggleGrid() {
    if (Constants.gridToggle()) {
      this.drawGrid();
      window.addEventListener('resize', this.drawGrid);
    } else {
      this.removeGrid();
      window.removeEventListener('resize', this.drawGrid);
    }
  }

  storeCopiedNode(index) {
    window.copiedNode = this.state.nodes[index];
    console.log("Storing index", index);
  }

  render() {
    return (
      <div className="workspace">
          <WorkspaceTools
            incZoom={this.incZoom}
            decZoom={this.decZoom}
            toggleGrid={this.toggleGrid}/>
          <svg className="grid">
          </svg>
          {this.state.nodes.map((item, i) =>
              <WorkspaceNode
              startScroll={this.startScroll}
              endScroll={this.endScroll}
              updateSelf={this.updateNode}
              onDelete={this.deleteNode}
              onDuplicate={this.duplicateNode}
              onShift={this.shiftNode}
              copySelf={this.storeCopiedNode}
              index={i}
              menu_id={item.key}
              key={item.key}
              attributes={item}
            />
          )}
      </div>
    );
  }
}

export default Workspace;