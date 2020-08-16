import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import Toolbar from './toolbar/Toolbar';
import ToolbarNode from './toolbar/ToolbarNode'

const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
    };
  }

  componentDidMount() {
    // TODO: set up event listeners
  }

  render() {
    return(
      <div className="App">
        <Toolbar width={`20vw`} height={0}>
            <ToolbarNode type={ToolbarNode.TYPES.RECT}/>
            <ToolbarNode type={ToolbarNode.TYPES.ROUND_RECT}/>
            <ToolbarNode type={ToolbarNode.TYPES.DIAMOND}/>
            <ToolbarNode type={ToolbarNode.TYPES.ELLIPSE}/>
            <ToolbarNode type={ToolbarNode.TYPES.CIRCLE}/>
        </Toolbar>
      </div>
    );
  }
}

export default App;
