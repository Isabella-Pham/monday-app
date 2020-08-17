import React from 'react';
import './TransitionNode.css';

class TransitionNode extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return(
            <div className='transition-node' style={{
              top: this.props.y + 'px',
              left: this.props.x + 'px',
              width: this.props.width + 'px',
              height: this.props.height + 'px'
            }}></div>
        )
    }
}

export default TransitionNode;