import React, { Component } from 'react';
export default class SavedPlot extends Component {

  constructor(param){
    super(param);
    this.dataCapsule = this.props.dataCapsule;
    this.name = this.dataCapsule.name;
  }

  render() {
    return ( 
        <span>{this.name}</span>
    );
  }
}