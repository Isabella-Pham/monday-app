import React from "react";
import "./App.css";
import Workspace from './workspace/Workspace';
import Toolbar from './toolbar/Toolbar';
import ToolbarNode from './toolbar/ToolbarNode';
import Shapes from './assets/Shapes';
import TransitionNode from './toolbar/TransitionNode';
import Constants from './constants/constants';

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
      },
    };

    this._workspace = React.createRef();

    this.showTransitionNode = this.showTransitionNode.bind(this);
    this.hideTransitionNode = this.hideTransitionNode.bind(this);
    this.updateTransitionNode = this.updateTransitionNode.bind(this);
  }

  componentDidMount() {
    // TODO: set up event listeners
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
        width: dimensions.width,
        height: dimensions.height,
        type: nodeType
      }
    }), () => { 
      this.setTransitionNodePosition(x, y);
    });
  }

  transitionBeyondToolbar(x, y) {
    return x - (Constants.cursorCentered ? (this.state.transitionNode.width / 2) : 0) > Constants.viewportToPixels('20vw');
  }

  getNewPoint(val, dimension) {
    return val - (Constants.cursorCentered ? dimension / 2 : 0);
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
        let closestCoord = Constants.getClosestCoord(pageX, pageY, Constants.ZOOM_SETTINGS.DEFAULT);
        if (this.transitionBeyondToolbar(clientX, clientY)) {
          let width = this.state.transitionNode.width;
          let height = this.state.transitionNode.height;
          this._workspace.current.addNode({
            width: width,
            height: height,
            x: this.getNewPoint(closestCoord.x, width),
            y: this.getNewPoint(closestCoord.y, height),
            type: this.state.transitionNode.type
          });
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
    let closestCoord = Constants.getClosestCoord(x, y, Constants.ZOOM_SETTINGS.DEFAULT);
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
