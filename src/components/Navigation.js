import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import FileInput from './FileInput';

class Navigation extends Component {

  constructor(props){
    super(props);
    this.IController = this.props.IController;
  }

  render() {
    return (
        <Navbar inverse >
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/#">Time Machine</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} href="/#/Run">Run</NavItem>
            <NavItem eventKey={2} href="/#/Reset" onClick={this.IController.resetDataAnimation()}>Reset</NavItem>
            <NavItem eventKey={3} href="/#/Save">Save</NavItem>
            <NavItem eventKey={4} href="/#/Load"><FileInput IController={this.IController} /></NavItem>
          </Nav>
        </Navbar>
    );
  }
}

export default Navigation;