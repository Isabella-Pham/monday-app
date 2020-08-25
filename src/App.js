import React from "react";

import Workspace from './workspace/Workspace';
import WorkspaceNode from './workspace/WorkspaceNode';
import Toolbar from './toolbar/Toolbar';
import ToolbarNode from './toolbar/ToolbarNode';
import Shapes from './assets/Shapes';
import TransitionNode from './toolbar/TransitionNode';
import Constants from './constants/constants';
import "./App.css";

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

    this.showTransitionNode = this.showTransitionNode.bind(this);
    this.hideTransitionNode = this.hideTransitionNode.bind(this);
    this.updateTransitionNode = this.updateTransitionNode.bind(this);
  }

  componentDidMount() {
    
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

  transitionBeyondToolbar(x, y) {
    return x - (Constants.cursorCentered ? (this.state.transitionNode.width / 2) : 0) > Constants.viewportToPixels('20vw');
  }

  hideTransitionNode(e) {
    if (this.state.transitionNode.inTransition) {
      const pageX = e.pageX;
      const pageY = e.pageY;
      const clientX = e.clientX;
      const clientY = e.clientY;
      this.setState(prevState => ({
        transitionNode: {
          ...prevState.transitionNode,
          inTransition: false
        }
      }), () => {
        if (this.transitionBeyondToolbar(clientX, clientY)) {
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
            this._workspace.current.addNode(WorkspaceNode.getDefault(xCoord, yCoord, nodeType));
          }
          else {
            console.log('Out of grid');
          }
        } else {
          console.log("INSIDE TOOLBAR");
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
        <Toolbar/>
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
