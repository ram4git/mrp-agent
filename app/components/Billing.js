import React, { Component } from 'react';
import { Form, Step, Button } from 'semantic-ui-react'
import { getMasters } from '../int/Masters';


class Billing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      activityRows: 1
    };
  }

  componentDidMount() {
    getMasters().then((rows) => {
      const masters = {};
      if (rows) {
        rows.forEach((row, index) => {
          const { name, key, value } = row;
          masters[name] = masters[name] || [];
          masters[name].push(
            {
              key,
              value: key,
              text: value
            }
          );
        });
        this.setState({
          masters,
          loading: false
        });
      }
    }).catch((err) => {
      console.log(err);
      this.setState({
        errorMsg: err
      });
    });
  }

  render() {
    return (
      <div className="billing">
        <Form>
          <Form.Group className="selectors">
            <Form.Select label='Regionality' options={ this.getMasters('regions')} placeholder='AP or Non AP?' width={4} />
            <Form.Select label='Lorry Type' options={ this.getMasters('lorryTypes') } placeholder='How many wheels?' width={4} />
            <Form.Select label='Product Type' options={ this.getMasters('products') } placeholder='Rice or Paddy?' width={4} />
            <Form.Select label='Action' options={ this.getMasters('actions') } placeholder='Loading or Unloading?' width={4} />
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
          <Form.Group>
            <Form.Button content='Previous' width={8} onClick={this.addActivityRow.bind(this)} />
            <Form.Button content='Save & Print' width={8} onClick={this.addActivityRow.bind(this)} />
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
          <Form.Select label='Jattu' options={ this.getMasters('jattus') } placeholder='Jattu Name' width={4} />
          <Form.Input label='Weight in Tons' placeholder='00.00' width={3} />
          { (i + 1) === this.state.activityRows ?
            <Form.Button label="New Row" content='+' width={2} onClick={this.addActivityRow.bind(this)} /> :
            <Form.Button label="Delete Row" content='-' width={2} onClick={this.removeActivityRow.bind(this)} /> }
        </Form.Group>
      );
    }

    return activities;
  }

  getMasters(masterType) {
    const { masters } = this.state;
    if (masters) {
      return masters[masterType];
    }
    return [];
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
