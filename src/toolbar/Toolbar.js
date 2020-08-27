import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAltH, faImage, faFont } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";

import ToolbarNode from './ToolbarNode';
import Shapes from '../assets/Shapes';
import "./Toolbar.css";
import "./toolbar-contextmenu.css";

// fills in left to right, top to bottom
const TOOLBAR_ORDER = [
  Shapes.TYPES.RECT,
  Shapes.TYPES.ROUND_RECT,
  Shapes.TYPES.SQUARE,
  Shapes.TYPES.ROUNDED_SQUARE,
  Shapes.TYPES.DIAMOND,
  Shapes.TYPES.ROUNDED_DIAMOND,
  Shapes.TYPES.CIRCLE,
  Shapes.TYPES.ELLIPSE,
  Shapes.TYPES.LEFT_ARROW,
  Shapes.TYPES.RIGHT_ARROW,
  Shapes.TYPES.DOUBLE_ARROW,
  Shapes.TYPES.FOUR_ARROW,
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
      <div className='toolbar'>
        <ContextMenuTrigger id="shapes-menu" holdToDisplay={0}>
          <FontAwesomeIcon icon={faCircle} className="toolbar-icon"/>
        </ContextMenuTrigger>
        <FontAwesomeIcon icon={faArrowsAltH} className="toolbar-icon"/>
        <FontAwesomeIcon icon={faFont} className="toolbar-icon"/>
        <FontAwesomeIcon icon={faImage} className="toolbar-icon"/>

        <ContextMenu id="shapes-menu" className="toolbar-contextmenu">
            <div className="nodes">
            {
              this.cols.map((types, i) => (
                <div key={i} className="node-col" style={{ order: i + 1 }}>
                  { types.map((type, typeIndex) => (
                  <MenuItem className="toolbar-context-menu-item">
                    <ToolbarNode key={typeIndex} type={type} />
                  </MenuItem>)
                  )}
                </div>
              ))
            }
            </div>
        </ContextMenu>
      </div>
    );
  }
}

export default Toolbar;