import React from 'react';
import '../styles/FileSystem.css';

import Button from '@material-ui/core/Button';

class FileSystem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={'file-system' + (this.props.open ? '' : ' off')}>
        <div className='system-header'>
          Saved Files
        </div>
        <div className="saved-graphs">
          <ul className="graph-list">

          </ul>
        </div>
        <div className="file-options">
          <Button variant="outlined" color="default" className="file-buttons">
            New
          </Button>
          <Button variant="outlined" color="default" className="file-buttons">
            Load
          </Button>
        </div>
      </div>
    );
  }
}

export default FileSystem;