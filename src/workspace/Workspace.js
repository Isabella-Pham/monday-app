import React from 'react';

import './Workspace.css';

class Workspace extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  addNode(attributes) {
    console.log('New node attributes: '+JSON.stringify(attributes, null, 4));
  }

  render() {
    return (
      <div className="workspace">
      </div>
    )
  }
}

export default Workspace;