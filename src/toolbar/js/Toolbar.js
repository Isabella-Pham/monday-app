import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsAltH, faImage, faFont } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";

import ToolbarNode from './ToolbarNode';
import Shapes from '../../assets/shapes';
import "../styles/Toolbar.css";
import "../styles/toolbar-contextmenu.css";

// fills in left to right, top to bottom
const SHAPES_ORDER = [
  Shapes.TYPES.RECT,
  Shapes.TYPES.ROUND_RECT,
  Shapes.TYPES.SQUARE,
  Shapes.TYPES.ROUNDED_SQUARE,
  Shapes.TYPES.POST_IT,
  Shapes.TYPES.DIAMOND,
  Shapes.TYPES.ROUNDED_DIAMOND,
  Shapes.TYPES.CIRCLE,
  Shapes.TYPES.ELLIPSE,
  Shapes.TYPES.UPRIGHT_CYLINDER,
  Shapes.TYPES.LEFT_ARROW,
  Shapes.TYPES.RIGHT_ARROW,
  Shapes.TYPES.DOUBLE_ARROW,
  Shapes.TYPES.FOUR_ARROW,
  Shapes.TYPES.UP_ARROW,
  Shapes.TYPES.DOWN_ARROW,
  Shapes.TYPES.DOUBLE_VERT_ARROW,
  Shapes.TYPES.FOUR_DIAG_ARROW
];
const SHAPE_COL_COUNT = 3;

const LINES_ORDER = [
  Shapes.TYPES.LINE,
  Shapes.TYPES.ARROW_LINE,
  Shapes.TYPES.DOUBLE_LINE
];
const LINE_COL_COUNT = 3;

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidden: false,
    };
    this.hide = this.hide.bind(this);
    this.menus = new Array(2);
    this.menus[0] = new Array(SHAPE_COL_COUNT);
    this.menus[1] = new Array(LINE_COL_COUNT);
    var i;
    for (i = 0; i < SHAPE_COL_COUNT; i++) {
      this.menus[0][i] = [];
    }
    for (i = 0; i < SHAPES_ORDER.length; i++) {
      this.menus[0][i % SHAPE_COL_COUNT].push(SHAPES_ORDER[i]);
    }
    for (i = 0; i < LINE_COL_COUNT; i++) {
      this.menus[1][i] = [];
    }
    for (i = 0; i < LINES_ORDER.length; i++) {
      this.menus[1][i % LINE_COL_COUNT].push(LINES_ORDER[i]);
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
        <ContextMenuTrigger id="lines-menu" holdToDisplay={0}>
          <FontAwesomeIcon icon={faArrowsAltH} className="toolbar-icon"/>
        </ContextMenuTrigger>
        <FontAwesomeIcon icon={faFont} className="toolbar-icon" data-type={Shapes.TYPES.TEXT_BOX} onMouseDown={this.props.onTransition}/>
        <FontAwesomeIcon icon={faImage} className="toolbar-icon" data-type={Shapes.TYPES.IMAGE} onMouseDown={this.props.onTransition}/>

        <ContextMenu id="shapes-menu" className="toolbar-contextmenu">
            <div className="nodes">
            {
              this.menus[0].map((types, i) => (
                <div key={i} className="node-col" style={{ order: i + 1 }}>
                  { types.map((type, typeIndex) => (
                  <MenuItem key={typeIndex} className="toolbar-context-menu-item">
                    <ToolbarNode type={type} />
                  </MenuItem>)
                  )}
                </div>
              ))
            }
            </div>
        </ContextMenu>
        <ContextMenu id="lines-menu" className="toolbar-contextmenu">
            <div className="nodes">
            {
              this.menus[1].map((types, i) => (
                <div key={i} className="node-col" style={{ order: i + 1 }}>
                  { types.map((type, typeIndex) => (
                  <MenuItem key={typeIndex} className="toolbar-context-menu-item">
                    <ToolbarNode type={type} />
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