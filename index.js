import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

import 'semantic-ui-css/semantic.min.css';
import TaktTimer2 from './TaktTimer2'



class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }
  render () {
    return <TaktTimer2 />;
  }
}

render(<App />, document.getElementById('root'));
