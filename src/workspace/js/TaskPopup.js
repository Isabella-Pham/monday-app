import React from 'react'
import '../styles/TaskPopup.css'
import Constants from '../../constants/constants';
import Task from './Task';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

class TaskPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    }

    this.displaySelf = this.displaySelf.bind(this);
    this.createTask = this.createTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);

    this.teammates = [];

    Constants.MONDAY_CLIENT.getTeammates().then(function(res) {
      this.teammates = res;
    }.bind(this));
  }

  displaySelf() {
    this.setState({ show: true });
  }

  createTask() {
    let newTasks = this.props.tasks.concat({ 
      key: Constants.getUniqueReactKey(), 
      title: 'New Task', 
      isCompleted: false, 
      people: [] 
    });
    
    this.props.updateTasks(newTasks);
  }

  editTask(index, props) {
    let newTasks = this.props.tasks.slice();
    newTasks[index] = {
      ...newTasks[index],
      ...props
    };

    this.props.updateTasks(newTasks);
  }

  deleteTask(index) {
    let newTasks = this.props.tasks.slice()
    
    newTasks.splice(index, 1);

    this.props.updateTasks(newTasks);
  }

  render() {
    return (
      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="taskModal"
          open={this.state.show}
          onClose={() => this.setState({ show: false })}
          closeAfterTransition
          disableEnforceFocus={true}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.show}>
            <div className="taskPaper">
              <div className='manage-header'>
                <span className="header-title">Manage Tasks</span>
                <span className='add-task'>
                  <FontAwesomeIcon icon={faPlusCircle} size="2x" onClick={this.createTask}/>
                </span>
              </div>
              {this.props.tasks.map((item, i) => {
                return <Task key={item.key} 
                             index={i} 
                             title={item.title} 
                             isCompleted={item.isCompleted} 
                             people={item.people}
                             teammates={this.teammates}
                             editTask={this.editTask}
                             deleteTask={this.deleteTask}
                        />
              })}
            </div>
          </Fade>
        </Modal>
      </div>
    )
  }
}

export default TaskPopup;
