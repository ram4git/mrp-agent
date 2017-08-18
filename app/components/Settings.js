import React, { Component } from 'react';
import { Button, List } from 'semantic-ui-react';
import Masters from './Masters';


class Settings extends Component {

  render() {
    return (
      <div className="billing">
        <Masters />
        <div className="prices">
          { this.renderPrices() }
        </div>
      </div>
    );
  }

  renderPrices() {

  }

}

export default Settings;
