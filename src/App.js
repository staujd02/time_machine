import React, { Component } from 'react';
import './css/App.css';
import ThreeContainer from './components/ThreeContainer';
import Navigation from './components/Navigation';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import DataContext from './lib/threejs/DataContext';

class App extends Component {
 
  constructor(props){
    super(props);
    this.ThreeController = {
      // injectDataPointList: function(json) {/*...*/},
      // injectFluxList: function(json) {/*...*/},
      resetDataAnimation: function() {},
      getDataToSave: function () {},
      onLoad: function() {},
      onFluxLoad: function() {}
    };
    this.dataContext = new DataContext(this.ThreeController);
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
                  <Navigation dataContext={this.dataContext} IController={this.ThreeController} />
              </Row>
              <Row style={styleFill}>
                <Col sm={10} md={10} style={col}> 
                  <ThreeContainer dataContext={this.dataContext} IController={this.ThreeController}/> 
                </Col>
                <Col sm={2} md={2} style={datStyle} id="datGuiAnchor"></Col>
              </Row>
            </Grid>
      </div>
    );
  }
}

export default App;