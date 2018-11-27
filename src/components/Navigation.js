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
    this.processUpload = this.processUpload.bind(this);
  }

  async downloadLocalStorage(){
    toast("Prepping Download", { 
      position: toast.POSITION.TOP_LEFT
    });
    let data = JSON.stringify(await (new localStorage()).loadModelsFromDefaultContainer());
    var blobData = new Blob([data], {type: 'text/plain'});
    let textFile = window.URL.createObjectURL(blobData);
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", textFile);
    downloadAnchorNode.setAttribute("download", "plots.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  processUpload(e){
    this.readPlots(e.target.files);
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

  async  uploadModels(data) {
    if(data && window.confirm("Warning! This will replace all of your models with the uploaded models. Continue?")){
      await (new localStorage()).writeToLocalStorage(data);
      window.location.reload();
      return;
    }
    toast("No Models Uploaded", { 
      position: toast.POSITION.TOP_LEFT
    });
  }

  render() {

    let preventRedirect = e => {
      e.preventDefault();
    };

    let nav = {
      margin: 10
    };

    return (
        <Navbar inverse id='nomargin'>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Compartmental Visualizer</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Form inline>
            <FileInput style={nav} onDone={this.uploadPoints} isPlot={false} accept=".xlsx" onClick={preventRedirect} title={"Upload Point Data"}/>
            <FileInput style={nav} onDone={this.uploadFlux} isPlot={false} accept=".xlsx" onClick={preventRedirect} title={"Upload Flux Data"}/>
            <Button id='reset' onClick={this.reset}>Reset
              <ToastContainer autoClose={1500} />
            </Button>
            <Button id='export' onClick={this.downloadLocalStorage}>Export Models
              <ToastContainer autoClose={1500} />
            </Button>
            <FileInput onDone={this.uploadModels} isPlot={true} accept=".json" onClick={preventRedirect} title={"Upload Compartment Models"}/>
          </Form>
        </Navbar>
    );
  }
}

export default Navigation;