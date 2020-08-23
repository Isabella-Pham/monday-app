import React from 'react';

import Constants from '../constants/constants'
import './TransitionNode.css';

class TransitionNode extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <div className='transition-node' style={{
              top: this.props.y - (Constants.cursorCentered ? (this.props.height / 2) : 0) + 'px',
              left: this.props.x - (Constants.cursorCentered ? (this.props.width / 2) : 0) + 'px',
              width: this.props.width + 'px',
              height: this.props.height + 'px'
            }}></div>
        )
    }
}

export default TransitionNode;