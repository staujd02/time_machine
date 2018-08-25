import React, { Component } from 'react';
import SavedPlot from './SavedPlot';
import Button from 'react-bootstrap/lib/Button';
import LocalStorage from '../lib/LocalStorage';

export default class StorageList extends Component {

  constructor(param){
    super(param);
    this.handleClick = this.handleClick.bind(this);
    this.addToLocal = this.addToLocal.bind(this);
    var parent = this;
    this.state = {dataContext: parent.props.dataContext};
  }

  isActive(capsule){
    return this.state.dataContext.currentPlot().id === capsule.versions[capsule.versions.length - 1].plot.id;
  }

  applyName(capsule){
    return this.isActive(capsule) ? "Save" : "Load";
  }  

  createEntry(save){
      let plotEntry = <SavedPlot dataCapsule={save}/>;
      let button = <Button onClick={() => this.handleClick(save)}>{this.applyName(save)}</Button>;
      let container = <li key={this.entries.length}> {plotEntry} {button}</li>
      return container;
  }

  addToLocal(){
    let resp = window.prompt('Name of Storage');
    if(!!resp){
      let s = (new LocalStorage()).addNewToLocal(resp);
      this.entries.push(this.createEntry(s));
      this.forceUpdate();
    }
  }

  handleClick(s) {
    if(this.isActive(s)){
      (new LocalStorage()).updateStorage(s.name, this.state.dataContext.currentPlot());
    } else {
      this.state.dataContext.currentPlot(s);
      this.forceUpdate();
    }
  }

  loadSaves(){
    return (new LocalStorage()).loadFromStorage(this.ThreeController);
  }

  render() {
    this.entries = [];
    this.loadSaves().forEach(s => {
      this.entries.push(this.createEntry(s));
    });

    return ( 
        <div>
          <ul>
            {this.entries}
          </ul>
          <Button onClick={this.addToLocal}>New Plot</Button>
        </div>
    );
  }
}