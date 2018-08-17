import React, { Component } from 'react';
import SavedPlot from './SavedPlot';
import Button from 'react-bootstrap/lib/Button';
import LocalStorage from '../lib/LocalStorage';

export default class StorageList extends Component {

  constructor(param){
    super(param);
    this.entries = [];
    var parent = this;
    this.state = {dataContext: parent.props.dataContext};
    this.props.plots.forEach(p => {
      let Component = <SavedPlot key={this.entries.length} dataContext={parent.state.dataContext} dataCapsule={p}/>;
      this.entries.push(Component);
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
          <Button onClick={this.addToLocal}>New Plot</Button>
        </div>
    );
  }
}