import React, { Component } from 'react';
import threeEntryPoint from './threejs/threeEntryPoint';
import FileUtilities from './FileUtilities';

/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
export default class ThreeContainer extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = { counter: 0 };
    this.IController = {
      injectDataPointList: function(json){}
    };
  }

  componentDidMount() {
    threeEntryPoint(this.threeRootElement, this.IController);
  }

  readData(files){
    var fileUtil = new FileUtilities();
    const cntrl = this.IController;
    fileUtil.readData(files, function(dataString){
      cntrl.injectDataPointList(dataString);
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