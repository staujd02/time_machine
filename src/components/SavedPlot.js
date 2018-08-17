import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import LocalStorage from '../lib/LocalStorage';

export default class SavedPlot extends Component {

  constructor(param){
    super(param);
    this.dataCapsule = this.props.dataCapsule;
    this.context = this.props.dataContext;
    this.name = this.dataCapsule.name;
    let parent = this;
    this.state = {
      activeVersion: parent.dataCapsule.versions[parent.dataCapsule.versions.length - 1].plot,
      context: parent.context
    };
    this.updateEntry = this.updateEntry.bind(this);
    this.isActive = this.isActive.bind(this);
  }

  updateEntry() {
    (new LocalStorage()).updateStorage(this.name, this.state.context.currentPlot);
    this.setState({
      activeVersion: this.state.context.currentPlot
    });
  }

  isActive() {
    return this.state.activeVersion.id === this.state.context.currentPlot.id ? "Update" : "Load";
  }

  render() {
    return ( 
        <li>{this.name} <Button onClick={this.updateEntry}>{this.isActive()}</Button></li>
    );
  }
}