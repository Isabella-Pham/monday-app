import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import "./Toolbar.css";
import Constants from '../constants/constants';

const monday = Constants.monday;

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
    this.hide = this.hide.bind(this);
  }

  hide() {
    this.setState({ hidden: !this.state.hidden });
    monday.api('query { users { name } }').then(res => {
      console.log(res);
    })
  }

  render() {
    return (
        <div className={'toolbar' + (this.state.hidden ? ' hidden': '')}>
          <div className="nodes">{this.props.children}</div>
          <FontAwesomeIcon
            icon={this.state.hidden ? faChevronRight : faChevronLeft}
            onClick={this.hide}
            size="lg"
            className="toolbar-toggle"/>
        </div>
    );
  }
}

export default Toolbar;