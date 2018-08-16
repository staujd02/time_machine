import React, { Component } from 'react';
import SavedPlot from './SavedPlot';
import Button from 'react-bootstrap/lib/Button';
import LocalStorage from '../lib/LocalStorage';

export default class StorageList extends Component {

  constructor(param){
    super(param);
    this.entries = [];
    this.state = {current: this.props.currentPlot};
    this.props.plots.forEach(p => {
      this.entries.push(<SavedPlot active={this.state.current} key={this.entries.length} dataCapsule={p}/>);
    });
  }

  addToLocal(){
    let resp = prompt('Name of File');
    if(!!resp)
      (new LocalStorage()).addNewToLocal(resp);
  }

  render() {
    return ( 
        <div>
          <ul>
            {this.entries}
          </ul>
          <Button onClick={this.addToLocal}>Add</Button>
        </div>
    );
  }
}