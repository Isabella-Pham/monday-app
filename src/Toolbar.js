import React from 'react';
import ToolbarNode from './ToolbarNode';
import "./Toolbar.css"

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true
        }
    }

    render() {
        return(
            <div className="toolbar">
                <p>Toolbar</p>
                <div className="nodes">
                    <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
                    <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
                    <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
                    <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
                    <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
                    <ToolbarNode image={"https://m.media-amazon.com/images/I/9151bYqX+UL._AC_SS350_.jpg"}/>
                </div>
            </div>
        )
    }
}

export default Toolbar