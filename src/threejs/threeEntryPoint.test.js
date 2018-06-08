import React from 'react';
import jest from 'jest';
import ReactDOM from 'react-dom';
import threeEntryPoint from './threeEntryPoint';

describe("The threeEntryPoint", () => {
    it("can create a scene on an element", () => {
        let div = <div ref={element => this.rootOfDiv = element} />;
        parent.componentDidMount = () => {
            threeEntryPoint(this.rootOfDiv.current);
        }
    });

    it("has a canvas", () =>{
        let div = <div ref={element => this.rootOfDiv = element} />;
        parent.componentDidMount = () => {
            expect(threeEntryPoint(this.rootOfDiv.current).canvas).toBeDefined();
        }
    });
});