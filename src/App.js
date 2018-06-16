import React, { Component } from 'react';
import ThreeContainer from './ThreeContainer';
import Navigation from './Navigation';
import FileInput from './FileInput';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation/>
        <div className="App-canvas">
          <ThreeContainer/>
          <div className="fileInput">
          <FileInput id="browse"/>
          </div>
        </div>
      </div>
    );
  }
}


export default App;
