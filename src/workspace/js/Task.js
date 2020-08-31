import React from 'react';
import '../styles/Task.css'

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import { faPlusCircle, faTrash, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

class Task extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedPeople: [],
      currentTitle: this.props.title
    }

    this.updateTitle = this.updateTitle.bind(this);
    this.updateIsCompleted = this.updateIsCompleted.bind(this);
    this.deleteSelf = this.deleteSelf.bind(this);
    this.addPeople = this.addPeople.bind(this);
    this.removePerson = this.removePerson.bind(this);
  }

  updateTitle(e, value) {
    if (e) {
      console.log("E exists")
      e.stopPropagation();
    }

    if (!value) {
      value = {
        name: ''
      }
    }

    let title = value.name ? value.name : value 
    this.props.editTask(this.props.index, { title: title });
    this.setState({ currentTitle: title });
  }

  updateIsCompleted(e) {
    this.props.editTask(this.props.index, { isCompleted: e.target.checked })
  }

  deleteSelf(e) {
    e.stopPropagation();
    this.props.deleteTask(this.props.index);
  }

  addPeople(e) {
    this.props.editTask(this.props.index, { people: this.props.people.concat(this.state.selectedPeople) });
    this.setState({ selectedPeople: [] });
  }

  removePerson(e) {
    let people = this.props.people.slice();
    people.splice(parseInt(e.target.closest('.task-person').getAttribute('data-index')), 1);

    this.props.editTask(this.props.index, { people: people });
  }

  render() {
    return (
      <Accordion style={{ marginBottom: 5 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            control={
            <GreenCheckbox 
              checked={this.props.isCompleted}
              onChange={this.updateIsCompleted}
            />}
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}  
          />
          <div className="task-actions">
            <FontAwesomeIcon 
              icon={faTrash} 
              size="lg" 
              className="task-icon"
              style={{ color: '' }}
              onClick={this.deleteSelf}
              onFocus={(event) => event.stopPropagation()}    
            />
          </div>
          <Autocomplete
            multiple={false}
            freeSolo={true}
            options={this.props.tasks}
            onChange={this.updateTitle}
            onInputChange={this.updateTitle}
            
            getOptionSelected={(option, value) => option.name === value.name || (option.name === value)}
            getOptionLabel={(option) => option.name}
            fullWidth={true}
            value={{
              name: this.state.currentTitle
            }}
            renderInput={(params) => <TextField {...params}
              label="Task Description"
              variant="outlined"
              onClick={(event) => event.stopPropagation()} 
              onFocus={(event) => event.stopPropagation()}  
              InputProps={{
                ...params.InputProps,
              }}
              />}
            />
        </AccordionSummary>
        <AccordionDetails>
        <div className='task-details'>
          <div className='add-people'>
            <Autocomplete
              multiple={true}
              options={this.props.teammates.filter((value) => { 
                return !this.props.people.map(item => item.id).includes(value.id);
              })}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              freeSolo={false}
              fullWidth={true}
              style={{ width: '89%', marginLeft: '7%' }}
              onChange={(event, values) => this.setState({ selectedPeople: values })}
              value={this.state.selectedPeople}
              renderInput={(params) => <TextField {...params} 
                label={`Add Task Member${this.state.selectedPeople.length === 1 ? '' : 's'}`}
                variant="outlined" 
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
              }} />}
            />
            <div className="people-actions">
              <FontAwesomeIcon 
                icon={faPlusCircle} 
                size="lg" 
                className={"people-icon" + (this.state.selectedPeople.length > 0 ? ' enabled' : ' disabled')}
                onClick={this.addPeople}
                onFocus={(event) => event.stopPropagation()}    
              />
            </div>
          </div>
          <div className="task-people">
            {this.props.people.map((item, i) => {
              return (
                <div className="task-person" key={item.id} data-index={i}>
                  <span className="person-name">
                    {item.name}
                  </span>
                  <span className="person-email">
                    {item.email}
                  </span>
                  <span className="person-remove">
                    <FontAwesomeIcon icon={faTimesCircle} size="lg" onClick={this.removePerson}/>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        </AccordionDetails>
      </Accordion>
    )
  }
}

export default Task;
