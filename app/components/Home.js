// @flow
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react'
import { auth } from '../int/Auth';
import Main from './Main';


import styles from './Home.css';


const ROOT_ROUTE = '/Main';


export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: '',
      authMsg: '',
      authenticated: false
    };
  }

  render() {
    return (
      <div>
        { this.state.authenticated ? this.renderMainPage() : this.renderLoginPage() }
      </div>
    );
  }

  renderLoginPage() {

    return (
      <div className={`${styles.container} login`} data-tid="container">
        <h2>Lalitha Products</h2>
          <Form>
            <Form.Field>
              <label>USERNAME</label>
              <input placeholder="USERNAME" onChange={this.onChangeValue.bind(this, 'user')} />
            </Form.Field>
            <Form.Field>
              <label>PASSWORD</label>
              <input placeholder="PASSWORD" type="password" onChange={this.onChangeValue.bind(this, 'pass')} />
            </Form.Field>
            <Button type="submit" color='twitter'
              content='LOGIN'
              onClick={this.authenticateUser.bind(this)}
              />
            { this.state.authMsg ? <Message color='red'>{ this.state.authMsg }</Message> : null }
          </Form>
      </div>
    );

  }

  renderMainPage() {
    return (
      <Main />
    );
  }

  authenticateUser() {
    const { user, pass } = this.state;
    const authResponse = auth(user, pass);
    if(authResponse.authenticated) {
      this.setState({
        authenticated: true
      });
    } else {
      this.setState({
        authMsg: authResponse.msg
      });
    }
  }

  onChangeValue(paramName, e) {
    this.setState({
      [paramName]: e.target.value
    });
  }
}
