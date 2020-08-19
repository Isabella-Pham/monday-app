import React from 'react';
import * as d3 from 'd3';
import './Workspace.css';
import WorkspaceNode from './WorkspaceNode';

class Workspace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        nodes: []
    }

    this.addNode = this.addNode.bind(this);
  }

  componentDidMount() {

  }

  addNode(attributes) {
    let newNodes = this.state.nodes.concat(attributes);
    this.setState({
        nodes: newNodes
    });
  }

  render() {
    return (
      <div className="workspace">
          {this.state.nodes.map((item, i) =>
            <WorkspaceNode key={i} attributes={item}/>
          )}
      </div>
    )
  }
}

export default Workspace;