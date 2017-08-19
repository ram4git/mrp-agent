import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export default class Charges extends Component {

  render() {
    return (
      <div>
        <Header as='h1'>CHARGES</Header>
        { this.renderAllCharges() }
      </div>
    );
  }

  renderAllCharges() {
    return(
      <div>
       ONLY ADMIN CAN CHANGE SETTINGS
      </div>
    );
  }

}
