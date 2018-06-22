import React, { Component } from 'react';
import ThreeContainer from './components/ThreeContainer';
import Navigation from './components/Navigation';

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
