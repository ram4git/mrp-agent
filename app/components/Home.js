// @flow
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Storage from 'electron-json-storage-sync';
import { Button, Form, Message } from 'semantic-ui-react';

import { auth } from '../int/Auth';
import Main from './Main';


import styles from './Home.css';

//TODO https://stackoverflow.com/questions/40318054/exporting-sqlite3-db-file-from-inside-electron-app-is-this-possible


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

  componentDidMount() {
    const { status, data, error } = Storage.get('session');
    if(status) {
      const { user, status } = data;
      this.setState({
        user,
        authenticated: status === 'LOGGED-IN'
      });
    }

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
    const mKey = this.state.mKey || 1;
    return (
      <Main onClear={this.forceRefresh.bind(this)} key={mKey} />
    );
  }

  forceRefresh() {
    const mKey = this.getFourDigitRandomNumber();
    this.setState({
      mKey
    });
  }

  getFourDigitRandomNumber() {
    const min = Math.ceil(1000);
    const max = Math.floor(9999);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  authenticateUser() {
    const { user, pass } = this.state;
    const { status, data, error } = Storage.get('session');
    if (status) {
      if(data.user === user && data.status === 'LOGGED-IN') {
        console.log(`USER ${user} is already logged in`);
        this.setState({
          authenticated: true
        });

      }
    } else {
      auth(user, pass)
      .then((row) => {
        console.log('ROW from db ', JSON.stringify(row, null, 2));
        if (!row.length) {
          this.setState({
            authMsg: 'USERNAME/PASSWORD does not exist'
          });
        } else {
          const { name: dbName, pass: dbPass } = row[0];
          console.log('ROW from db ', JSON.stringify(row[0], null, 2));

          if (dbName === user) {
            if (dbPass === pass) {
              const result = Storage.set('session', {
                user,
                status: 'LOGGED-IN'
              });
              this.setState({
                authenticated: true
              });
            } else {
              Storage.clear();
              this.setState({
                authMsg: 'Incorrect Password ❌'
              });
            }
          } else {
            response.msg = 'USERNAME doesn\'t exist ❗️';
            Storage.clear();
            this.setState({
              authMsg: 'USERNAME doesn\'t exist ❗️'
            });
          }
        }
      })
      .catch((err) => {
        Storage.clear();
        this.setState({
          authMsg: 'Unable to authenticate User❗️'
        });
      });
    }
  }

  onChangeValue(paramName, e) {
    this.setState({
      [paramName]: e.target.value
    });
  }
}
