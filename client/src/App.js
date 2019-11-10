import React, { Component } from "react";
import ReadingCollectorContract from "./contracts/ReadingCollector.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import "./App.css";

class App extends Component {
  state = {web3: null, accounts: null, contract: null };

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

      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

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

      <Container>
                  <Row>
                  <a href={this.state.etherscanLink} target="_blank">Last Transaction Details</a>
                  </Row>
                  <Row>
                    <Card>
                    <Card.Header>Issued Bounties</Card.Header>
                    
                    </Card>
                    </Row>
                  <Row>
                  <Card>
                  <Card.Header>Issue Bounty</Card.Header>
                  <Form onSubmit={this.handleIssueBounty}>
                      <Form.Group
                        controlId="fromCreateBounty"
                      >
                        <Form.Control
                          componentClass="textarea"
                          name="bountyData"
                          value={this.state.bountyData}
                          placeholder="Enter bounty details"
                          onChange={this.handleChange}
                        />
    
                    <Form.Control
                          type="text"
                          name="bountyDeadline"
                          value={this.state.bountyDeadline}
                          placeholder="Enter bounty deadline"
                          onChange={this.handleChange}
                        />
                      
                    <Form.Control
                          type="text"
                          name="bountyAmount"
                          value={this.state.bountyAmount}
                          placeholder="Enter bounty amount"
                          onChange={this.handleChange}
                        />

                        <Button type="submit">Issue Bounty</Button>
                      </Form.Group>
                  </Form>
                  </Card>
                  </Row>
                  </Container>

      </div>
    );
  }
}

export default App;
