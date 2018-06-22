import React, { Component } from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Label from 'react-bootstrap/lib/Label';
import FileUtilities from '../lib/FileUtilities';

/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
export default class ThreeContainer extends Component {

  constructor(props) {
    super(props);
    this.IController = this.props.IController;
  }

  readXLSX(files){
    const cntrl = this.IController;
    var fileUtil = new FileUtilities();
    fileUtil.processXLSXIntoCSV(files[0], function(dataString){
       cntrl.injectDataPointList(dataString);
    });
  }

  render () {
      return (
        <FormGroup>
         <ControlLabel htmlFor="fileUpload" style={{ cursor: "pointer" }}><h3><Label bsStyle="success">Add file</Label></h3>
              <FormControl id="fileUpload" 
                           type="file" 
                           accept=".xlsx" 
                           onChange={ (e) => this.readXLSX(e.target.files)} 
                           ref={input => {this.fileInput = input;}} 
                           style={{ display: "none" }} />
          </ControlLabel>
        </FormGroup>
      );
  }
}
        