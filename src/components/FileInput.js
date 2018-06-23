import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FileUtilities from '../lib/FileUtilities';
import NavItem from 'react-bootstrap/lib/NavItem';

/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
export default class ThreeContainer extends NavItem {

  constructor(props) {
    super(props);
    this.IController = this.props.IController;
  }

  noFiles(files){
    return files.length == 0;
  }

  readXLSX(files){
    const cntrl = this.IController;
    let fileUtil = new FileUtilities();
    if(this.noFiles(files))
      return;
    fileUtil.processXLSXIntoCSV(files[0], function(dataString){
       cntrl.injectDataPointList(dataString);
    });
  }

  render () {
      return (
        <FormGroup>
         <ControlLabel htmlFor="fileUpload" style={{ cursor: "pointer" }}>
              Upload file
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
        