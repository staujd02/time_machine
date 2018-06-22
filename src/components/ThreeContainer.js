import React, { Component } from 'react';
import threeEntryPoint from '../lib/threejs/threeEntryPoint';
import FileUtilities from '../lib/FileUtilities';

/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
export default class ThreeContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.IController = {
      injectDataPointList: function(json){}
    };
  }

  componentDidMount() {
    threeEntryPoint(this.threeRootElement, this.IController);
  }

  readFile(files){
    var fileUtil = new FileUtilities();
    const cntrl = this.IController;
    fileUtil.processXLSXIntoCSV(files[0], function(dataString){
      cntrl.injectDataPointList(dataString);
    });
  }

  render () {
      return (
        <div>
        <div ref={element => this.threeRootElement = element} />
        <input id="fileInput" type="file" onChange={ (e) => this.readFile(e.target.files)} ref={input => {this.fileInput = input;}}/>
        </div>
      );
  }
}