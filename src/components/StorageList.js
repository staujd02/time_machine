import React, { Component } from 'react';
import SavedPlot from './SavedPlot';

export default class StorageList extends Component {

  constructor(param){
    super(param);
    this.entries = [];
    this.state = {current: this.props.currentContext};
    this.props.plots.forEach(p => {
      this.entries.push(<SavedPlot active={this.state.current} key={this.entries.length} dataCapsule={p}/>);
    });
  }

  render() {
    return ( 
        <div>
          <ul>
            {this.entries}
          </ul>
        </div>
    );
  }
}