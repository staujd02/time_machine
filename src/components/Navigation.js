import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

class Navigation extends Component {

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
            <NavItem eventKey={2} href="/#/Reset">Reset</NavItem>
            <NavItem eventKey={3} href="/#/Save">Save</NavItem>
            <NavItem eventKey={4} href="/#/Load">Load</NavItem>
          </Nav>
        </Navbar>
    );
  }
}

export default Navigation;