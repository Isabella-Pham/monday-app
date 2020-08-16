import React from "react";
import "./Toolbar.css";
import TransitionNode from './TransitionNode'

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false
    };
  }

  render() {
    return (
        <div className={'toolbar' + (this.state.hidden ? ' hidden': '')}>
          <button
            onClick={() => {
              this.setState({ hidden: !this.state.hidden })
            }}
            className="toggle-menu"
          ></button>
          <div className="nodes">{this.props.children}</div>
        </div>
    );
  }
}

export default Toolbar;