import React from 'react';
import * as d3 from 'd3';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchMinus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';

import './Workspace.css';
import WorkspaceNode from './WorkspaceNode';
import Constants from '../constants/constants';

class Workspace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        nodes: [],
        scrolling: {
          enabled: false,
          xDis: 0,
          yDis: 0
        }
    }

    this.addNode = this.addNode.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
    this.startScroll = this.startScroll.bind(this);
    this.endScroll = this.endScroll.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.incZoom = this.incZoom.bind(this);
    this.decZoom = this.decZoom.bind(this);

    this.counter = 0;
  }

  componentDidMount() {
    this.drawGrid();
    window.addEventListener('resize', this.drawGrid);
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
      let oldZoom = Constants.WORKSPACE_SETTINGS.incZoom();
      this.updateZoom(oldZoom);
    }
  }

  decZoom() {
    if (Constants.WORKSPACE_SETTINGS.canDec()) {
      let oldZoom = Constants.WORKSPACE_SETTINGS.decZoom();
      this.updateZoom(oldZoom);
    }
  }

  updateZoom(oldZoom) {
    console.log(oldZoom, Constants.ZOOM_SETTINGS);
    let newNodes = this.state.nodes.map(node => {
      let tempNode = Object.assign({}, node);
      tempNode.x = (parseFloat(node.x) / oldZoom) * Constants.ZOOM_SETTINGS;
      tempNode.y = (parseFloat(node.y) / oldZoom) * Constants.ZOOM_SETTINGS;
      return tempNode;
    });
    this.setState({
      nodes: newNodes
    }, () => this.drawGrid());
  }

  drawGrid() {
    let gridDimension = Constants.ZOOM_SETTINGS;
    let width = parseFloat(d3.select('.workspace').style('width').split('px')[0]);
    let height = parseFloat(d3.select('.workspace').style('height').split('px')[0]);
    let horizontalBoxCount = Math.ceil(width/gridDimension);
    let verticalBoxCount = Math.ceil(height/gridDimension);
    
    d3.select('.workspace').select('.grid').remove();

    let svg = d3.select('.workspace')
      .append('svg')
      .attr('class', 'grid')
      .attr('width', '100%')
      .attr('height', '100%');
    svg.selectAll('line')
      .data(d3.range(horizontalBoxCount))
      .enter()
      .append('line')
      .attr('x1', (d, i) => gridDimension * i)
      .attr('y1', this.state.startY)
      .attr('x2', (d, i) => gridDimension * i)
      .attr('y2', height)
      .attr('stroke', '#000000')
      .attr('stroke-width', '0.5')
      .exit()
      .data(d3.range(verticalBoxCount))
      .enter()
      .append('line')
      .attr('x1', this.state.startX)
      .attr('y1', (d, i) => gridDimension * i)
      .attr('x2', width)
      .attr('y2', (d, i) => gridDimension * i)
      .attr('stroke', '#000000')
      .attr('stroke-width', '0.5');
  }

  addNode(attributes) {
    attributes.key = Constants.getUniqueReactKey();
    let newNodes = this.state.nodes.concat(attributes);
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

  render() {
    if (this.state.scrolling.enabled) {
      window.scrollBy(this.state.scrolling.xDis, this.state.scrolling.yDis);
    }
    return (
      <div className="workspace">
        <FontAwesomeIcon
          icon={faSearchPlus}
          onClick={this.incZoom}
          size="lg"
          style={{
            position: 'absolute',
            border: 'none',
            left: '20%',
            top: '5%',
            transform: 'translate(10px, -5%)'
          }}/>
          {this.state.nodes.map((item, i) =>
            <WorkspaceNode
            startScroll={this.startScroll}
            endScroll={this.endScroll}
            updateSelf={this.updateNode}
            onDelete={this.deleteNode}
            index={i}
            key={item.key}
            attributes={item}/>
          )}
      </div>
    );
  }
}

export default Workspace;