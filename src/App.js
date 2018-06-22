import React, { Component } from 'react';
import ThreeContainer from './components/ThreeContainer';
import Navigation from './components/Navigation';
import FileInput from './components/FileInput';

class App extends Component {
 
  constructor(props){
    super(props);
    this.ThreeController = {
      injectDataPointList: function(json) {/*...*/},
      resetDataAnimation: function() {}
    };
  }

  render() {
    return (
      <div className="App">
        <Navigation IController={this.ThreeController} />
        <FileInput IController={this.ThreeController} />
        <div className="App-canvas">
          <ThreeContainer IController={this.ThreeController}/>
        </div>
      </div>
    );
  }
}

export default App;
