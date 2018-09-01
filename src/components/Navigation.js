import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FileInput from './FileInput';
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
            <FileInput className={'nav'} onDone={this.uploadFlux} onClick={preventRedirect} title={"Upload Flux Data"}/>
            <Button id='reset' onClick={this.reset}>Reset
              <ToastContainer autoClose={1500} />
            </Button>
          </Form>
        </Navbar>
    );
  }
}

export default Navigation;