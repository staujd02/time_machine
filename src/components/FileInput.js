import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FileUtilities from '../lib/utilities/FileUtilities';
import NavItem from 'react-bootstrap/lib/NavItem';

export default class FileInput extends NavItem {

  constructor(props) {
    super(props);
    this.title = this.props.title || "Upload file";
    this.processUpload = this.processUpload.bind(this);
    this.state = { callback: this.props.onDone, accept: this.props.accept, plot: this.props.isPlot };
  }

  hasNoFiles(files){
    return files.length === 0;
  }

  processUpload(e){
    if(this.state.plot)
      this.readPlots(e.target.files, this.state.callback);
    else
      this.readXLSX(e.target.files, this.state.callback);
  }

  readPlots(files, callback){
    const call = callback;
    let fileUtil = new FileUtilities();
    if(files.length === 0)
      return;
    fileUtil.processPlotsData(files[0], function(dataString){
       call(dataString);
    });
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
                           accept={this.accept}
                           onChange={this.processUpload} 
                           ref={input => {this.fileInput = input;}} 
                           style={{ display: "none" }} />
          </ControlLabel>
        </FormGroup>
      );
  }
}
        