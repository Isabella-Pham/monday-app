import React from "react";
import "./App.css";
//import mondaySdk from "monday-sdk-js";
import Toolbar from './toolbar/Toolbar';
import ToolbarNode from './toolbar/ToolbarNode';
import Shapes from './toolbar/Shapes';
import TransitionNode from './toolbar/TransitionNode';

//const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
      inTransition: false,
      transitionX: -1,
      transitionY: -1
    };

    this.handleTransitionNodeDown = this.handleTransitionNodeDown.bind(this);
    this.handleTransitionNodeUp = this.handleTransitionNodeUp.bind(this);
    this.updateTransition = this.updateTransition.bind(this);
  }

  componentDidMount() {
    // TODO: set up event listeners
  }

  handleTransitionNodeDown(e) {
    const x = e.clientX;
    const y = e.clientY;
    this.setState({inTransition: true},
      () => { 
        this.setTransitionNodePosition(x, y);
      }
    );
  }

  handleTransitionNodeUp(e) {
    // const x = e.screenX;
    // const y = e.screenY;
    this.setState({inTransition: false},
      () => { 
        // do computational check
      }
    );
  }

  updateTransition(e) {
    if (this.state.inTransition) {
      this.setTransitionNodePosition(e.clientX, e.clientY);
    } else {

    }
  }

  setTransitionNodePosition(x, y) {
    this.setState({
      transitionX: x,
      transitionY: y
    })
  }

  render() {
    return(
      <div className="App" onMouseMove={this.updateTransition} onMouseUp={this.handleTransitionNodeUp}>
        <Toolbar>
            <ToolbarNode type={Shapes.TYPES.RECT} onMouseDown={this.handleTransitionNodeDown}/>
            <ToolbarNode type={Shapes.TYPES.ROUND_RECT}/>
            <ToolbarNode type={Shapes.TYPES.DIAMOND}/>
            <ToolbarNode type={Shapes.TYPES.ELLIPSE}/>
            <ToolbarNode type={Shapes.TYPES.CIRCLE}/>
        </Toolbar>
        {this.state.inTransition ? 
          <TransitionNode x={this.state.transitionX} y={this.state.transitionY}/> : null
        }
      </div>
    );
  }
}

export default App;
