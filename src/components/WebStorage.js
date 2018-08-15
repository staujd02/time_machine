import React, { Component } from 'react';
import SavedPlot from './SavedPlot';

const WEB_STORAGE_KEY = "plots";

export default class WebStorage extends Component {

  constructor(param){
    super(param);
    this.containers = JSON.parse(window.localStorage.getItem(WEB_STORAGE_KEY));
    if(!this.containers){
      window.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify([]));
      this.containers = [];
    }
    this.bits = [];
    this.containers.forEach(item => {
      this.bits.push(<SavedPlot key={this.bits.length} dataCapsule={item}/>);
    });
    if(this.bits.length === 0)
      this.bits.push(<li key={0}>Nothing in Storage</li>);
  }

  render() {
    return ( 
        <div>
          <ul>
            {this.bits}
          </ul>
        </div>
    );
  }
}