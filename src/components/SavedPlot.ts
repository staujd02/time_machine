import React, { Component } from 'react';
export default class SavedPlot extends Component {

  constructor(param){
    super(param);
    this.dataCapsule = this.props.dataCapsule;
    this.name = this.dataCapsule.name;
    this.className = this.props.className;
  }

  render() {
    return ( 
        <div className={this.className}>{this.name}</div>
    );
  }
}