import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import Toolbar from './toolbar/Toolbar';

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
        <Toolbar/>
      </div>
    );
  }
}

export default App;
