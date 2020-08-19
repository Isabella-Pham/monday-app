import React from 'react';
import * as d3 from 'd3';
import './Workspace.css';
import Constants from '../constants/constants';

let { verticalBoxCount } = Constants;

class Workspace extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  addNode(attributes) {
  }

  render() {
    return (
      <div className="workspace">
      </div>
    )
  }
}

export default Workspace;