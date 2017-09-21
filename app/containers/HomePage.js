// @flow
import React, { Component } from 'react';
import Home from '../components/Home';
import PrintPage from '../components/PrintPage';
import queryString from 'query-string';

export default class HomePage extends Component {

  render() {
    const { print } = queryString.parse(this.props.location.search);
    console.log('PRINT-ID', print);

    if(print) {
      return (
        <PrintPage billNo={print} />
      );
    }

    return (
      <Home />
    );
  }
}
