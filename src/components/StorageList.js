import React, { Component } from 'react';
import SavedPlot from './SavedPlot';
import Button from 'react-bootstrap/lib/Button';
import LocalStorage from '../lib/LocalStorage';
import { toast } from 'react-toastify';

export default class StorageList extends Component {

  constructor(param){
    super(param);
    this.handleClick = this.handleClick.bind(this);
    this.addToLocal = this.addToLocal.bind(this);
    this.loadSaves = this.loadSaves.bind(this);
    var parent = this;
    this.state = {dataContext: parent.props.dataContext};
    this.entries = [];
    this.loadSaves();
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

  async addToLocal(){
    let resp = window.prompt('Name of Storage');
    if(!!resp){
      let s = await (new LocalStorage()).addNewToLocal(resp);
      this.entries.push(this.createEntry(s));
      this.forceUpdate();
    }
  }

  async handleClick(s) {
    if(this.isActive(s)){
      await (new LocalStorage()).updateStorage(s.name, this.state.dataContext.currentPlot());
      toast.success("Model Saved");
    } else {
      this.state.dataContext.currentPlot(s);
      this.forceUpdate();
    }
  }

  async loadSaves(){
    this.entries = [];
    let results = await (new LocalStorage()).loadFromStorage(this.ThreeController);
    results.forEach(s => {
      this.entries.push(this.createEntry(s));
    });
    this.forceUpdate();
  }

  render() {
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