import React from 'react';
import FreeParkingTile from './FreeParkingTile';
import steve from '/Users/ohadyakovskind/Stuff/pyparking/static/src/steve.png'
import { Card, Icon, Button, Image } from 'semantic-ui-react'
import moment from 'moment';

class ParkingTile extends React.Component {
  state = { loading: false };

  takeOutDriver = (parkingnum, getDrivers) => {
    this.setState({ loading: true })
    fetch(`/driver/exit/${parkingnum}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      setTimeout(() => {
        this.setState({ loading: false })
      }, 500)
      getDrivers()
    })
  }


  render() {
    if (!this.props.parkingDriver) {
      return <FreeParkingTile getDrivers={this.props.getDrivers} id={this.props.id} />;
    }

    return (
      <Card style={{ textAlign: 'left' }}>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            href={`https://api.whatsapp.com/send?phone=+972${this.props.parkingDriver.phone}`}
            src={steve}
            target='_blank'
          />
          <Card.Header>{this.props.parkingDriver.firstname}</Card.Header>
          <Card.Meta>{this.props.parkingDriver.car}</Card.Meta>
        </Card.Content>
        <Card.Content>
          <h4>Leaving at: <br></br>
            <a>{this.props.parkingDriver.exitdate ? moment(this.props.parkingDriver.exitdate).format("HH:mm") : "I'm not sure"}</a></h4>
          <Card.Description>
            {this.props.parkingDriver.note}
          </Card.Description>
        </Card.Content>
        <Button loading={this.state.loading} size='medium' color={'blue'} onClick={() => this.takeOutDriver(this.props.parkingDriver.parkingnum, this.props.getDrivers)}><Icon name='hand peace' />I'm Out!</Button>
      </Card>
    );
  }
}

export default ParkingTile