import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import NavBar from './Components/NavBar';
import Login from './Components/Login';
import Signup from './Components/Signup';

class App extends Component {
  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path='/' component={Login}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/signup' component={Signup}/>
      </div>
    );
  }
}

export default App;