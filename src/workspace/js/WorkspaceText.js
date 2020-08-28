import React from 'react';
import { ContextMenu, MenuItem, ContextMenuTrigger, SubMenu } from "react-contextmenu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCut, faCopy, faEdit, faTextHeight, faTrashAlt, faFileAlt, faPalette, faSortAmountUpAlt, faSortAmountDownAlt, faClone } from '@fortawesome/free-solid-svg-icons';
import { Resizable } from 'react-resizable';
import * as d3plus from 'd3plus-text'

import Constants from '../../constants/constants';
import '../styles/WorkspaceText.css';
import '../styles/react-contextmenu.css';
import '../styles/react-resizable.css';

class WorkspaceText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isSelected: true,
            moving: {
                isMoving: false,
                offset: {
                    x: -1,
                    y: -1
                }
            },
            isResizing: false
        }

        let bindFunctions = [
            this.handleClick,
            this.moveNode,
            this.placeNode,
            this.deleteSelf,
            this.duplicateSelf,
            this.getRealDimensions,
            this.dummyMethod,
            this.copyNode,
            this.cutNode,
            this.moveToBack,
            this.moveToFront,
            this.colorChange,
            this.resize,
            this.textChange
        ];

        for (let func of bindFunctions) {
            this[func.name] = this[func.name].bind(this);
        }
    }

    static getDefault(x, y, type) {
        return {
            x: x,
            y: y,
            type: type,
            fillColor: '#000000',
            borderColor: 'transparent',
            text: "Double Click to Edit",
            width: 8,
            height: 6,
            fontSize: 24
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
        document.addEventListener('mouseup', this.placeNode, false);
        document.addEventListener('mousemove', this.moveNode, false);
        document.addEventListener('keydown', this.deleteSelf, false);
        
        this.renderText();
    }

    componentDidUpdate() {
        this.renderText();
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
        document.removeEventListener('mouseup', this.placeNode, false);
        document.removeEventListener('mousemove', this.moveNode, false);
        document.removeEventListener('keydown', this.deleteSelf, false);
    }

    getPosition() {
        let offset = Constants.getGridOffset();
        return {
            x: this.props.attributes.x * Constants.ZOOM_SETTINGS + offset.x,
            y: this.props.attributes.y * Constants.ZOOM_SETTINGS + offset.y
        };
    }

    renderText() {
        new d3plus.TextBox()
        .select(`#text${this.props.index}`)
        .data([{
            text: this.props.attributes.text,
            resize: true
        }])
        .width(this.props.attributes.width * Constants.ZOOM_SETTINGS)
        .fontSize(parseFloat(this.props.attributes.fontSize) * Constants.ZOOM_SETTINGS / window.screen.width * 100)
        .overflow(false)
        .textAnchor("middle")
        .fontColor(this.props.attributes.fillColor)
        .x(0)
        .y(0)
        .render()
    }

    handleClick(e) {
        if (this.node.contains(e.target)) {
            let position = this.getPosition();
            this.setState({
                isSelected: true,
                moving: {
                    offset: {
                        x: e.pageX - position.x,
                        y: e.pageY - position.y
                    },
                    isMoving: true
                }
            });
        } else {
            if (!this.state.isResizing) {
                this.setState({ isSelected: false });
            }
        }
    }

    getGridDimensions() {
        return {
            width: this.props.attributes.width,
            height: this.props.attributes.height
        }
    }

    getRealDimensions() {
        let dimensions = this.getGridDimensions();
        return {
            width: dimensions.width * Constants.ZOOM_SETTINGS,
            height: dimensions.height * Constants.ZOOM_SETTINGS
        };
    }

    moveNode(e) {
        if (this.state.isSelected && this.state.moving.isMoving) {
            let position = {};
            if (Constants.gridEnabled) {
                position = Constants.getClosestPosition(
                    e.pageX - this.state.moving.offset.x,
                    e.pageY - this.state.moving.offset.y
                );
            } else {
                position = {
                    x: e.pageX - this.state.moving.offset.x,
                    y: e.pageY - this.state.moving.offset.y,
                }
            }
            let offset = Constants.getGridOffset();
            let realDimensions = this.getRealDimensions();
            let xCord = Constants.getGridCoord(
                position.x,
                realDimensions.width,
                offset.x,
                false
            );
            let yCord = Constants.getGridCoord(
                position.y,
                realDimensions.height,
                offset.y,
                false
            );
            let gridDimensions = this.getGridDimensions();
            let adjustedCord = Constants.getAdjustedCoord(
                xCord,
                yCord,
                gridDimensions.width,
                gridDimensions.height
            )
            this.props.updateSelf(
                this.props.index,
                {
                    x: adjustedCord.x,
                    y: adjustedCord.y
                }
            );
        }
    }

    placeNode() {
        this.setState({
            moving: {
                ...this.state.moving,
                isMoving: false
            }
        });
    }

    deleteSelf(e) {
        if (this.state.isSelected && (e.key === 'Backspace' || e.key === 'Delete')) {
            this.props.onDelete(this.props.index);
        }
    }

    moveToFront(e) {
        this.props.onShift(this.props.index, true);
    }

    moveToBack(e) {
        this.props.onShift(this.props.index, false);
    }

    duplicateSelf(e) {
        this.props.onDuplicate(this.props.index);
    }

    copyNode() {
        this.props.copySelf(this.props.index);
    }

    cutNode() {
        this.props.copySelf(this.props.index);
        this.props.onDelete(this.props.index);
    }

    dummyMethod() {
        console.log("Dummy method");
    }

    colorChange() {
        this.props.onContextChange(this.props.index, "color");
    }
    
    textChange() {
        this.props.onContextChange(this.props.index, "text");
    }

    resize(e, { size }) {
        let newWidth = size.width / Constants.ZOOM_SETTINGS;
        let newHeight = size.height / Constants.ZOOM_SETTINGS;
        let isOutsideGridWidth = this.props.attributes.x + newWidth > Constants.WORKSPACE_SETTINGS.getHorizontalBoxes();
        let isOutsideGridHeight = this.props.attributes.y + newHeight > Constants.WORKSPACE_SETTINGS.getVerticalBoxes();

        if (isOutsideGridWidth) {
            newWidth = Constants.WORKSPACE_SETTINGS.getHorizontalBoxes() - this.props.attributes.x;
        }

        if (isOutsideGridHeight) {
            newHeight = Constants.WORKSPACE_SETTINGS.getVerticalBoxes() - this.props.attributes.y;
        }

        if (newWidth < 2) {
            newWidth = 2;
        }

        if (newHeight < 2) {
            newHeight = 2;
        }

        this.props.updateSelf(this.props.index, {
            width: newWidth,
            height: newHeight
        })
    }

    render() {
        let dimensions = this.getRealDimensions();
        let position = this.getPosition();
        return (
            <div>
                <ContextMenuTrigger id={this.props.attributes.key} holdToDisplay={-1}>
                    <Resizable
                        className={'resize-' + (this.state.isSelected ? 'active' : 'inactive')}
                        width={dimensions.width}
                        height={dimensions.height}
                        lockAspectRatio={false}
                        onResize={this.resize}
                        draggableOpts={{ offsetParent: document.body }}
                        onResizeStart={() => this.setState({ isResizing: true })}
                        onResizeStop={() => this.setState({ isResizing: false })}
                    >
                        <div
                            className={'work-text' + (this.state.isResizing ? ' resizing' : '') + (this.state.isSelected ? ' selected' : '')}
                            style={{
                                top: position.y,
                                left: position.x,
                                width: dimensions.width,
                                height: dimensions.height,
                                fill: 'transparent',
                                stroke: this.props.attributes.borderColor,
                                outlineWidth: Math.max(dimensions.width * 0.01, Constants.ZOOM_SETTINGS * 0.1),
                            }}
                            onDoubleClick={this.textChange}
                        >
                            <svg
                                ref={node => this.node = node}
                                id={"text" + this.props.index}
                            >
                            </svg>
                        </div>
                    </Resizable>
                </ContextMenuTrigger>
                <ContextMenu id={this.props.attributes.key} className="react-contextmenu">
                    <MenuItem className="react-contextmenu-item" onClick={() => { this.props.onDelete(this.props.index) }}>
                        <FontAwesomeIcon icon={faTrashAlt} style={{ paddingRight: 10 }} />
                Delete
            </MenuItem>
                    <SubMenu
                        title={
                            <div style={{ display: "inline" }}>
                                <FontAwesomeIcon icon={faEdit} style={{ paddingRight: 10 }} />
                                <span>Edit</span>
                            </div>
                        }
                        hoverDelay={100}>
                        <MenuItem className="react-contextmenu-item" onClick={this.copyNode}>
                            <FontAwesomeIcon icon={faCopy} style={{ paddingRight: 10 }} />
                            Copy
                        </MenuItem>
                        <MenuItem className="react-contextmenu-item" onClick={this.cutNode}>
                            <FontAwesomeIcon icon={faCut} style={{ paddingRight: 10 }} />
                            Cut
                        </MenuItem>
                        <MenuItem className="react-contextmenu-item" onClick={this.duplicateSelf}>
                            <FontAwesomeIcon icon={faClone} style={{ paddingRight: 10 }} />
                            Duplicate
                        </MenuItem>
                        <MenuItem className="react-contextmenu-item" onClick={this.textChange}>
                            <FontAwesomeIcon icon={faTextHeight} style={{ paddingRight: 10 }} />
                            Text
                        </MenuItem>
                        <MenuItem className="react-contextmenu-item" onClick={this.colorChange}>
                            <FontAwesomeIcon icon={faPalette} style={{ paddingRight: 10 }} />
                            Color
                        </MenuItem>
                    </SubMenu>
                    <SubMenu
                        title={
                            <div style={{ display: "inline" }}>
                                <FontAwesomeIcon icon={faFileAlt} style={{ paddingRight: 10 }} />
                                <span>Wrapping</span>
                            </div>
                        }
                        hoverDelay={100}>
                        <MenuItem className="react-contextmenu-item" onClick={this.moveToFront}>
                            <FontAwesomeIcon icon={faSortAmountUpAlt} style={{ paddingRight: 10 }} />
                Bring To Front
                </MenuItem>
                        <MenuItem className="react-contextmenu-item" onClick={this.moveToBack}>
                            <FontAwesomeIcon icon={faSortAmountDownAlt} style={{ paddingRight: 10 }} />
                Send To Back
                </MenuItem>
                    </SubMenu>
                </ContextMenu>
            </div>
        );
    }
}

export default WorkspaceText;