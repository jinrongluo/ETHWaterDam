import React, { Component } from "react";
import ReadingCollectorContract from "./contracts/ReadingCollector.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import BootstrapTable from 'react-bootstrap-table/lib/BootstrapTable';
import TableHeaderColumn from 'react-bootstrap-table/lib/TableHeaderColumn';
import Alert from 'react-bootstrap/Alert'
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      account: null,
      contract: null,
      readings: [],
      currentTime: null,
      currentReading: null,
      alertTime: null,
      alertReading: null,
      minLevel: null,
      maxLevel: null,
      startReading: false
    }
    this.startReading = this.startReading.bind(this)
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ReadingCollectorContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ReadingCollectorContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      this.setState({ web3, account: accounts[0], contract: instance });
      this.addEventListener(this)
      this.getMinMaxLevel(this);
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  async getMinMaxLevel(component) {
    if (typeof component.state.contract !== 'undefined') {
      const min = await component.state.contract.methods.minLevel().call();
      const max = await component.state.contract.methods.maxLevel().call();
      component.setState({minLevel: min, maxLevel: max});
    }
  }

  startReading(event) {
    if (typeof this.state.contract !== 'undefined') {
      this.state.contract.methods.startReading()
      .send({from: this.state.account, value: this.state.web3.utils.toWei('0.008', 'ether')})
      this.setState({startReading: true});
    }
  }

  addEventListener(component) {
    // listen to reading data event
    component.state.contract.events.LogReading({fromBlock: 0, toBlock: 'latest'})
    .on('data', function(event){
      const time = convetToDateTime(event.returnValues.time);
      const reading = event.returnValues.reading;
      const normal = event.returnValues.normal ? null : 'ALERT!!';
      
      let newReadings = component.state.readings.slice();
      const id = newReadings.length + 1;
      newReadings.unshift({id, time, reading, normal});

      component.setState({readings: newReadings, currentTime: time, currentReading: reading});
      if(!normal){
        component.setState({alertTime: time, alertReading: reading})
      }
    })
    .on('error', console.error);

    // listen to not enough query fund event.
    component.state.contract.events.LogNewProvableQuery({fromBlock: 'latest', toBlock: 'latest'})
    .on('data', function(event){
      component.setState({startReading: false});
    })
    .on('error', console.error);
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Carousel>
          <Carousel.Item>
            <img className="d-block w-100" src="water_dam.jpg" alt="First slide"/>
            <Carousel.Caption>
              <h1>Security</h1>
              <h3>With rules written in Smart Contract, security is built-in. Period.</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="water_dam2.jpg" alt="Third slide"/>
            <Carousel.Caption>
              <h1>Autonomy</h1>
              <h3>Running 24/7, the alarm system is no longer offline.</h3>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="d-block w-100" src="water_dam3.jpg" alt="Third slide"/>
            <Carousel.Caption>
              <h1>Resilience</h1>
              <h3>No single point of failure, the network is truely discentralized.</h3>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

      <Container className="main">
          <Row className="row_margin">
            <Col className="title">
                <h3>Blockchain Based Water Level Alarm System for Dam Infrastructure</h3>
            </Col>
          </Row>     
          <Alert variant="danger" className={this.state.alertReading ? '' : 'hidden'}>
              {`ALERT: last alarm at ${this.state.alertTime} with reading ${this.state.alertReading}`}
          </Alert>
          <Row className="row_margin">
            <Col xs md="3"> <b>CURRENT READING:</b> </Col>
            <Col> {this.state.currentTime} </Col>
            <Col> {this.state.currentReading} </Col>
            <Col> <Button onClick={this.startReading}
                  disabled={this.state.startReading ? true: false}>
                    Start Reading</Button>
            </Col>
          </Row>

          <Row className="histry_margin">
            <Col xs md="3">
              <b>HISTORICAL READINGS:</b>
            </Col>
            <Col></Col> <Col></Col> <Col></Col>
          </Row>

          <BootstrapTable data={this.state.readings} striped hover>
              <TableHeaderColumn isKey dataField='id'>#</TableHeaderColumn>
              <TableHeaderColumn dataField='time'>Reading Time</TableHeaderColumn>
              <TableHeaderColumn dataField='reading'>Reading Data</TableHeaderColumn>
              <TableHeaderColumn dataField='normal'>
                Min = {this.state.minLevel}; Max = {this.state.maxLevel}
              </TableHeaderColumn>
          </BootstrapTable>
        </Container>
      </div>
    );
  }
}

function convetToDateTime(time){
  var date = new Date(time*1000);
  // Display date time in yyyy-MM-dd h:m:s format
  return date.getFullYear() + '-' + (date.getMonth() + 1) +'-'+ date.getDate() + ' '
    + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

export default App;
