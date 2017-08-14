import React, { Component } from 'react';
import { Form, Input } from 'semantic-ui-react'
import { getMasters } from '../int/Masters';


class Billing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      activityRows: 1
    };
  }

  render() {
    return (
      <div className="billing">
        <Form>
          <Form.Group className="selectors">
            <Form.Select label='Regionality' options={ getMasters('regions')} placeholder='AP or Non AP?' width={4} />
            <Form.Select label='Lorry Type' options={ getMasters('lorryTypes') } placeholder='How many wheels?' width={4} />
            <Form.Select label='Product Type' options={ getMasters('products') } placeholder='Rice or Paddy?' width={4} />
            <Form.Select label='Action' options={ getMasters('actions') } placeholder='Loading or Unloading?' width={4} />
          </Form.Group>
          <div className="activities">
            { this.renderActivities() }
          </div>
          <Form.Group className="financials">
            <Form.Input label='Load Amount' placeholder='₹0.00' width={4} />
            <Form.Input label='Rusum' placeholder='₹0.00' width={4} />
            <Form.Input label='Jattu Amount' placeholder='₹0.00' width={4} />
            <Form.Input label='Remaining' placeholder='₹0.00' width={4} />
          </Form.Group>
        </Form>
      </div>
    );
  }

  renderActivities() {
    const activities = [];
    for( let i = 0; i < this.state.activityRows; i++) {
      activities.push(
        <Form.Group key={i}>
          <Form.Input label='W.S.NO' placeholder='#####' width={3} />
          <Form.Input label='Lorry NO' placeholder='AP12CD1234' width={4} />
          <Form.Select label='Jattu' options={ getMasters('jattus') } placeholder='Jattu Name' width={4} />
          <Form.Input label='Weight in Tons' placeholder='00.00' width={3} />
          { (i + 1) === this.state.activityRows ?
            <Form.Button label="New Row" content='+' width={2} onClick={this.addActivityRow.bind(this)} /> :
            <Form.Button label="Delete Row" content='-' width={2} onClick={this.removeActivityRow.bind(this)} /> }
        </Form.Group>
      );
    }

    return activities;
  }

  removeActivityRow() {
    this.setState({
      activityRows: this.state.activityRows - 1
    });
  }

  addActivityRow() {
    this.setState({
      activityRows: this.state.activityRows + 1
    });
  }

}

export default Billing;
