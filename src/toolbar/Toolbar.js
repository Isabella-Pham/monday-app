import React, {useState, useEffect} from "react";
import "./Toolbar.css";

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false
    };
  }

  render() {
    return (
        <div className={this.state.hidden ? 'toolbar hidden': 'toolbar'}>
          <button
            onClick={() => {
              this.setState({ hidden: !this.state.hidden })
            }}
            className="toggle-menu"
            style={{
              transform: `translate(${this.props.width}, 50vh)`
            }}
          ></button>
          <div className="nodes">{this.props.children}</div>
        </div>
    );
  }
}

export default Toolbar;