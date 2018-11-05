import React, { Component } from 'react';
import './css/App.css';
import ThreeContainer from './components/ThreeContainer';
import Navigation from './components/Navigation';
import StorageList from './components/StorageList.js';
import Storage from './lib/Storage.js';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import DataContext from './lib/threejs/DataContext';

class App extends Component {
 
  constructor(props){
    super(props);
    this.ThreeController = {
      resetDataAnimation: function() {},
      onLoad: function() {},
      onFluxLoad: function() {}
    };
    this.saves = (new Storage()).loadFromStorage(this.ThreeController);
    let currentPlot = this.saves[0].versions[this.saves[0].versions.length - 1].plot;
    this.currentContext = new DataContext(currentPlot);
  }

  render() {

    var styleFill = {
      height: '100%',
    };

    var datStyle = {
      backgroundColor: 'grey',
      height: '100%'
    }

    var col = {
      padding: 0,
      height: '100%'
    }

    return (
      <div className="App" style={styleFill}>
            <Grid fluid={true} style={styleFill}>
              <Row>
                  <Navigation dataContext={this.currentContext} IController={this.ThreeController} />
              </Row>
              <Row style={styleFill}>
                <Col sm={10} md={10} style={col}> 
                  <ThreeContainer dataContext={this.currentContext} IController={this.ThreeController}/> 
                </Col>
                <Col sm={2} md={2}>
                  <Row sm={2} md={2}>
                    <div style={datStyle} id="datGuiAnchor"></div>
                  </Row>
                  <Row sm={2} md={2}>
                    <br/>
                    <br/>
                  </Row>
                  <Row sm={2} md={2}>
                    <StorageList dataContext={this.currentContext} saves={this.saves}></StorageList>
                  </Row>
                </Col>
              </Row>
            </Grid>
      </div>
    );
  }
}

export default App;