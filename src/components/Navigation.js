import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FileInput from './FileInput';
import localStorage from '../lib/LocalStorage';
import '../css/nav.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

class Navigation extends Component {

  constructor(props){
    super(props);
    this.IController = this.props.IController;
    this.dataContext = this.props.dataContext;

    this.uploadPoints = this.uploadDataPoints.bind(this);
    this.uploadFlux = this.uploadFluxData.bind(this);
    this.reset = this.reset.bind(this);
  }

  displayLocalStorage(){
    let data = JSON.stringify((new localStorage()).loadPlotsFromDefaultContainer());
    var downloadAnchorNode = document.createElement('a');
    var blobData = new Blob([data], {type: 'text/plain'});
    let textFile = window.URL.createObjectURL(blobData);
    downloadAnchorNode.setAttribute("href", textFile);
    downloadAnchorNode.setAttribute("download", "plots.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
  }

  writeLocalStorage(){
    let input = prompt("Please Input JSON data");
    if(input)
      (new localStorage()).writeToLocalStorage(input);
  }

  reset(e){
    e.preventDefault();
    toast("Resetting Animation", { 
      position: toast.POSITION.TOP_LEFT
    });
    this.IController.resetDataAnimation();
  }

  uploadDataPoints(data){
      toast("Upload Point Data Complete", { 
        position: toast.POSITION.TOP_LEFT
      });
      this.dataContext.injectDataPointList(data);
  }

  uploadFluxData(data) {
    toast("Upload Flux Data Complete", { 
      position: toast.POSITION.TOP_LEFT
    });
    this.dataContext.injectFluxList(data);
  }

  render() {

    let preventRedirect = e => {
      e.preventDefault();
    }

    let nav = {
      margin: 10
    };

    return (
        <Navbar inverse id='nomargin'>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Time Machine</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Form inline>
            <FileInput style={nav} onDone={this.uploadPoints} onClick={preventRedirect} title={"Upload Point Data"}/>
            <FileInput style={nav} onDone={this.uploadFlux} onClick={preventRedirect} title={"Upload Flux Data"}/>
            <Button id='reset' onClick={this.reset}>Reset
              <ToastContainer autoClose={1500} />
            </Button>
            <Button onClick={this.displayLocalStorage}>Export Data
              <ToastContainer autoClose={1500} />
            </Button>
            <Button onClick={this.writeLocalStorage}>Upload Data
              <ToastContainer autoClose={1500} />
            </Button>
          </Form>
        </Navbar>
    );
  }
}

export default Navigation;