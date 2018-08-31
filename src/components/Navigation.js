import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import FileInput from './FileInput';
import Save from './Save';
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

    var s = {
      margin: 0
    }

    function handleSelect(selectedKey, IController) {
      IController.id = selectedKey;
    }

    let preventRedirect = e => {
      e.preventDefault();
    }

    return (
        <Navbar inverse style={s}>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">Time Machine</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav activeKey={1} onSelect={k => handleSelect(k, this.IController)}>
            <NavItem eventKey={2} href="/#" onClick={this.reset}>Reset
              <ToastContainer autoClose={1500} />
            </NavItem>
            {/* <NavItem eventKey={3} href="/#"> 
                <Save context={this.dataContext} onClick={preventRedirect} /> 
            </NavItem> */}
            <NavItem eventKey={4} href="/#">
                <FileInput onDone={this.uploadPoints} onClick={preventRedirect} title={"Upload Point Data"}/>
             </NavItem>
            <NavItem eventKey={5} href="/#">
                <FileInput onDone={this.uploadFlux} onClick={preventRedirect} title={"Upload Flux Data"}/>
            </NavItem>
          </Nav>
        </Navbar>
    );
  }
}

export default Navigation;