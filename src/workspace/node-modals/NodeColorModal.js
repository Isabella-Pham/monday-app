import React from 'react';
import { SketchPicker } from 'react-color';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import './node-modals/NodeColorModal.css';

class NodeColorModal extends React.Component {
    constructor(props) {
        super(props);
    
    }

    render() {
        return (
            <div>
            <button type="button" onClick={handleOpen}>
              react-transition-group
            </button>
          </div>
        )
    }
}

export default NodeColorModal;