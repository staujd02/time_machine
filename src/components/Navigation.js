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
  }

  
  render() {

    var s = {
      margin: 0
    }

    this.reset = () => {
      toast("Resetting Animation", { 
        position: toast.POSITION.TOP_LEFT
      });
      this.IController.resetDataAnimation();
    }

    this.save = () => {
      toast("Saving...", { 
        position: toast.POSITION.TOP_LEFT
      });
      this.IController.saveLayout();
    }

    function handleSelect(selectedKey, IController) {
      IController.id = selectedKey;
      alert(IController.id);
    }

    return (
        <Navbar inverse style={s}>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/#">Time Machine</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav activeKey={1} onSelect={k => handleSelect(k, this.IController)}>
            <NavItem eventKey={1} href="/#/Run">Run</NavItem>
            <NavItem eventKey={2} href="/#/Reset" onClick={this.reset}>Reset
              <ToastContainer autoClose={1500} />
            </NavItem>
            <NavItem eventKey={3} href="/#/Save"> <Save IController={this.IController}></Save> </NavItem>
            <NavItem eventKey={4} href="/#/LoadPoint"><FileInput IController={this.IController} />  -point data</NavItem>
            <NavItem eventKey={5} href="/#/LoadFlux"><FileInput IController={this.IController} />  -flux data</NavItem>
          </Nav>
        </Navbar>
    );
  }
}

export default Navigation;