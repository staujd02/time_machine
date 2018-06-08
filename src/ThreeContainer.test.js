import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ThreeContainer from './ThreeContainer';
jest.mock('./threejs/threeEntryPoint');

describe("The ThreeContainer", () =>{
    it("renders without crashing", () =>{
        const div = document.createElement('div');
        ReactDOM.render(<ThreeContainer/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});