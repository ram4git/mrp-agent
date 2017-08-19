import React, { Component } from 'react';
import { Button, List } from 'semantic-ui-react';
import Masters from './Masters';
import Charges from './Charges';


class Settings extends Component {

  render() {
    return (
      <div className="billing">
        <Masters />
        <Charges />
      </div>
    );
  }
}

export default Settings;
