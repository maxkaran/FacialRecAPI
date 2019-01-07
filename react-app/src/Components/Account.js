//Home page for user account
import React, { Component } from "react";
import {Link} from 'react-router-dom';

import "./Login.css";
import profile from "../Profile";

export default class Account extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            faces: null,
        };
    }
    
    async componentDidMount() {
        const faces = await fetch('/api/getfaces', { //call backend api for faces
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email : profile.state.email, password : profile.state.password})
        });

        const facesResponse = JSON.parse( await faces.text() );
        console.log(facesResponse);
        
        this.setState({faces : facesResponse});

        console.log(this.state);
    }
    
    render() {
    return (
        <div className="container">
        <div className="row">
            {!this.state.faces && <p>Loading Faces...</p>}
            {
            this.state.faces && this.state.faces.map(faces => (
                <div key={faces.fid} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/faces/${faces.fid}`}>
                    <div className="card text-white bg-success mb-3">
                    <div className="card-header">Answers: {faces.email}</div>
                    <div className="card-body">
                        <h4 className="card-title">{faces.fname}</h4>
                        <p className="card-text">{faces.lname}</p>
                    </div>
                    </div>
                </Link>
                </div>
            ))
            }
        </div>
        </div>
    )}
}