import React, { Component } from 'react';
import { Form, Step, Button, Statistic, Message } from 'semantic-ui-react'
import { getMasters, chargesMap, lorryToRusumMap, lorry2JattuMap } from '../int/Masters';

class Billing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      activityRows: [
        {
          wsno: '',
          lorryNo: '',
          jattu: '',
          weightInTons: 0
        }
      ],
      chargePerTon: 0
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
            <Form.Select label='Action' options={ this.getMasters('actions') } placeholder='Loading or Unloading?' width={4} required  onChange={ this.onChangeValue.bind(this, 'action')} error={!this.state.action} />
            <Form.Select label='Product Type' options={ this.getMasters('products') } placeholder='Rice or Paddy?' width={4} required onChange={ this.onChangeValue.bind(this, 'product')} error={!this.state.product} />
            <Form.Select label='Regionality' options={ this.getMasters('regions')} placeholder='AP or Non AP?' width={4} required onChange={ this.onChangeValue.bind(this, 'region')} error={!this.state.region} />
            <Form.Select label='Lorry Type' options={ this.getMasters('lorryTypes') } placeholder='How many wheels?' width={4} required onChange={ this.onChangeValue.bind(this, 'lorryType')} error={!this.state.lorryType} />
          </Form.Group>
          <div className="activities">
            { this.renderActivities() }
          </div>
          { this.renderSummary() }
          { this.renderFinancials() }
          { this.renderFooter() }
        </Form>
      </div>
    );
  }

  renderFinancials() {
    let totalTons = this.getTotalWeight(),
      chargePerTon = 0,
      extraCharges = 0,
      jattu = 0,
      totalCharge = 0,
      balance = 0;

    const { action, product, region, lorryType } = this.state;

    if (this.areAllFieldsEntered()) {
      chargePerTon = chargesMap[action][product][region];
      if (action === 'loading') {
        extraCharges = lorryToRusumMap[lorryType];
      } else {
        extraCharges = chargesMap[action][product].extra[region];
      }

      if (product !== 'paddy') {
        jattu = lorry2JattuMap[lorryType];
      } else {
        jattu = totalTons * chargePerTon + extraCharges;
      }

      totalCharge = totalTons * chargePerTon + extraCharges;
      balance = totalCharge - jattu;

    }

    return (
      <Form.Group className="financials">
        <Form.Input label='Total Amount' placeholder='₹0.00' width={5} disabled={true} value={totalCharge} />
        <Form.Input label='Jattu Amount' placeholder='₹0.00' width={5} disabled={true} value={jattu} />
        <Form.Input label='Remaining' placeholder='₹0.00' width={5} disabled={true} value={balance} />
      </Form.Group>
    );
  }

  renderSummary() {
    let totalTons = this.getTotalWeight(),
      chargePerTon = 0,
      extraCharges = 0;

    const { action, product, region, lorryType } = this.state;

    if (this.areAllFieldsEntered()) {
      chargePerTon = chargesMap[action][product][region];
      if (action === 'loading') {
        extraCharges = lorryToRusumMap[lorryType];
      } else {
        extraCharges = chargesMap[action][product].extra[region];
      }
    }

    const items = [
      { label: 'Total Tons', value: totalTons.toString() },
      { label: 'Charge per Ton', value: chargePerTon.toString() },
      { label: action === 'loading' ? 'rusum' : 'Other Charges', value: extraCharges.toString() }
    ];
    return (
      <div className="summary">
        <Statistic.Group items={items} color='blue' />
      </div>
    );
  }

  getTotalWeight() {
    const { activityRows } = this.state;
    return activityRows.map((row) => row.weightInTons)
      .reduce((sum, value) => +parseFloat(value) + +sum);
  }

  renderFooter() {
    if (this.areAllFieldsEntered()) {
      return (
        <Form.Group className="actionButtons">
          <Form.Button attached='middle' content='SAVE & PRINT' width={12} onClick={this.addActivityRow.bind(this)} color="blue" />
          <Form.Button attached='middle' content='CLEAR' width={4} onClick={this.clearAllSettings.bind(this)} color="red" />
        </Form.Group>
      );
    }
    return (
      <Message negative floating>
        Please fill all inputs in red
      </Message>
    );
  }

  renderActivities() {
    if (!this.areAllFieldsEntered()) {
      return null;
    }
    const activities = [];
    for (let i = 0; i < this.state.activityRows.length; i++) {
      const { wsno, lorryNo, jattu, weightInTons } = this.state.activityRows[i];
      activities.push(
        <Form.Group key={i}>
          <Form.Input label='W.S.NO' placeholder='#####' width={3} onChange={ this.updateActivityRows.bind(this, i, 'wsno')} value={wsno} />
          <Form.Input label='Lorry NO' placeholder='AP12CD1234' width={4} onChange={ this.updateActivityRows.bind(this, i, 'lorryNo')} value={lorryNo} />
          <Form.Select label='Jattu' options={ this.getMasters('jattus') } placeholder='Jattu Name' width={4} onChange={this.updateActivityRows.bind(this, i, 'jattu')} value={jattu} />
          <Form.Input label='Weight in Tons' placeholder='00.00' width={3} onChange={ this.updateActivityRows.bind(this, i, 'weightInTons')} value={weightInTons} />
          { (i + 1) === this.state.activityRows.length ?
            <Form.Button label="New Row" content='+' width={2} onClick={this.addActivityRow.bind(this)} /> :
            <Form.Button label="Delete Row" content='-' width={2} onClick={this.removeActivityRow.bind(this, i)} /> }
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

  removeActivityRow(rowIdx) {
    const { activityRows } = this.state;
    const newActivityRows = activityRows.filter((row, idx) => idx !== rowIdx);
    this.setState({
      activityRows: newActivityRows
    });
  }

  addActivityRow() {
    const { activityRows } = this.state;
    activityRows.push({
      wsno: '',
      lorryNo: '',
      jattu: '',
      weightInTons: 0
    });
    this.setState({
      activityRows
    });
  }

  updateActivityRows(idx, inputName, e, data) {
    const { value } = data;
    const newActivityRows = [...this.state.activityRows];
    newActivityRows[idx][inputName] = value;
    this.setState({
      activityRows: newActivityRows
    });
  }

  onChangeValue(inputName, e, data) {
    const { value } = data;
    this.setState({
      [inputName]: value
    });
  }

  areAllFieldsEntered() {
    const { action, product, region, lorryType } = this.state;
    return action && product && region && lorryType;
  }

  clearAllSettings() {
    this.props.onClear();
  }

}

export default Billing;
