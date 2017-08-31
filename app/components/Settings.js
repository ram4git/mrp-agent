import React, { Component } from 'react';
import { Button, List } from 'semantic-ui-react';
import Masters from './Masters';
import UserManagement from './Users';


class Settings extends Component {

  render() {
    return (
      <div className="billing">
        <Masters />
        <UserManagement />
      </div>
    );
  }
}

export default Settings;
