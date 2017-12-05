import React, { Component } from 'react';
import { Button, Message } from 'semantic-ui-react';
import Masters from './Masters';
import UserManagement from './Users';
import { addScreenshotColumn } from '../int/Masters';


class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="billing">
        <Masters />
        <UserManagement />
        <Button onClick={this.upgradeDB.bind(this)}>UPGRADE</Button>
        { this.renderMessage() }
      </div>
    );
  }

  renderMessage() {
    return (
      <div>
        { this.state.successMsg ? <Message color='green'>{this.state.successMsg}</Message> : null}
        { this.state.errorMsg ? <Message color='red'>{this.state.errorMsg}</Message> : null }
      </div>
    );
  }

  upgradeDB() {
    addScreenshotColumn()
    .then((data) => {
      if(data.success) {
        this.setState({
          successMsg: 'Upgrade is successful',
          errorMsg: ''
        });
      }
    })
    .catch((err) => {
      console.log(err);
      this.setState({
        errorMsg: err.message,
        successMsg: ''
      });
    });
  }
}


export default Settings;
