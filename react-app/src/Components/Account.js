//Home page for user account

import React, { Component } from "react";

import "./Login.css";
import profile from "../Profile";

export default class Login extends Component {
    render() {
        return (
        <p>{profile.getName()}</p>
        );
    }
}