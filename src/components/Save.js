import React, { Component } from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

class Save extends Component {

  constructor(props){
    super(props);
    this.onClick = () => {this.save(this.props.IController)}
  }

  download(contents, name) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contents));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", name + '.json');
    dlAnchorElem.click(); 
  }

  save(dataHook){
      toast("Saving...", { 
        position: toast.POSITION.TOP_LEFT
      });
      let name = window.prompt("Name of the File: ");
      if(name)
        this.download(dataHook.getDataToSave(), name);
  }
  
  render() {
    return (
        <FormGroup>
            <ControlLabel htmlFor="saveFile" onClick={this.onClick} style={{ cursor: "pointer" }}> Save </ControlLabel>
            <ToastContainer autoClose={1500} />
            <label id="downloadAnchorElem" style={{ display: "none"}}>Invisible DOM hook </label>
        </FormGroup>
    );
  }
}

export default Save;