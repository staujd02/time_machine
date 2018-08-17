import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FileUtilities from '../lib/FileUtilities';
import NavItem from 'react-bootstrap/lib/NavItem';

export default class FileInput extends NavItem {

  constructor(props) {
    super(props);
    this.title = this.props.title || "Upload file";
    this.processUpload = this.processUpload.bind(this);
    this.state = { callback: this.props.onDone };
  }

  hasNoFiles(files){
    return files.length === 0;
  }

  processUpload(e){
    this.readXLSX(e.target.files, this.state.callback);
  }

  readXLSX(files, callback){
    const call = callback;
    let fileUtil = new FileUtilities();
    if(this.hasNoFiles(files))
      return;
    fileUtil.processXLSXIntoCSV(files[0], function(dataString){
       call(dataString);
    });
  }

  render () {
      return (
        <FormGroup>
         <ControlLabel htmlFor={this.title} style={{ cursor: "pointer" }}>
              {this.title}
              <FormControl id={this.title}
                           type="file" 
                           accept=".xlsx" 
                           onChange={this.processUpload} 
                           ref={input => {this.fileInput = input;}} 
                           style={{ display: "none" }} />
          </ControlLabel>
        </FormGroup>
      );
  }
}
        