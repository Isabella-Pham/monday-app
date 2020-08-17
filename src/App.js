import React from "react";
import "./App.css";
//import mondaySdk from "monday-sdk-js";
import Toolbar from './toolbar/Toolbar';
import ToolbarNode from './toolbar/ToolbarNode';
import Shapes from './toolbar/Shapes';
import TransitionNode from './toolbar/TransitionNode';
import Constants from './constants/constants';

//const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
      transitionNode: {
        inTransition: false,
        x: -1,
        y: -1,
        width: 0,
        height: 0
      },
    };

    this.showTransitionNode = this.showTransitionNode.bind(this);
    this.hideTransitionNode = this.hideTransitionNode.bind(this);
    this.updateTransitionNode = this.updateTransitionNode.bind(this);
  }

  componentDidMount() {
    // TODO: set up event listeners
  }
  
  showTransitionNode(e) {
    const x = e.clientX;
    const y = e.clientY;
    const nodeType = e.currentTarget.getAttribute('data-type');
    const dimensions = Shapes.getDefaultDimensions(nodeType);
    this.setState(prevState => ({
      transitionNode: {
        ...prevState.transitionNode,
        inTransition: true,
        width: dimensions.width,
        height: dimensions.height
      }
    }), () => { 
      this.setTransitionNodePosition(x, y);
    });
  }

  hideTransitionNode(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.setState(prevState => ({
      transitionNode: {
        ...prevState.transitionNode,
        inTransition: false
      }
    }), () => { 
      if (this.state.transitionNode.x - (Constants.cursorCentered ? (this.state.transitionNode.width / 2) : 0) > Constants.viewportToPixels('20vw')) {
        console.log("OUTSIDE TOOLBAR");
      } else {
        console.log("INSIDE TOOLBAR");
      }
    });
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
        {this.state.transitionNode.inTransition ? 
          <TransitionNode
            x={this.state.transitionNode.x}
            y={this.state.transitionNode.y}
            width={this.state.transitionNode.width}
            height={this.state.transitionNode.height}/> : null}
      </div>
    );
  }
}

export default App;
