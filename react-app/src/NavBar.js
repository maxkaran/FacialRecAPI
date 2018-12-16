import React from 'react';
import {Link} from 'react-router-dom';
import { Nav, NavItem } from "react-bootstrap";
import './NavBar.css'

function NavBar() {
return (
    <nav className="navbar navbar-dark bg-primary fixed-top">
        <Link className="navbar-brand" to="/">
            Welcome!
        </Link>
        
        <Nav pullRight>
            <NavItem class="NavItem" href="/signup">Signup</NavItem>
            <NavItem class="NavItem" href="/login">Login</NavItem>
        </Nav>
        
    </nav>
);
}

export default NavBar;