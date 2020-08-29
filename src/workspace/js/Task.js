import React from 'react';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';

class Task extends React.Component {
  constructor(props) {
    super(props);

    let bindFunctions = [
      this.updateTitle
    ];

    for (let func of bindFunctions) {
      this[func.name] = this[func.name].bind(this);
    }
  }

  updateTitle(e) {
    this.props.editTask(this.props.index, { title: e.target.value.trim() });
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
            control={<Checkbox />}
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}  
          />
          <TextField 
            fullWidth={true} 
            variant="outlined" 
            multiline={false} 
            onChange={this.updateTitle}
            onClick={(event) => event.stopPropagation()} 
            onFocus={(event) => event.stopPropagation()} 
            value={this.props.title}
          />
        </AccordionSummary>
        <AccordionDetails>
          <Typography color="textPrimary">
            The click event of the nested action will propagate up and expand the accordion unless
            you explicitly stop it.
          </Typography>
        </AccordionDetails>
      </Accordion>
    )
  }
}

export default Task;
