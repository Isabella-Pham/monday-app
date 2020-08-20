import React from 'react';
import * as d3 from 'd3';
import './Workspace.css';
import WorkspaceNode from './WorkspaceNode';
import Constants from '../constants/constants';

class Workspace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        nodes: []
    }

    this.addNode = this.addNode.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.deleteNode = this.deleteNode.bind(this);

    this.counter = 0;
  }

  componentDidMount() {
    this.drawGrid();
    window.addEventListener('resize', this.drawGrid);
  }

  drawGrid() {
    console.log('Drawing grid...');
    let gridDimension = Constants.ZOOM_SETTINGS.DEFAULT;
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
      .attr('y1', '0')
      .attr('x2', (d, i) => gridDimension * i)
      .attr('y2', height)
      .attr('stroke', '#000000')
      .attr('stroke-width', '0.5')
      .exit()
      .data(d3.range(verticalBoxCount))
      .enter()
      .append('line')
      .attr('x1', '0')
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

  render() {
    return (
      <div className="workspace">
          {this.state.nodes.map((item, i) =>
            <WorkspaceNode
            onDelete={this.deleteNode}
            index={i}
            key={item.key}
            attributes={item}/>
          )}
      </div>
    )
  }
}

export default Workspace;