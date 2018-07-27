import React, {
  Component
} from 'react';
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

  render() {
    var divStyle = {
      borderStyle: 'solid',
      borderWidth: '3px',
      borderColor: 'gray'
    };

    return ( <div>
      <div style = {divStyle} ref={element => this.threeRootElement = element} /> </div>
    );
  }
}