/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import MainPage from './containers/MainPage';

export default () => (
  <App>
    <Switch>
      <Route path="/main" component={MainPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
