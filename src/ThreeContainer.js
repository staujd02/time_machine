import React, { Component } from 'react';
import threeEntryPoint from './threejs/threeEntryPoint';
import FileUtilities from './FileUtilities';

/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
export default class ThreeContainer extends Component {

  componentDidMount() {
    threeEntryPoint(this.threeRootElement);
   // FileInput(this.threeRootElement);
  }

  readData(files){
    var fileUtil = new FileUtilities();
    fileUtil.readData(files, function(dataString){
      alert(dataString);
    });

  }

  render () {
      return (
        <div>
        <div ref={element => this.threeRootElement = element} />
        <input id="fileInput" type="file" onChange={ (e) => this.readData(e.target.files)} ref={input => {this.fileInput = input;}}/>
        </div>
      );
  }
}