import React, { Component } from 'react';
import { remote } from 'electron';
import { getBills, getBillsForShift } from '../int/Masters';
import { Loader, Header, Message, Table, Popup, Icon, Dropdown, Button, Label } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';


const shiftOptions = [
  { key: 'morning', value: 'morning', text: 'MORNING 9AM-9PM' },
  { key: 'night', value: 'night', text: 'NIGHT 9PM-9AM' }
];


class Reports extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      shift: 'morning',
      startDate: moment()
    };
  }


  componentDidMount() {
    const currHour = this.state.startDate.get('hour');
    if(currHour >= 9 && currHour < 18) {
      if(this.state.shift === 'night') {
        this.setState({
          shift: 'morning'
        });
      }
    } else {
      if(this.state.shift === 'morning') {
        this.setState({
          shift: 'night'
        });
      }
    }
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

  getBillsForShiftDB(start, end) {
    getBillsForShift(start,end).then((rows) => {
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
      <div>
        { this.renderDateShiftPicker() }
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
              const { totalAmount, jattuAmount, balanceAmount, screenshot } = row;
              const { totalWeightInTons, chargePerTon, otherCharges } = row;
              const d = new Date(date);
              const dateString = d.toLocaleString();
              return (
                <Table.Row key={sno} positive={region === 'local'} negative={region !== 'local'}>
                  <Table.Cell>
                    <Popup
                      trigger={<Button icon>{sno}</Button>}
                      on='click'
                      hideOnScroll>
                      <img src={ screenshot } />
                    </Popup>
                  </Table.Cell>
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
      </div>
    );
  }

  renderDateShiftPicker() {
    return (
      <div>
        <div className="datePicker">
          <DatePicker
            withPortal
            dateFormat="DD/MM/YYYY"
            className="datePicker"
            selected={this.state.startDate}
            onChange={this.handleDateShiftChange.bind(this)} />
        </div>
        <Dropdown className="shiftPicker" placeholder='shift' search selection options={shiftOptions} value={this.state.shift} onChange={ this.handleShiftChange.bind(this) } />
        <Button.Group>
          <Button primary onClick={ this.handleSearch.bind(this) }>SEARCH</Button>
          <Button secondary onClick={ this.handlePrint.bind(this) }>PRINT</Button>
        </Button.Group>
        { this.renderTotalBalance() }

      </div>
    );
  }

  renderTotalBalance() {
    const totalBalance = this.state.data.map((item) => item.balanceAmount).reduce((a, b) => a + b, 0) || 0;
    return (
      <Label as='a' size="massive">
        Total Balance
        <Label.Detail>{totalBalance.toLocaleString('en-IN')}</Label.Detail>
      </Label>
    );
  }

  handleSearch(e,data) {
    let startEpoch = this.state.startDate.toDate().setHours(9,0,0,0);
    let endEpoch = this.state.startDate.toDate().setHours(21,0,0,0);
    if(this.state.shift === 'night') {
      startEpoch = this.state.startDate.toDate().setHours(21,0,0,0);
      endEpoch = this.state.startDate.toDate().setHours(33,0,0,0);
    }
    this.getBillsForShiftDB(startEpoch, endEpoch);
  }

  handlePrint(e,data) {
    remote.getCurrentWebContents().print();
  }

  handleDateShiftChange(date) {
    console.log("RAM");
    this.setState({
      startDate: date
    });
  }

  handleShiftChange(e, data) {
    const { value } = data;

    this.setState({
      shift: value
    });
  }

  formatDate(epoch) {
    const date = new Date(epoch);
    return date.toLocaleString();
  }

}

export default Reports;
