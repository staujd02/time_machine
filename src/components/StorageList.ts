import React, { Component } from 'react';
import SavedPlot from './SavedPlot';
import Button from 'react-bootstrap/lib/Button';
import LocalStorage from '../lib/LocalStorage';
import { toast } from 'react-toastify';

export default class StorageList extends Component {

  constructor(param){
    super(param);
    const parent = this;
    this.entries = [];
    this.handleClick = this.handleClick.bind(this);
    this.addToLocal = this.addToLocal.bind(this);
    this.removeFromLocal = this.removeFromLocal.bind(this);
    this.loadSaves = this.loadSaves.bind(this);
    this.createButtonEntry = this.createButtonEntry.bind(this);
    this.createEntryName = this.createEntryName.bind(this);
    this.createGrid = this.createGrid.bind(this);
    this.activeModelName = this.activeModelName.bind(this);
    this.state = {dataContext: parent.props.dataContext};
    this.loadSaves();
  }

  isActive(capsule){
    return this.state.dataContext.currentPlot().id === capsule.versions[capsule.versions.length - 1].plot.id;
  }

  applyName(capsule){
    return this.isActive(capsule) ? "Save" : "Load";
  }

  createButtonEntry(save){
      return <Button key={this.entries.length} className="grid-item" onClick={() => this.handleClick(save)}>{this.applyName(save)}</Button>;
  }

  createEntryName(save){
      return <SavedPlot key={this.entries.length} className="grid-item" dataCapsule={save}/>;
  }

  activeModelName(){
    let model = "";
    if(this.state.models){
    this.state.models.forEach(s => {
      if(this.isActive(s)){
          model = s.name;
      }
    });
    }
    return " " + model;
  }

  async addToLocal(){
    let resp = this.solictStorageName('you would like to add.');
    if(!!resp){
      await (new LocalStorage()).addNewModelToLocal(resp);
      await this.loadSaves();
      this.forceUpdate();
    }
  }
  
  async removeFromLocal(){
    let resp = this.solictStorageName('you would like to permanently delete.');
    if(!!resp){
      await (new LocalStorage()).removeFromStorage(resp);
      await this.loadSaves();
      this.forceUpdate();
      toast.success("Model Removed");
    }
  }

  solictStorageName(extension) {
    return window.prompt('Please enter the name of Model ' + extension);
  }

  async handleClick(s) {
    if(this.isActive(s)){
      let plot = this.state.dataContext.currentPlot();
      await (new LocalStorage()).updateStorage(s.name, plot);
      toast.success("Model Saved");
    } else {
      await this.loadSaves();
      this.state.dataContext.currentPlot(s);
      this.forceUpdate();
    }
  }

  async loadSaves(){
    this.entries = [];
    let models = await (new LocalStorage()).loadFromStorage(this.ThreeController);
    let dataContext = this.state.dataContext;
    this.setState({
        dataContext: dataContext,
        models: models
    });
  }

  createGrid(){
    if(this.state.models){
      this.entries = [];
      this.state.models.forEach(s => {
        this.entries.push(this.createEntryName(s));
        this.entries.push(this.createButtonEntry(s));
      });
    }
  }

  render() {

    this.createGrid();

    return ( 
        <div>
          <h4 className="model-list-banner">Models</h4>
          <h5 className="active-banner"><span>Loaded Model: </span>{this.activeModelName()}</h5>
          <div className="grid-container">
            {this.entries}
          </div>
          <div className="grid-container">
            <Button id="new-plot" onClick={this.addToLocal}>New Model</Button>
            <Button id="delete-plot" onClick={this.removeFromLocal}>Delete Model</Button>
          </div>
        </div>
    );
  }
}