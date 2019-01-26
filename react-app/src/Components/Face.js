import React, {Component} from 'react';
import profile from '../Profile';

export default class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: null,
        };
    }

    async componentDidMount() {
        const { match: { params } } = this.props;
        const response = await fetch(`/api/getfaces/${params.faceID}`,{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: profile.state.email, password: profile.state.password}),
        });

        const body = JSON.parse(await response.text());
        console.log('response:');
        console.log(body);
        
        this.setState({pictures: body.pictures});
    }

    render() {
        return(
        <div>
        { !this.state.pictures && <p>Loading...</p> }
        { this.state.pictures && <div className="container">
            <div className="row">
            <div className="jumbotron col-12">
                <h1 className="display-3">{}</h1>
                <p className="lead">{}</p>
                <hr className="my-4" />
                <p>Pictures</p>
                {
                this.state.pictures.map((answer) => (
                    <img src={answer} style={{width:'50%'}}/>
                ))
                }
            </div>
            </div>
        </div>}
        </div>
        );
    }
}