import React from 'react';
import {Link} from 'react-router-dom';
import { Nav, NavItem } from "react-bootstrap";
import profile from '../Profile';
import './NavBar.css'

function NavBar() {
    return (
        <nav className="navbar navbar-dark bg-primary fixed-top">
            <Link className="navbar-brand" to="/">
                Welcome!
            </Link>
            
            {
                //if user is not logged in
                !profile.loggedIn() &&
                <Nav pullRight>
                    <NavItem class="NavItem" href="/signup">Signup</NavItem>
                    <NavItem class="NavItem" href="/login">Login</NavItem>
                </Nav>        
            }
            {
                //if user is logged in
                profile.loggedIn() &&
                <div>
                    <label className="mr-2 text-white">{profile.getName()}</label>
                    <NavItem className="NavItem" href="/" onClick={() => {profile.signOut()}}>Sign Out</NavItem>
                </div>      
            }
            
            
        </nav>
    );
}

export default NavBar;