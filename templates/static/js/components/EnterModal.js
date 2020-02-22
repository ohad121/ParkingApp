import React , { Component } from 'react'
import { Button, Modal, Icon, Form, Dropdown, TextArea, Radio } from 'semantic-ui-react'
import { TimeInput } from 'semantic-ui-calendar-react';

class EnterModal extends Component {
  state = { loading: false, open: false, exitDate: '', driverID: '', allDrivers: {}, options: [], time: new Date(),
  isOpen: false, note: "", noTime: false };

  getAllDrivers = () => {
      fetch('/driver')
          .then(response => response.json())
          .then(allDrivers => {
              this.setState({ allDrivers: allDrivers })
          });
  };

  setDriverOptions = (allDrivers) => {
    const driverOptionsArr = [];
    allDrivers.map((parkingDriver, index) =>
      driverOptionsArr.push({key: index, text: parkingDriver.firstname, value: allDrivers[index]._id.$oid})
    );

    this.setState({options: driverOptionsArr})
  }

  openModal = () => {
    this.setState({ open: true });
  }

  closeModal = () => {
    this.setState({ open: false });
    this.setState({ driverID: '' });
    this.setState({ exitDate: '' });
  }

  noTime = () => {
    if (this.state.driverID) {
      this.setState({ noTime: !this.state.noTime})
    }
  }

  isParkingButtonDisable = () => {
    return this.state.driverID == '' && this.state.exitDate == '';
  }

  prepareDrivers = () => {
    this.openModal();
    fetch('/driver')
    .then(response => response.json())
    .then(allDrivers => {
        this.setDriverOptions(allDrivers)
    })
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    this.setState({ loading: true })
    fetch(`/driver/enter/${this.props.parkingID}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        driverID: this.state.driverID,
        exitDate: this.state.noTime ? '' : this.state.exitDate,
        note: this.state.note
    })
    }).then(res => {
      this.props.getDrivers();
      setTimeout(() => {
        this.setState({ loading: false })
        this.closeModal();
      }, 500)
      console.log(this.state.driverID + this.state.exitDate);
    })
  }

  render() {
    const { open, driverID, exitDate } = this.state
    return  <Modal closeOnEscape={true}
    closeOnDimmerClick={true}
    onClose={this.closeModal} open={open} trigger={<Button onClick={() => this.prepareDrivers()} size='medium' color='green'><Icon name='car'/>Park Here</Button>}>
    <Modal.Header>Enter details</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Form onSubmit={this.handleSubmit}>
        <Form.Group widths='equal'>
          <Form.Field
            fluid
            search
            selection
            name='driverID'
            control={Dropdown}
            label='Driver'
            options={this.state.options}
            onChange={this.handleChange}
            placeholder='Who are you?'
          />
        </Form.Group>
        <Form.Field>
          <label>When do you leave?</label>
          <TimeInput
          name="exitDate"
          closable={true}
          disabled={this.state.driverID === '' || this.state.noTime}
          placeholder="Time"
          animation={'false'}
          value={this.state.exitDate}
          closeOnMouseLeave={false}
          hideMobileKeyboard={true}
          iconPosition="left"
          popupPosition={'bottom center'}
          onChange={this.handleChange}
        />
        <Radio
          label='No time'
          name='noTime'
          disabled={this.state.driverID == ''}
          onClick={this.noTime}
          checked={this.state.noTime}
        />
        </Form.Field>
        <Form.Field
          name="note"
          value={this.state.note}
          maxLength="40"
          control={TextArea}
          onChange={this.handleChange}
          label='Note'
          placeholder='Note'
        />
      </Form>
      </Modal.Description>
    </Modal.Content>
    <Modal.Actions>
            <Button color='black' onClick={this.closeModal}>
              Cancel
            </Button>
            <Button
              positive
              loading={this.state.loading}
              disabled={!this.state.noTime && !this.state.exitDate}
              icon='checkmark'
              labelPosition='right'
              content="Park!"
              onClick={this.handleSubmit}
            />
          </Modal.Actions>
  </Modal>;
  }
}

export default EnterModal