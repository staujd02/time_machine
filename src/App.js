import React, { Component } from 'react';
import './css/App.css';
import ThreeContainer from './components/ThreeContainer';
import Navigation from './components/Navigation';
import StorageList from './components/StorageList.js';
import LocalStorage from './lib/LocalStorage.js';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import DataContext from './lib/DataContext';

import Logo from './assets/pfw-white.png';

class App extends Component {

  constructor(props) {
    super(props);
    this.ThreeController = {
      resetDataAnimation: function () { },
      onLoad: function () { },
      onFluxLoad: function () { }
    };
    this.fetchSaves()
  }

  async fetchSaves() {
    let saves = await ((new LocalStorage()).loadFromStorage(this.ThreeController));
    let currentPlot = saves[0].versions[saves[0].versions.length - 1].plot;
    let currentContext = new DataContext(currentPlot);
    this.setState({
      saves: saves,
      currentPlot: currentPlot,
      currentContext: currentContext
    });
  }

  render() {
    if (!this.state || !this.state.currentContext)
      return (<div>Loading From Storage</div>);

    return (
      <div className="app">
        <Grid fluid={true} className='fill'>
          <Row>
            <Navigation dataContext={this.state.currentContext} IController={this.ThreeController} />
          </Row>
          <Row className='fill'>
            <Col sm={2} md={2} className='sidebar'>
              <Row sm={2} md={2}>
                <div className='dat-style' id="datGuiAnchor"></div>
              </Row>
              <Row sm={2} md={2}>
                <StorageList dataContext={this.state.currentContext} saves={this.saves}></StorageList>
              </Row>
              <div className="wrapper">
                <img alt="Purdue logo" className="logo" src={Logo}></img>
              </div>
            </Col>
            <Col sm={10} md={10} className='threeContainer'>
              <ThreeContainer dataContext={this.state.currentContext} IController={this.ThreeController} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;