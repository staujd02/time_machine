import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import threeEntryPoint from '../lib/threejs/threeEntryPoint';
import Navigation from '../components/Navigation';
jest.mock('../lib/threejs/threeEntryPoint');
jest.mock('../components/Navigation');

describe("The visualizer", () => {

  let div;

  beforeEach(() => {
    Navigation.mockClear();
    threeEntryPoint.mockClear();
    div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it("has a navigation pane", () => {
    expect(Navigation).toHaveBeenCalledTimes(1);
  });

  it("has an three entry point", () =>{
    expect(threeEntryPoint).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
  });

});