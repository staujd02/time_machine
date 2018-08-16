import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';

export default class SavedPlot extends Component {

  constructor(param){
    super(param);
    this.dataCapsule = this.props.dataCapsule;
    this.name = this.dataCapsule.name;
    this.activeContext = this.props.active;
  }

  render() {
    return ( 
        <li>{this.name} <Button>Update</Button></li>
    );
  }
}