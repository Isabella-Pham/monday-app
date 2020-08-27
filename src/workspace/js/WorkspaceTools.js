import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchMinus, faSearchPlus, faBorderAll } from '@fortawesome/free-solid-svg-icons';

import Constants from '../../constants/constants';
import '../styles/WorkspaceTools.css';


class WorkplaceTools extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: true
    }

    this.updateEnabled = this.updateEnabled.bind(this);
  }

  updateEnabled() {
    this.props.toggleGrid();
    this.setState({
      enabled: !this.state.enabled
    });
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
          {/* <span className="tooltip">{this.state.enabled ? "Disable" : "Enable"} Grid</span> */}
        </button>
      </div>
    );
  }
}

export default WorkplaceTools;