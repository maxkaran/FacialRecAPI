import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel, Checkbox } from "react-bootstrap";
import Webcam from "react-webcam";
import "./Login.css";
import profile from '../Profile';

export default class AddFace extends Component {
    constructor(props) {
        super(props);

        this.state = {
        fname: "",
        lname: "",
        fullaccess: false,
        files: null,
        base64Images: [],
        };
    }

    validateForm() {
        return this.state.fname.length > 0 && this.state.lname.length > 0;
    }

    handleChange = event => {
        this.setState({ [event.target.id]: event.target.value });
    }

    addFiles = event => {
        this.setState({ files: event.target.files });
        console.log(event.target.files);
    }

    handleCheckboxChange = event => {
        this.setState({fullaccess: event.target.checked});
    }

    handleSubmit = async event => {
        event.preventDefault();

        const data = new FormData();
        data.append('email', profile.state.email);
        data.append('password', profile.state.password);
        data.append('firstname', this.state.fname);
        data.append('lastname', this.state.lname);
        data.append('fullaccess', this.state.fullaccess);
        
        for (let i = 0; i < this.state.files.length; i += 1) {
            data.append('file', this.state.files[i]);
        }

        console.log(data);

        const response = await fetch('/api/createface', { //call API to create user
            method: 'POST',
            body: data
        });

        const bodyJSON = JSON.parse(await response.text());

        if(bodyJSON.error != null){
            alert(bodyJSON.error);
            console.log(bodyJSON.error)
        }

        this.props.history.push('/account');
    }

    setRef = Webcam => {
        this.Webcam = Webcam;
    };
    
    capture = () => {
        const imageSrc = this.Webcam.getScreenshot();
        this.state.base64Images.push(imageSrc); //add taken picture
        this.setState({base64Images: this.state.base64Images});
        console.log("Image Saved");
    };

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
            <FormGroup>
                <ControlLabel>Upload pictures of the face</ControlLabel>
                <input
                type="file"
                name="selectedFiles"
                multiple="multiple"
                accept="image/*" //accept only images
                onChange={this.addFiles}
                />
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
            <div style={
                {display: 'block',
                'margin-left':'30%'}
            }>
                <Webcam
                    audio = {false}
                    ref={this.setRef}
                />
                <br></br>
                <button onClick={this.capture}>Capture photo</button>
            </div>
            <div style={
                {display: 'block',
                'margin-left':'30%'}
            }>
            {
                this.state.base64Images.map(base64 =>(
                    <img src={`${base64}`}/>
                ))
            }
            </div>
        </div>
        );
    }
}