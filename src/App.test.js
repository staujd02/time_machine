import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import threeEntryPoint from './threejs/threeEntryPoint';
jest.mock('./threejs/threeEntryPoint');

describe("The visualizer", () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});