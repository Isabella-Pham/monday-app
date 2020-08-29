import React from 'react'
import '../styles/TaskPopup.css'
import Constants from '../../constants/constants';

import Task from './Task';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

class TaskPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    }

    let bindFunctions = [
      this.displaySelf,
      this.createTask,
      this.editTask
    ];

    for (let func of bindFunctions) {
      this[func.name] = this[func.name].bind(this);
    }
  }

  displaySelf() {
    this.setState({ show: true });
  }

  createTask() {
    let newTasks = this.props.tasks.concat({ 
      key: Constants.getUniqueReactKey(), 
      title: '', 
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
              <p>Title</p>
              <Button variant="outlined" size="medium" color="primary" onClick={this.createTask} style={{ marginBottom: 20 }}>
                Add Task
              </Button>
              {this.props.tasks.map((item, i) => {
                return <Task key={item.key} index={i} title={item.title} isCompleted={item.isCompleted} people={item.people} editTask={this.editTask}/>
              })}
            </div>
          </Fade>
        </Modal>
      </div>
    )
  }
}

export default TaskPopup;
