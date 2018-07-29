import React, { Component } from 'react';
import './css/App.css';
import ThreeContainer from './components/ThreeContainer';
import Navigation from './components/Navigation';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class App extends Component {
 
  constructor(props){
    super(props);
    this.ThreeController = {
      injectDataPointList: function(json) {/*...*/},
      resetDataAnimation: function() {},
      getData: function () {},
      onLoad: function() {}
    };
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
                  <Navigation IController={this.ThreeController} />
              </Row>
              <Row style={styleFill}>
                <Col sm={10} md={10} style={col}> 
                  <ThreeContainer IController={this.ThreeController}/> 
                </Col>
                <Col sm={2} md={2} style={datStyle} id="datGuiAnchor"></Col>
              </Row>
            </Grid>
      </div>
    );
  }
}

export default App;