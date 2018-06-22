import React, { Component } from 'react';
import threeEntryPoint from '../lib/threejs/threeEntryPoint';

/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
export default class ThreeContainer extends Component {

  constructor(props) {
    super(props);
    this.IController = this.props.IController;
  }

  componentDidMount() {
    threeEntryPoint(this.threeRootElement, this.IController);
  }

  render () {
      return (
        <div>
          <div ref={element => this.threeRootElement = element} />
        </div>
      );
  }
}