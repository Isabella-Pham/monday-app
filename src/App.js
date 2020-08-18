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
    console.log('Starting transition');
    const x = e.clientX;
    const y = e.clientY;
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

  hideTransitionNode(e) {
    if (this.state.transitionNode.inTransition) {
      const x = e.clientX;
      const y = e.clientY;
      this.setState(prevState => ({
        transitionNode: {
          ...prevState.transitionNode,
          inTransition: false
        }
      }), () => { 
        if (this.transitionBeyondToolbar(x, y)) {
          let width = this.state.transitionNode.width;
          let height = this.state.transitionNode.height;
          this._workspace.current.addNode({
            width: width,
            height: height,
            x: x,
            y: y,
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
      this.setTransitionNodePosition(e.clientX, e.clientY);
    } else {

    }
  }

  setTransitionNodePosition(x, y) {
    this.setState(prevState => ({
      transitionNode: {
        ...prevState.transitionNode,
        x: x,
        y: y
      }
    }));
  }

  render() {
    ToolbarNode.onMouseDown = this.showTransitionNode;
    return(
      <div className="App non-drag" onMouseMove={this.updateTransitionNode} onMouseUp={this.hideTransitionNode}>
        <Toolbar>
            <ToolbarNode type={Shapes.TYPES.RECT}/>
            <ToolbarNode type={Shapes.TYPES.ROUND_RECT}/>
            <ToolbarNode type={Shapes.TYPES.DIAMOND}/>
            <ToolbarNode type={Shapes.TYPES.ELLIPSE}/>
            <ToolbarNode type={Shapes.TYPES.CIRCLE}/>
        </Toolbar>
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
