import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel, Checkbox } from "react-bootstrap";
import "./Login.css";
import profile from '../Profile';

export default class AddFace extends Component {
    constructor(props) {
        super(props);

        this.state = {
        fname: "",
        lname: "",
        fullaccess: false
        };
    }

    validateForm() {
        return this.state.fname.length > 0 && this.state.lname.length > 0;
    }

    handleChange = event => {
        this.setState({
        [event.target.id]: event.target.value
        });
    }

    handleCheckboxChange = event => {
        this.setState({fullaccess: event.target.checked});
    }

    handleSubmit = async event => {
        event.preventDefault();
        const response = await fetch('/api/createface', { //call API to create user
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({email : profile.state.email, password : profile.state.password, firstname : this.state.fname, lastname : this.state.lname, fullaccess: this.state.fullaccess}),
        });

        const bodyJSON = JSON.parse(await response.text());

        if(bodyJSON.error != null){
            alert('Failed to create a face');
            console.log(bodyJSON.error)
        }

        this.props.history.push('/account');
  }

    render() {
        return (
        <div className="Login">
            <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="fname" bsSize="large">
                <ControlLabel>First Name</ControlLabel>
                <FormControl
                autoFocus
                type="fname"
                value={this.state.fname}
                onChange={this.handleChange}
                />
            </FormGroup>
            <FormGroup controlId="lname" bsSize="large">
                <ControlLabel>Last Name</ControlLabel>
                <FormControl
                value={this.state.lname}
                onChange={this.handleChange}
                type="lane"
                />
            </FormGroup>
            <FormGroup>
                <Checkbox 
                    checked={this.state.fullaccess}
                    onChange={this.handleCheckboxChange}>
                    Give Full Access to Lock?
                </Checkbox>
            </FormGroup>
            <Button
                block
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
            >
                Create Face
            </Button>
            </form>
        </div>
        );
    }
}