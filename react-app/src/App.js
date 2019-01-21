import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import NavBar from './Components/NavBar';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Account from './Components/Account';
import AddFace from './Components/AddFace';
import Face from './Components/Face';
import profile from './Profile';

class App extends Component {

  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path='/' component={Login}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/signup' component={Signup}/>
        <Route exact path='/account' component={Account}/>
        <Route exact path='/addnewface' component={AddFace}/>
        <Route exact path='/faces/:faceID' component={Face}/>
      </div>
    );
  }
}

export default App;