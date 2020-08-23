import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import ToolbarNode from './ToolbarNode';
import Shapes from '../assets/Shapes';
import "./Toolbar.css";

// fills in left to right, top to bottom
const TOOLBAR_ORDER = [
  Shapes.TYPES.RECT,
  Shapes.TYPES.ROUND_RECT,
  Shapes.TYPES.ELLIPSE,
  Shapes.TYPES.DIAMOND,
  Shapes.TYPES.CIRCLE
];
const COL_COUNT = 3;

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
    this.hide = this.hide.bind(this);
    this.cols = new Array(COL_COUNT);
    var i;
    for (i = 0; i < COL_COUNT; i++) {
      this.cols[i] = [];
    }
    for (i = 0; i < TOOLBAR_ORDER.length; i++) {
      this.cols[i % COL_COUNT].push(TOOLBAR_ORDER[i]);
    }
  }

  hide() {
    this.setState({ hidden: !this.state.hidden });
  }

  render() {
    return (
      <div className={'toolbar' + (this.state.hidden ? ' hidden' : '')}>
        <div className="nodes">
          {
            this.cols.map((types, i) => (
              <div key={i} className="node-col" style={{ order: i+1 }}>
                { types.map((type, typeIndex) => <ToolbarNode key={typeIndex} type={type} />) }
              </div>
           ))
          }
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