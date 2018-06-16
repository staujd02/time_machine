import React, { Component } from 'react';
import ThreeContainer from './ThreeContainer';
import Navigation from './Navigation';
import './css/bootstrap.min.css';
import './fonts/glyphicons-halflings-regular.eot';
import './css/bootstrap.min.css';
import './css/bootstrap-theme.min.css';
import './css/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation/>
        <div className="App-canvas">
          <ThreeContainer/>
        </div>
      </div>
    );
  }
}

export default App;
