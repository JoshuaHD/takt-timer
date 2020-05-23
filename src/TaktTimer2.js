import React, { Component } from "react";
import { render } from "react-dom";

import { Button, Input, Dropdown } from "semantic-ui-react";

import TimeDisplay from "./components/TimeDisplay";

const colorsFull = ["#8684a4", "#7f2ccb", "#80ced6", "#e899dc", "#8b1e3f", "#C2CAE8", "#db4c40", "#89bd9e", "#b96d40", "#fabc3c"];
let colors = [...colorsFull];
const formatTime = time => {
  if (!time) return false;

  const p = t => String(t).padStart(2, "0");

  let t = new Date(time);

  let timeString = "";

  timeString += p(t.getHours()) + ":";

  timeString += p(t.getMinutes()) + ":";

  timeString += p(t.getSeconds()) + ".";

  return timeString;
};
const ButtonBar = props => {
  const { handleStart, handleStop, handleReset, handlePause, state } = props;

  return (
    <div className="buttonBar">
      <Button onClick={handleStart} content="Start" disabled={!!state.start} />
      <Button
        onClick={handleStop}
        content="Stop"
        disabled={!state.start || !!state.end}
      />
      <Button
        onClick={handlePause}
        content="Pause"
        disabled={!state.start || !!state.end}
      />
      <Button onClick={handleReset} content="Reset" />
    </div>
  );
};

const Bar = props => {
  const { color, cycleTime, label, playState, reset, runtime } = props;
  playState = playState ? "paused" : "running";
  const rounds = Math.floor(runtime / cycleTime);
  const value = Math.round((runtime % cycleTime) / 1000);

  const animation = reset ? "none" : cycleTime + "ms fillbar infinite linear";

  const css = {
    backgroundColor: color,
    animation,
    WebkitAnimationPlayState: playState,
    textAlign: "right"
  };

  return (
    <div>
      <div className="progressName">{label}</div>
      <div className="progressBar">
        <div className={"cycleBar"} style={css}></div>
      </div>
      <div className="progressLabel">
        <span>{rounds}</span>
        <span>
          {value}/{cycleTime / 1000}s
        </span>
        <span>-{cycleTime / 1000 - value}s</span>
      </div>
    </div>
  );
};
class AddTimerForm extends Component {
  constructor (props) {
    super();
    console.log('props', props)

    this.state = {
      bg: props.color || colorsFull[1],
      duration: props.cycle / 1000 || "",
      key: props.k
    }
  }
  handleClick = () => {
    this.props.callback({color: this.state.bg, cycle: this.state.duration * 1000, k: this.state.key});
  }
  handleChange = (e, data) => {
    this.setState({[data.name]: data.value});
  }

  render () {
    const options = colorsFull;
    const {bg, duration, key} = this.state;

    return <div className="editBarForm">
    <Input type='number' name='duration' placeholder='Seconds' value={duration} onChange={this.handleChange} action>
      <input />
      <Dropdown selection compact placeholder='' icon='' style={{backgroundColor: bg, width: '5em',}}>
      <Dropdown.Menu>
        {options.map(v => <Dropdown.Item key={v} style={{backgroundColor: v}} name='bg' value={v} text='&nbsp;' onClick={this.handleChange} />)}
      </Dropdown.Menu>
      </Dropdown>
      <Button type='submit' disabled={(duration < 1)} onClick={this.handleClick}>{(key >= 0) ? "update" : "add"}</Button>
    </Input>
    </div>
  }
}
export default class C extends Component {
  constructor() {
    super();

    this.state = {
      start: null,
      end: null,
      pauses: [],
      playState: true,
      counters: [
        { color: colors.pop(), cycle: 3000 },
        { color: colors.pop(), cycle: 6000 },
        { color: colors.pop(), cycle: 12000, label: "Zwölf sekunden" },
        { color: colors.pop(), cycle: 18000 },
        { color: colors.pop(), cycle: 36000 },
      ],
      editMode: false,
    };

    clearInterval(window.interval);
  }
  startInterval = () => {
    window.interval = setInterval(
      () => this.setState({ now: Date.now() }),
      100
    );
  };
  stopInterval = () => {
    clearInterval(window.interval);
  };
  handleStart = () => {
    if (this.state.start) return;

    this.setState({
      start: Date.now(),
      end: null,
      pauses: [],
      playState: false
    });
    this.startInterval();
  };
  handleStop = () => {
    if (!this.state.start || this.state.end) return;
    this.setState({ end: Date.now(), playState: true, now: null });
    this.stopInterval();
  };
  handlePause = () => {
    let { pauses, start } = this.state;
    if (!start) {
      this.handleStart();
      return;
    }

    const pLength = pauses.length;
    if (pLength < 1) {
      this.handleStartPause();
      return;
    }

    let lastPause = pauses[pLength - 1];

    if (lastPause[1] === null) this.handleEndPause();
    else this.handleStartPause();
  };
  handleStartPause = () => {
    let { pauses } = this.state;

    pauses.push([Date.now(), null]);

    this.setState({ pauses, playState: true });
    this.stopInterval();
  };
  handleEndPause = () => {
    console.log("end pause");
    if (!this.state.now) {
      return;
    }
    let { pauses } = this.state;
    let lastPause = pauses.pop();
    lastPause[1] = Date.now();

    pauses.push(lastPause);

    this.setState({ pauses, playState: false });
    this.startInterval();
  };
  handleToggle = () => {};
  totalPauseLength = () => {
    let total = 0;

    let { pauses } = this.state;

    pauses.forEach(v => {
      let end = v[1] || Date.now();
      total += end - v[0];
    });

    return total;
  };
  totalRuntime = () => {
    const { start, end } = this.state;

    if (!start) return 0;

    return (end || Date.now()) - start;
  };
  totalNetRuntime = () => {
    return this.totalRuntime() - this.totalPauseLength();
  };
  handleReset = () => {
    const running = this.state.now;
    console.log("resest", running);

    this.stopInterval();
    this.setState({
      start: null,
      end: null,
      pauses: [],
      playState: true,
      now: null
    });

    if (running) {
      console.log("running", running);
      setTimeout(this.handleStart, 1000);
    }
  };
  handleEditForm = (formdata) => {
    let {counters} = this.state;
    //console.log(this.state, counters, formdata)
    if(formdata.k){
      counters[formdata.k] = {...counters[formdata.k], ...formdata}
      console.log('c', counters)
      this.setState({counters, editId: null});
    } else {
      this.setState({counters: [...this.state.counters, formdata], editId: null});
    }
  }
  toggleEditMode = () => {
    this.setState({editMode: !this.state.editMode});
  }
  componentDidUpdate = () => {
    //console.log(this.state, this.totalPauseLength(), this.totalRuntime(), this.totalNetRuntime());
  };
  render() {
    let netRuntime = this.totalNetRuntime();
    const { playState } = this.state;

    return (
      <div>
        <AddTimerForm callback={this.handleEditForm} /><Button content={"EditMode"} onClick={this.toggleEditMode} />
        <ButtonBar
          handleStart={this.handleStart}
          handleStop={this.handleStop}
          handleReset={this.handleReset}
          handlePause={this.handlePause}
          state={this.state}
        />
        <TimeDisplay time={netRuntime} className={(playState) ? 'paused' : ''} />
        {this.state.counters.map(({ color, cycle, label }, k) => (
          (!this.state.editMode) ? <Bar
            key={k}
            color={color}
            cycleTime={cycle}
            label={label}
            playState={this.state.playState}
            reset={!this.state.start && !this.state.end}
            runtime={netRuntime}
          /> : <AddTimerForm callback={this.handleEditForm} color={color} cycle={cycle} k={k}  />
        ))}
        <div className='statistics'>
        {this.state.start && <div>Start: {formatTime(this.state.start)}</div>}
        {this.state.pauses.map(([start, end], k) => {
          const startDate = new Date(start);

          if (!end)
            return <div key={k}>Break started at {formatTime(start)}</div>;
          return (
            <div key={k}>
              Break from {formatTime(start)} to {formatTime(end)} duration:{" "}
              {(end - start) / 1000}s
            </div>
          );
        })}
        {this.state.end && <div>End: {formatTime(this.state.end)}</div>}
        </div>
      </div>
    );
  }
}
