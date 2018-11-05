import React, { Component } from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import Storage from '../lib/Storage';

class Save extends Component {

  constructor(props){
    super(props);
    this.onClick = this.save.bind(this); 
  }

  download(contents, name) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contents));
    var dlAnchorElem = this.inputElement;
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", name + '.json');
    dlAnchorElem.click(); 
  }

  save(){
      toast("Saving...", { 
        position: toast.POSITION.TOP_LEFT
      });
      let name = window.prompt("Name of the File: ");
      if(name){
        this.download((new Storage()).loadModelsFromDefaultContainer(), name);
      }
  }
  
  render() {
    return (
        <FormGroup>
            <ControlLabel htmlFor="saveFile" onClick={this.onClick} style={{ cursor: "pointer" }}> Download Backup </ControlLabel>
            <ToastContainer autoClose={1500} />
            <link ref={input => this.inputElement = input} style={{ display: "none"}} />
        </FormGroup>
    );
  }
}

export default Save;