import React, { Component } from 'react';
import { render } from 'react-dom';
import {Progress, Button, Input, Dropdown} from 'semantic-ui-react';

let sizes = ["medium", "large", "big"];
let colors = ["brown",  "purple", "pink", "blue", "olive",  "teal", ];

export default class TaktTimer1 extends Component {
  constructor() {
    super();
    this.state = {
      bars: [
        {count: 0, cycle: 3, start: null, color: colors.pop()},
        {count: 0, cycle: 5, start: null, color: colors.pop()},
        {count: 0, cycle: 35, start: null, color: colors.pop()},
        {count: 0, cycle: 40, start: null, color: colors.pop()},
      ],
      elementSize: 'huge',
      sizeIndex: 0,
      stopped: true,
      paused: true,
      edit: null,
    };
  }
  initializeBars = () => {
    let bars = this.state.bars.map(v => {
      return {...v,
        start: Date.now(), count: 0
      }
    });
    console.log(bars);

    this.setState({...this.state, now: Date.now(), starttime: Date.now(), bars: bars});
  }
  start = (reset) => { 
    if(reset === true){
      this.initializeBars();
      //this.setState({starttime: Date.now()});
    }
    let f = () => {
      this.setState({stopped: false, paused: false, now: Date.now()});
    }
    f();
    window.interval = setInterval(f, 1000);
  }
  stop = () => {
    clearInterval(window.interval);
    this.setState({stopped: true});
  }
  pause = () => {
    // Pausing issuse
    /*
      Pause time must be managed because else counter keeps moving.
      Cycles should be calculated by floor((now - start time - pause time) / cycle)
    */
    clearInterval(window.interval);
    this.setState({paused: true, pauseStart: Date.now()});
  }
  reset = () => {
    this.initializeBars()
    //this.stop();
    //if(!this.state.paused)
    //  this.start(true);
  }
  changeSize = () => {
    let size = this.state.sizeIndex;
    size++;
    this.setState({sizeIndex: size});

  }
  getSize = () => {
    return sizes[this.state.sizeIndex % sizes.length];
  }
  changeBaseTime = (e) => { 
    this.setState({input: e.target.value});
  }
  saveChange = (e) => {
    let bars = this.state.bars;
    bars[e.target.name].cycle = this.state.input;

    this.setState({edit: false, input: null, bars});
  }
  changeTimer = (k) => {
    this.setState({edit: k, input: this.state.bars[k].cycle});
  }
  removeTimer = (e) => {
    let bars = this.state.bars;
    colors.push(bars[e.target.name].color);
    delete  bars[e.target.name];

    this.setState({edit: false, input: null, bars});
  }
  addTimer = () => {
    let bars = this.state.bars;

    bars.push({count: 0, cycle: 60, starttime: null, color: colors.pop()})
    
    this.setState({edit: false, input: null, bars});
  }
  render() {
    let starttimeString = new Date(this.state.starttime).getHours() + ":" + new Date(this.state.starttime).getMinutes() + ":" + new Date(this.state.starttime).getSeconds();
    starttimeString = (this.state.starttime) ? starttimeString : "no time yet";

    return (
      <div style={{padding: "10px"}}>
      <p style={{textAlign: "center"}}>
      <Button onClick={(this.state.paused) ? this.start : this.pause} size={this.state.elementSize} content={(this.state.paused) ? "Start" : "Pause"} />
      <Button onClick={this.reset} size={this.state.elementSize} content="Reset" />
      <Button onClick={this.changeSize} size={this.state.elementSize} content="Size" />
      <br />
      Start time: { starttimeString }
      </p>
      {this.state.bars.map((v, k) => {
        let value = (Date.now() - v.start) / 1000 | 0;
        let x = (this.state.stopped) ? 0 : value % v.cycle +1;

        if(x===v.cycle){
          v.count++;
        }
        let style = {width: '33%', display: 'inline-block'}
        let label = <div className="progressLabel"><span>{v.count}</span><span>{v.cycle + "sec"}</span><span>{x - v.cycle}/s</span></div>

        let element = <Progress onClick={() => this.changeTimer(k)} key={k} progress="value" color={v.color} label={label} value={x} total={v.cycle} size={this.getSize()} />;

        if (this.state.edit === k)
          element = <div style={{padding: "30px"}}><Input type="number" color={v.color} value={this.state.input} onChange={this.changeBaseTime} action={{content: "Save", name:k, color: v.color, onClick: this.saveChange}} /> <Button content="remove" name={k} onClick={this.removeTimer}/></div>

        return element;
      })}
      
      <Button onClick={this.addTimer} size={this.state.elementSize} content="+" />
      </div>
    );
  }
}import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

import 'semantic-ui-css/semantic.min.css';
import {Progress, Button, Input, Dropdown} from 'semantic-ui-react';

let sizes = ["medium", "large", "big"];
let colors = ["brown",  "purple", "pink", "blue", "olive",  "teal", ];

class App extends Component {
  constructor() {
    super();
    this.state = {
      bars: [
        {count: 0, cycle: 3, start: null, color: colors.pop()},
        {count: 0, cycle: 5, start: null, color: colors.pop()},
        {count: 0, cycle: 35, start: null, color: colors.pop()},
        {count: 0, cycle: 40, start: null, color: colors.pop()},
      ],
      elementSize: 'huge',
      sizeIndex: 0,
      stopped: true,
      paused: true,
      edit: null,
    };
  }
  initializeBars = () => {
    let bars = this.state.bars.map(v => {
      return {...v,
        start: Date.now(), count: 0
      }
    });
    console.log(bars);

    this.setState({...this.state, now: Date.now(), starttime: Date.now(), bars: bars});
  }
  start = (reset) => { 
    if(reset === true){
      this.initializeBars();
      //this.setState({starttime: Date.now()});
    }
    let f = () => {
      this.setState({stopped: false, paused: false, now: Date.now()});
    }
    f();
    window.interval = setInterval(f, 1000);
  }
  stop = () => {
    clearInterval(window.interval);
    this.setState({stopped: true});
  }
  pause = () => {
    // Pausing issuse
    /*
      Pause time must be managed because else counter keeps moving.
      Cycles should be calculated by floor((now - start time - pause time) / cycle)
    */
    clearInterval(window.interval);
    this.setState({paused: true, pauseStart: Date.now()});
  }
  reset = () => {
    this.initializeBars()
    //this.stop();
    //if(!this.state.paused)
    //  this.start(true);
  }
  changeSize = () => {
    let size = this.state.sizeIndex;
    size++;
    this.setState({sizeIndex: size});

  }
  getSize = () => {
    return sizes[this.state.sizeIndex % sizes.length];
  }
  changeBaseTime = (e) => { 
    this.setState({input: e.target.value});
  }
  saveChange = (e) => {
    let bars = this.state.bars;
    bars[e.target.name].cycle = this.state.input;

    this.setState({edit: false, input: null, bars});
  }
  changeTimer = (k) => {
    this.setState({edit: k, input: this.state.bars[k].cycle});
  }
  removeTimer = (e) => {
    let bars = this.state.bars;
    colors.push(bars[e.target.name].color);
    delete  bars[e.target.name];

    this.setState({edit: false, input: null, bars});
  }
  addTimer = () => {
    let bars = this.state.bars;

    bars.push({count: 0, cycle: 60, starttime: null, color: colors.pop()})
    
    this.setState({edit: false, input: null, bars});
  }
  render() {
    let starttimeString = new Date(this.state.starttime).getHours() + ":" + new Date(this.state.starttime).getMinutes() + ":" + new Date(this.state.starttime).getSeconds();
    starttimeString = (this.state.starttime) ? starttimeString : "no time yet";

    return (
      <div style={{padding: "10px"}}>
      <p style={{textAlign: "center"}}>
      <Button onClick={(this.state.paused) ? this.start : this.pause} size={this.state.elementSize} content={(this.state.paused) ? "Start" : "Pause"} />
      <Button onClick={this.reset} size={this.state.elementSize} content="Reset" />
      <Button onClick={this.changeSize} size={this.state.elementSize} content="Size" />
      <br />
      Start time: { starttimeString }
      </p>
      {this.state.bars.map((v, k) => {
        let value = (Date.now() - v.start) / 1000 | 0;
        let x = (this.state.stopped) ? 0 : value % v.cycle +1;

        if(x===v.cycle){
          v.count++;
        }
        let style = {width: '33%', display: 'inline-block'}
        let label = <div className="progressLabel"><span>{v.count}</span><span>{v.cycle + "sec"}</span><span>{x - v.cycle}/s</span></div>

        let element = <Progress onClick={() => this.changeTimer(k)} key={k} progress="value" color={v.color} label={label} value={x} total={v.cycle} size={this.getSize()} />;

        if (this.state.edit === k)
          element = <div style={{padding: "30px"}}><Input type="number" color={v.color} value={this.state.input} onChange={this.changeBaseTime} action={{content: "Save", name:k, color: v.color, onClick: this.saveChange}} /> <Button content="remove" name={k} onClick={this.removeTimer}/></div>

        return element;
      })}
      
      <Button onClick={this.addTimer} size={this.state.elementSize} content="+" />
      </div>
    );
  }
}