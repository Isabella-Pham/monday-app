import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import "./Toolbar.css";
import ToolbarNode from './ToolbarNode';
import Shapes from '../assets/Shapes';
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
  }

  render() {
    return (
      <div className={'toolbar' + (this.state.hidden ? ' hidden' : '')}>
        <div className="nodes">
          <div className='node-col node-col-one'>
            <ToolbarNode type={Shapes.TYPES.RECT} />
            <ToolbarNode type={Shapes.TYPES.ROUND_RECT} />
          </div>
          <div className='node-col node-col-two'>
            <ToolbarNode type={Shapes.TYPES.DIAMOND} />
            <ToolbarNode type={Shapes.TYPES.ELLIPSE} />
          </div>
          <div className='node-col node-col-three'>
            <ToolbarNode type={Shapes.TYPES.CIRCLE} />
          </div>
        </div>
        <FontAwesomeIcon
          icon={this.state.hidden ? faChevronRight : faChevronLeft}
          onClick={this.hide}
          size="lg"
          className="toolbar-toggle" />
      </div>
    );
  }
}

export default Toolbar;