import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import Toolbar from './Toolbar';
import ToolbarNode from './ToolbarNode'

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
          <div className="nodes">
            <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
            <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
            <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
            <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
            <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
            <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
          </div>
        </Toolbar>
      </div>
    );
  }
}

export default App;
