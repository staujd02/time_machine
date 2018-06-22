import React from 'react';
import ReactDOM from 'react-dom';
import ThreeContainer from '../components/ThreeContainer';
jest.mock('../lib/threejs/threeEntryPoint');

describe("The ThreeContainer", () =>{
    it("renders without crashing", () =>{
        const div = document.createElement('div');
        ReactDOM.render(<ThreeContainer/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});