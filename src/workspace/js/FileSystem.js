import React from 'react';
import '../styles/FileSystem.css';

import Button from '@material-ui/core/Button';

class FileSystem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: -1
    }

    this.handleSelection = this.handleSelection.bind(this);
    this.loadGraph = this.loadGraph.bind(this);
    this.deleteGraph = this.deleteGraph.bind(this);
    this.newGraph = this.newGraph.bind(this);
  }

  handleSelection(e) {
    if (e.target.tagName.toLowerCase() === "li") {
      let index = parseInt(e.target.getAttribute('data-graph-index'));
      
      this.setState({ selectedIndex: (index !== this.state.selectedIndex) ? index : -1 })
    } else {
      this.setState({ selectedIndex: -1 })
    }
  }

  loadGraph() {
    if (this.state.selectedIndex >= 0) {
      this.props.load(window.graphs[this.state.selectedIndex]);
    }
  }

  deleteGraph() {
    if (this.state.selectedIndex >= 0) {
      this.props.delete(window.graphs[this.state.selectedIndex]);
    }
  }

  newGraph() {
    this.props.new();
  }

  render() {
    return (
      <div className={'file-system' + (this.props.open ? '' : ' off')}>
        <div className='system-header'>
          Saved Graphs
        </div>
        <div className="saved-graphs" onClick={this.handleSelection}>
          <ul className="graph-list">
            {window.graphs ? window.graphs.map((item, i) => {
              return (
                <li className={(this.state.selectedIndex === i) ? "selected" : ""} key={i} data-graph-index={i}>
                  {item.name}
                </li>
              )
            }) : null }
          </ul>
        </div>
        <div className="file-options">
          <div className="option-group">
            <Button variant="outlined" className="file-buttons load" 
                    style={this.state.selectedIndex >= 0 ? {borderColor: "#007fff", color: "#007fff"} : {borderColor: "#878787", color: "#878787", opacity: 0.5}}
                    disabled={this.state.selectedIndex < 0}
                    onClick={this.loadGraph}>
              Load
            </Button>
            <Button variant="outlined" className="file-buttons load" 
                    style={this.state.selectedIndex >= 0 ? {borderColor: "red", color: "red"} : {borderColor: "#878787", color: "#878787", opacity: 0.5}}
                    disabled={this.state.selectedIndex < 0}
                    onClick={this.deleteGraph}>
              Delete
            </Button>
          </div>
          <div className="option-group">
            <Button variant="outlined" className="file-buttons new" style={{ borderColor: "#16a800", color: "#16a800" }} onclick={this.newGraph}>
              New
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default FileSystem;