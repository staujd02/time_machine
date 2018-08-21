import React, { Component } from 'react';
import SavedPlot from './SavedPlot';
import Button from 'react-bootstrap/lib/Button';
import LocalStorage from '../lib/LocalStorage';

export default class StorageList extends Component {

  constructor(param){
    super(param);
    this.entries = [];
    this.handleClick = this.handleClick.bind(this);
    this.addToLocal = this.addToLocal.bind(this);
    var parent = this;
    this.state = {dataContext: parent.props.dataContext};
    this.props.saves.forEach(s => {
      this.entries.push(this.createEntry(s));
    });
  }

  isActive(capsule){
    return this.state.dataContext.currentPlot().id === capsule.versions[capsule.versions.length - 1].plot.id ? "Save" : "Load";
  }

  createEntry(save){
      let plotEntry = <SavedPlot dataCapsule={save}/>;
      let button = <Button onClick={() => this.handleClick(save)}>{this.isActive(save)}</Button>;
      let container = <li key={this.entries.length}> {plotEntry} {button}</li>
      return container;
  }

  addToLocal(){
    let resp = prompt('Name of File');
    if(!!resp){
      let s = (new LocalStorage()).addNewToLocal(resp);
      this.entries.push(this.createEntry(s));
    }
  }

  handleClick(s) {
    if(this.isActive(s)){
      (new LocalStorage()).updateStorage(s.name, this.state.dataContext.currentPlot());
    }
    
    // Load the latest s plot here 
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