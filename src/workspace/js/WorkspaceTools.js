import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchMinus, faSearchPlus, faBorderAll, faSave, faFolderOpen, faFolder } from '@fortawesome/free-solid-svg-icons';

import Constants from '../../constants/constants';
import '../styles/WorkspaceTools.css';
import FileSystem from './FileSystem';


class WorkplaceTools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: true,
      fileSystemOpen: false,
    }

    this.updateEnabled = this.updateEnabled.bind(this);
    this.toggleFileSystem = this.toggleFileSystem.bind(this);
    this.load = this.load.bind(this);
    this.delete = this.delete.bind(this);
    this.new = this.new.bind(this);
  }

  updateEnabled() {
    this.props.toggleGrid();
    this.setState({
      enabled: !this.state.enabled
    });
  }

  toggleFileSystem() {
    this.setState({
      fileSystemOpen: !this.state.fileSystemOpen
    })
  }

  load(graph) {
    this.setState({ fileSystemOpen: false })
    this.props.load(graph);
  }

  delete(graph) {
    this.setState({ fileSystemOpen: false })
    this.props.delete(graph);
  }

  new() {
    this.setState({ fileSystemOpen: false })
    this.props.new();
  }

  render() {
    return (
      <div className="settings">
        <button disabled={!Constants.WORKSPACE_SETTINGS.canDec()} className="grid-button" onClick={this.props.decZoom}>
          <FontAwesomeIcon
            icon={faSearchMinus}
            size="lg" />
        </button>
        <button disabled={!Constants.WORKSPACE_SETTINGS.canInc()} className="grid-button" onClick={this.props.incZoom}>
          <FontAwesomeIcon
            icon={faSearchPlus}
            size="lg" />
        </button>
        <button className={"grid-button" + (this.state.enabled ? " on" : " off")} onClick={this.updateEnabled}>
          <FontAwesomeIcon
            icon={faBorderAll}
            size="lg" />
        </button>
        <button className="grid-button save" onClick={this.props.save}>
          <FontAwesomeIcon
            icon={faSave}
            size="lg" 
            />
        </button>
        <button className="grid-button folder" onClick={this.toggleFileSystem}>
          <FontAwesomeIcon
            icon={this.state.fileSystemOpen ? faFolderOpen : faFolder}
            size="lg" />
        </button>
        <FileSystem open={this.state.fileSystemOpen} load={this.load} delete={this.delete} new={this.new}/>
      </div>
    );
  }
}

export default WorkplaceTools;