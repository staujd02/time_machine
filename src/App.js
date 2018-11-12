import React, { Component } from 'react';
import './css/App.css';
import ThreeContainer from './components/ThreeContainer';
import Navigation from './components/Navigation';
import StorageList from './components/StorageList.js';
import LocalStorage from './lib/LocalStorage.js';
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
    this.fetchSaves()
  }

  async fetchSaves(){
    let saves = await ((new LocalStorage()).loadFromStorage(this.ThreeController));
    console.log(saves);
    let currentPlot = saves[0].versions[saves[0].versions.length - 1].plot;
    let currentContext = new DataContext(currentPlot);
    this.setState({
      saves: saves,
      currentPlot: currentPlot,
      currentContext: currentContext
    });
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

    if(!this.state || !this.state.currentContext)
      return (<div>Loading From Storage</div>);

    return (
      <div className="App" style={styleFill}>
            <Grid fluid={true} style={styleFill}>
              <Row>
                  <Navigation dataContext={this.state.currentContext} IController={this.ThreeController} />
              </Row>
              <Row style={styleFill}>
                <Col sm={10} md={10} style={col}> 
                  <ThreeContainer dataContext={this.state.currentContext} IController={this.ThreeController}/> 
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
                    <StorageList dataContext={this.state.currentContext} saves={this.saves}></StorageList>
                  </Row>
                </Col>
              </Row>
            </Grid>
      </div>
    );
  }
}

export default App;