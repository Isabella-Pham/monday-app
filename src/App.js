import React from "react";

import getSocketClient from './socketClient';

import Workspace from './workspace/js/Workspace';
import WorkspaceNode from './workspace/js/WorkspaceNode';
import WorkspaceText from "./workspace/js/WorkspaceText";
import WorkspaceImage from "./workspace/js/WorkspaceImage";
import WorkspaceLine from "./workspace/js/WorkspaceLine";
import Toolbar from './toolbar/js/Toolbar';
import ToolbarNode from './toolbar/js/ToolbarNode';
import TransitionNode from './toolbar/js/TransitionNode';
import Shapes from './assets/shapes';
import Constants from './constants/constants';
import "./App.css";
import { mondayClient } from "./mondayClient";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {},
      name: "",
      transitionNode: {
        inTransition: false,
        x: -1,
        y: -1,
        width: 0,
        height: 0,
        type: -1
      }
    };

    this._workspace = React.createRef();
    this.socket = getSocketClient(3001);
    this.showTransitionNode = this.showTransitionNode.bind(this);
    this.hideTransitionNode = this.hideTransitionNode.bind(this);
    this.updateTransitionNode = this.updateTransitionNode.bind(this);
  }

  componentDidMount() {
    this.socket.on('connect', function() {
      this.socket.send(JSON.stringify({
        notification: 'lets goooo',
        params: {

        },
      }))
    }.bind(this));

    Constants.setMondayClient(new mondayClient());
  }
  
  showTransitionNode(e) {
    const x = e.pageX;
    const y = e.pageY;
    const nodeType = parseInt(e.currentTarget.getAttribute('data-type'));
    const dimensions = Shapes.getDefaultDimensions(nodeType);
    this.setState(prevState => ({
      transitionNode: {
        ...prevState.transitionNode,
        inTransition: true,
        width: dimensions.width * Constants.ZOOM_SETTINGS,
        height: dimensions.height * Constants.ZOOM_SETTINGS,
        type: nodeType
      }
    }), () => { 
      this.setTransitionNodePosition(x, y);
    });
  }

  hideTransitionNode(e) {
    if (this.state.transitionNode.inTransition) {
      const pageX = e.pageX;
      const pageY = e.pageY;
      this.setState(prevState => ({
        transitionNode: {
          ...prevState.transitionNode,
          inTransition: false
        }
      }), () => {
        let offset = Constants.getGridOffset();
        let width = this.state.transitionNode.width;
        let height = this.state.transitionNode.height;
        let xCoord, yCoord;

        if (Constants.gridEnabled) {
          let closestCoord = Constants.getClosestPosition(pageX, pageY);
          xCoord = Constants.getGridCoord(closestCoord.x, width, offset.x);
          yCoord = Constants.getGridCoord(closestCoord.y, height, offset.y);
        }
        else {
          xCoord = Constants.getGridCoord(pageX, width, offset.x)
          yCoord = Constants.getGridCoord(pageY, height, offset.y);
        }

        let nodeType = this.state.transitionNode.type;
        let dimensions = Shapes.getDefaultDimensions(nodeType);
        if (Constants.coordIsValid(xCoord, yCoord, dimensions.width, dimensions.height)) {
          let nodeAttrs = {}
          if (Shapes.isLine(nodeType)) {
            nodeAttrs = WorkspaceLine.getDefault(xCoord, yCoord, nodeType)
          } else if (nodeType === Shapes.TYPES.TEXT_BOX) {
            nodeAttrs = WorkspaceText.getDefault(xCoord, yCoord, nodeType)
          } else if (nodeType === Shapes.TYPES.IMAGE) {
            nodeAttrs = WorkspaceImage.getDefault(xCoord, yCoord, nodeType)
          }else {
            nodeAttrs = WorkspaceNode.getDefault(xCoord, yCoord, nodeType)
          }
          this._workspace.current.addNode(nodeAttrs);
        }
        else {
          console.log('Out of grid');
        }
      });
    }
  }
  
  updateTransitionNode(e) {
    if (this.state.transitionNode.inTransition) {
      this.setTransitionNodePosition(e.pageX, e.pageY);
    } else {

    }
  }

  setTransitionNodePosition(x, y) {
    let closestCoord = Constants.gridEnabled ? Constants.getClosestPosition(x, y) : {
      x: x,
      y: y
    };
    this.setState(prevState => ({
      transitionNode: {
        ...prevState.transitionNode,
        x: closestCoord.x,
        y: closestCoord.y
      }
    }));
  }

  render() {
    ToolbarNode.onMouseDown = this.showTransitionNode;
    return(
      <div className="App non-drag" onMouseMove={this.updateTransitionNode} onMouseUp={this.hideTransitionNode}>
        <Toolbar onTransition={this.showTransitionNode}/>
        <Workspace ref={this._workspace}/>
        {this.state.transitionNode.inTransition ? 
          <TransitionNode
            x={this.state.transitionNode.x}
            y={this.state.transitionNode.y}
            width={this.state.transitionNode.width}
            height={this.state.transitionNode.height}/> : null
        }
      </div>
    );
  }
}

export default App;
