import React, { Component } from 'react';
import Storage from 'electron-json-storage-sync';
import { Statistic } from 'semantic-ui-react';

import { getBill } from '../int/Masters';

export default class PrintPage extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    getBill(this.props.billNo)
      .then((row) => {
        console.log("BILL DATA=", row);
        this.setState({
          data: row[0]
        });
      })
      .catch((err) => {
        console.error("BILL DATA FETCH FAILED FOR " + this.props.billNo, err);
        this.setState({
          err: err
        });
      })
  }

  render() {
    const date = new Date();
    return (
      <div className="page">
        <div className="original copy">
          { this.renderPageHeader('office') }
          { this.renderBillDetails() }
          { this.renderFooter() }
        </div>
        <div className="security copy">
          { this.renderPageHeader('security') }
          { this.renderBillDetails() }
          { this.renderFooter() }
        </div>
      </div>
    );
  }

  renderFooter() {
    const { status, data } = Storage.get('session');
    if (status) {
      return (
        <footer>printed by <strong>{ data.username }</strong></footer>
      );
    }
  }

  renderPageHeader(copyType) {
    const date = new Date();

    return (
      <div className="printPageHeader">
        <h5>Sree Lalitha Industries Pvt Ltd.</h5>
        <h5>{ `BILL - #${this.state.data ? this.state.data.sno : ''}` }</h5>
        <h5>{ `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}</h5>
        <p>{ `${copyType.toUpperCase()} COPY` }</p>
        <hr />
      </div>
    );
  }

  renderBillDetails() {
    let statItems = [], amountItems = [];
    if (this.state.data) {
      statItems = [
        { label: 'Total Tons', value: this.state.data.totalWeightInTons.toString() },
        { label: 'Charge per Ton', value: this.state.data.chargePerTon.toString() },
        { label: this.state.action === 'loading' ? 'rusum' : 'Other Charges', value: this.state.data.otherCharges.toString() }
      ];
      amountItems = [
        { label: 'Total Amount', value: this.state.data.totalAmount.toString() },
        { label: 'Jattu Amount', value: this.state.data.jattuAmount.toString() },
        { label: 'Remaining', value: this.state.data.balanceAmount.toString() }
      ];
    }

    if (!this.state.data) {
      return
    }

    const wayBillNos = JSON.parse(this.state.data.activityRows).map((item) => item.wsno).join(',');

    return (
      <div className="orderHeader">

        <table>
          <tr>
            <td className="key">PRODUCT<span>:</span></td>
            <td className="value">{this.state.data.product.toUpperCase()}</td>
            <td className="key">ACTION<span>:</span></td>
            <td className="value">{this.state.data.action.toUpperCase()}</td>
          </tr>
          <tr>
            <td className="key">VEHICLE<span>:</span></td>
            <td className="value">{this.state.data.lorryType.toUpperCase()}</td>
            <td className="key">REGION<span>:</span></td>
            <td className="value">{this.state.data.region.toUpperCase()}</td>
          </tr>
          <tr>
            <td className="key">VEHICLE#<span>:</span></td>
            <td className="value">{this.state.data.lorryNo.toUpperCase()}</td>
            <td className="key">WSNO<span>:</span></td>
            <td className="value">{wayBillNos.toUpperCase()}</td>
          </tr>
        </table>
        <div className="summary">
          <Statistic.Group items={statItems} color='black' />
          <Statistic.Group items={amountItems} color='black' />
        </div>
      </div>
    );
  }
}
