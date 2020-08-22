import React from 'react';
import Constants from '../constants/constants';
import './WorkspaceSettings.css';
import { faThList } from '@fortawesome/free-solid-svg-icons';

class WorkspaceSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enabled: true
        }

        this.updateEnabled = this.updateEnabled.bind(this);
    }

    updateEnabled() {
        this.props.onClick();
        this.setState({
            enabled: !this.state.enabled
        });
    }

    render() {
        return(
            <div className="settings">
                <button className={"grid-button" + (this.state.enabled ? " on" : " off")} onClick={this.updateEnabled}>
                {this.state.enabled ? (
                    <span className="tooltip">Disable Grid</span>
                ) : (
                    <span className="tooltip">Enable Grid</span>
                )}
                </button>
            </div>
        );
    }
}

export default WorkspaceSettings;