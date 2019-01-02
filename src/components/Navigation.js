import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Image from 'react-bootstrap/lib/Image';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FileInput from './FileInput';
import localStorage from '../lib/LocalStorage';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

class Navigation extends Component {

  constructor(props){
    super(props);
    this.IController = this.props.IController;
    this.dataContext = this.props.dataContext;

    this.uploadPoints = this.uploadDataPoints.bind(this);
    this.uploadFlux = this.uploadFluxData.bind(this);
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

    return (
        <Navbar inverse id='mainNav'>
          <Navbar.Header>
            <Navbar.Brand className='nav-brand'>
              <a href="https://github.com/staujd02/time_machine">Compartmental Visualizer</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Form inline>
            <FileInput className='nav-item' onDone={this.uploadPoints} isPlot={false} accept=".xlsx" onClick={preventRedirect} title={"Upload Compartment Data"}/>
            <FileInput className='nav-item' onDone={this.uploadFlux} isPlot={false} accept=".xlsx" onClick={preventRedirect} title={"Upload Flux Data"}/>
            <FileInput className='nav-item' onDone={this.uploadModels} isPlot={true} accept=".json" onClick={preventRedirect} title={"Upload Models"}/>
            <FormGroup className='nav-item'>
              <ControlLabel htmlFor="Export Models" style={{ cursor: "pointer" }} onClick={this.downloadLocalStorage}>
                    {"Export Models"}
                    <ToastContainer autoClose={1500} />
              </ControlLabel>
            </FormGroup>
          </Form>
          <span> <Image className="logo" src="./pfw-white.png"></Image> </span>
        </Navbar>
    );
  }
}

export default Navigation;