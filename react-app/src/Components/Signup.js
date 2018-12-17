import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            firstname: "",
            lastname: "",
            password: "",
            passwordrepeated: "",
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0 && this.state.firstname.length > 0 && this.state.lastname.length > 0 &&
            this.state.password==this.state.passwordrepeated;
    }

    passwordsWarningActive(){ //activate warning if passwords are non empty and don't match
            if(this.state.password != "")
                return this.state.password==this.state.passwordrepeated;
            else
                return true;
    }

    handleChange = event => {
        this.setState({
        [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
    }

    render() {
        return (
        <div className="Login">
            <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="email" bsSize="large">
                <ControlLabel>Email</ControlLabel>
                <FormControl
                autoFocus
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
                />
            </FormGroup>
            <FormGroup controlId="firstname" bsSize="large">
                <ControlLabel>First Name</ControlLabel>
                <FormControl
                autoFocus
                type="text"
                value={this.state.firstname}
                onChange={this.handleChange}
                />
            </FormGroup>
            <FormGroup controlId="lastname" bsSize="large">
                <ControlLabel>Last Name</ControlLabel>
                <FormControl
                autoFocus
                type="text"
                value={this.state.lastname}
                onChange={this.handleChange}
                />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                value={this.state.password}
                onChange={this.handleChange}
                type="password"
                />
            </FormGroup>
            <FormGroup controlId="passwordrepeated" bsSize="large">
                <ControlLabel>Password Again</ControlLabel>
                <FormControl
                value={this.state.passwordrepeated}
                onChange={this.handleChange}
                type="password"
                />
            </FormGroup>
            <p class="PasswordWarning" hidden={this.passwordsWarningActive()}>Passwords Must Match!</p> 
            <Button
                block
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
            >
                Sign Up!
            </Button>
            </form>
        </div>
        );
    }
}