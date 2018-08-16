import React, { Component } from 'react';
import './css/App.css';
import ThreeContainer from './components/ThreeContainer';
import Navigation from './components/Navigation';
import StorageList from './components/StorageList.js';
import LocalStorage from './lib/LocalStorage.js';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class App extends Component {
 
  constructor(props){
    super(props);
    this.ThreeController = {
      resetDataAnimation: function() {},
      getDataToSave: function () {},
      onLoad: function() {},
      onFluxLoad: function() {}
    };
    this.plots = (new LocalStorage()).loadFromStorage(this.ThreeController);
    this.currentContext = this.plots[0].versions[0].context;
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
                    <StorageList plots={this.plots} currentContext={this.currentContext}></StorageList>
                  </Row>
                </Col>
              </Row>
            </Grid>
      </div>
    );
  }
}

export default App;