import React, {
  Component
} from 'react';
import threeEntryPoint from '../lib/threejs/threeEntryPoint';

/* Imported From: https://itnext.io/how-to-use-plain-three-js-in-your-react-apps-417a79d926e0 */
export default class ThreeContainer extends Component {

  constructor(props) {
    super(props);
    this.IController = this.props.IController;
    this.dataContext = this.props.dataContext;
  }

  componentDidMount() {
    threeEntryPoint(this.threeRootElement, this.dataContext, this.IController);
  }

  render() {
    var threeStyle = {
      width: '100%',
      height: '100%',
      borderStyle: 'solid',
      borderWidth: '3px',
      borderColor: 'gray'
    };

    return ( <div title={"THREE"} style={threeStyle} ref={element => this.threeRootElement = element} > </div>);
  }
}