import React, { Component } from 'react';
import { Header, Form, Message } from 'semantic-ui-react';
import Storage from 'electron-json-storage-sync';

import { addUser } from '../int/Masters';

export default class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: ''
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit() {
    const { user, pass } = this.state;
    console.log(user, pass, 'CREDS');
    addUser(user, pass)
    .then((resp) => {
      if(resp.success) {
        this.setState({
          successMsg: `Account has been created for ${user}!`,
          user: '',
          pass: '',
          errorMsg: ''
        });
      }
    })
    .catch((err) => {
      console.log(err);
      this.setState({
        errorMsg: err.message,
        user: '',
        pass: '',
        successMsg: ''
      });
    });
  }

  render() {
    return (
      <div>
        <Header as='h1'>USER MANAGEMENT</Header>
        { this.renderUserMenu() }
      </div>
    );
  }

  renderUserMenu() {
    const { data } = Storage.get('session');
    const { user, pass } = this.state;

    if (data.user !== 'adish') {
      return (
        <div>
         ONLY ADMIN CAN CREATE USERS
        </div>
      );
    }
    return (
      <div>
        { this.renderMsg() }
        <Form className="userManagement">
          <Form.Group>
            <Form.Input placeholder='User Name' name='user' value={user} onChange={this.handleChange} />
            <Form.Input placeholder='Password' name='pass' value={pass} onChange={this.handleChange} />
            <Form.Button content='Create' onClick={ this.handleSubmit.bind(this) } />
          </Form.Group>
        </Form>
      </div>
    );
  }

  renderMsg() {
    if (this.state.successMsg) {
      return (
        <Message positive>
          <Message.Header>Success!</Message.Header>
          <p>{ this.state.successMsg }</p>
        </Message>
      )
    } else if ( this.state.errorMsg) {
      return (
        <Message negative>
          <Message.Header>Unable to create Account</Message.Header>
          <p>{ this.state.errorMsg }</p>
        </Message>
      )
    } else {
      return;
    }
  }

}
