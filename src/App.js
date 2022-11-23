import React, { Component } from 'react';
import './App.css';
import Calendar from "./composants/Calendar/Calendar";


class App extends Component {
  render() {
    console.warn = () => {};
    return (
      <div className="App">
        <Calendar />     
      </div>
    );
  }
}

export default App;
