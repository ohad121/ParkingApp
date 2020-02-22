import React, { Component } from 'react';
import { Grid, Image } from 'semantic-ui-react'
import ParkingTile from './ParkingTile';

class ParkingGrid extends Component {

    state = { parkingDrivers: {} };

    componentDidMount() {
        this.getParkingDrivers()
        setInterval(this.getParkingDrivers, 60000);
    }

    getParkingDrivers = () => {
        fetch('/parkingDrivers')
            .then(response => response.json())
            .then(resParkingDrivers => {
                this.setState({ parkingDrivers: resParkingDrivers })
            });
    };

    getParkingTiles = () => {
        if (!(this.state.parkingDrivers.length > 0)) {
            return <div></div>
        }

        const parkingTiles = this.state.parkingDrivers.map((parkingDriver, index) =>
            <div className="six wide tablet eight wide computer column" key={index}>
            <ParkingTile getDrivers={this.getParkingDrivers} key={index} id={index} parkingDriver={parkingDriver}/>
            </div>
        );

        return parkingTiles;
    }

    render() {
        return  <div>
            <Grid centered padded>
        {this.getParkingTiles()}
        </Grid>
            </div>;
    }
}

export default ParkingGrid;