import React, { Component } from 'react';
import NavBar from './NavBar';
import Login from './Login';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <Login/>
      </div>
    );
  }
}

export default App;