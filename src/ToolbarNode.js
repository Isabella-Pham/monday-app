import React from 'react';
import "./ToolbarNode.css"

class ToolbarNode extends React.Component {
    constructor(props) {
        super(props);
    }

    createNode() {
        console.log("Hello");
    }

    render() {
        return(
            <div className="node" onClick={() => this.createNode()}>
                <img src={this.props.image} alt="Not found!"></img>
            </div>
        )
    }
}

export default ToolbarNode;