import React from 'react';
import EnterModal from "./EnterModal";

export default (props) => {
    return (
        <div className="ui cards">
        <div className="green card">
          <div className="content">
            <h4 class="ui header">Free Parking</h4>
            <div className="description">
            </div>
          </div>
            <EnterModal getDrivers={props.getDrivers} parkingID={props.id}></EnterModal>
        </div>
      </div>
    );
  };