import React from 'react';
import './TransitionNode.css';
import Shapes from './Shapes';

class TransitionNode extends React.Component {
    constructor(props) {
        super(props);
    }
    
    setPosition(e) {
        
    }

    render() {
        return(
            <div className='transition-node' style={{top: this.props.y + 'px', left: this.props.x + 'px'}}></div>
        )
    }
}

export default TransitionNode;