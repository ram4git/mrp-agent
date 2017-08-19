import React, { Component } from 'react';
import { getBills } from '../int/Masters';
import { Loader, Header, Message, Table, Icon } from 'semantic-ui-react';

class Reports extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }


  componentDidMount() {
    this.getBillsFromDB();
  }

  getBillsFromDB() {
    getBills().then((rows) => {
      if (rows) {
        this.setState({
          data: rows,
          loading: false,
        });
      }
    }).catch((err) => {
      console.log(err);
      //alert("Unable to fetch BILLs from DB");
      this.setState({
        loading: false,
        errorMsg: 'DB ACCESS ERROR'
      });
    });
  }

  render() {
    return (
      <div className="reports">
        <Header as='h1'>ALL BILLS</Header>
        { this.state.loading
          ? <Loader active size='medium' inline='centered'>Fetching Bills...</Loader>
          : this.renderBillsTable() }
        { this.showMsgIfAny() }
      </div>
    );
  }

  showMsgIfAny() {
    if(this.state.errorMsg) {
      return (
        <Message negative floating>{this.state.errorMsg}</Message>
      );
    }
  }

  renderBillsTable() {
    const { data } = this.state;

    return (
      <Table sortable celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1} >
              S.NO
            </Table.HeaderCell>
            <Table.HeaderCell width={2} >
              DATE
            </Table.HeaderCell>
            <Table.HeaderCell width={2} >
              ACTION
            </Table.HeaderCell>
            <Table.HeaderCell width={2} >
              VEHICLE
            </Table.HeaderCell>
            <Table.HeaderCell width={2} >
              TONS & CHARGE
            </Table.HeaderCell>
            <Table.HeaderCell width={1} >
              OTHER CHARGES
            </Table.HeaderCell>
            <Table.HeaderCell width={2} >
              TOTAL ₹
            </Table.HeaderCell>
            <Table.HeaderCell width={2} >
              JATTU ₹
            </Table.HeaderCell>
            <Table.HeaderCell width={2} >
              BALANCE ₹
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { data.map((row) => {
            const { sno, date, action, product, region, lorryType, lorryNo } = row;
            const { totalAmount, jattuAmount, balanceAmount } = row;
            const { totalWeightInTons, chargePerTon, otherCharges } = row;
            const d = new Date(date);
            const dateString = d.toLocaleString();
            return (
              <Table.Row key={sno} positive={region === 'local'} negative={region !== 'local'}>
                <Table.Cell>{sno}</Table.Cell>
                <Table.Cell>{dateString}</Table.Cell>
                <Table.Cell><Icon name={`long arrow ${action === 'loading' ? 'up' : 'down'}`} />{`${product} ${action}`}</Table.Cell>
                <Table.Cell><Icon name={`${region === 'local' ? 'home' : 'plane'}`} />{`${lorryType} ${lorryNo}`}</Table.Cell>
                <Table.Cell>{`${totalWeightInTons} Tons ₹${chargePerTon}/Ton`}</Table.Cell>
                <Table.Cell className="price">{otherCharges.toFixed(2)}</Table.Cell>
                <Table.Cell className="price">{totalAmount.toFixed(2)}</Table.Cell>
                <Table.Cell className="price">{jattuAmount.toFixed(2)}</Table.Cell>
                <Table.Cell className="price">{balanceAmount.toFixed(2)}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }

  formatDate(epoch) {
    const date = new Date(epoch);
    return date.toLocaleString();
  }

}

export default Reports;
