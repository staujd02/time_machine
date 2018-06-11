import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import threeEntryPoint from '../threejs/threeEntryPoint';
import Navigation from '../Navigation';
jest.mock('../threejs/threeEntryPoint');
jest.mock('../Navigation');

describe("The visualizer", () => {

  let div;

  beforeEach(() => {
    Navigation.mockClear();
    div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it("has a navigation pane", () => {
    expect(Navigation).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
  });


});