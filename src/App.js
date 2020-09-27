import React from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import Routes from "./Routes";
import './App.css';

function App() {
  return (
    <div className="App container">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand><Link to="/">Notes</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link >
              <Link to="/">Home</Link>
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link>
              <Link to="/signup">signup</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/login">login</Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Routes />
    </div>
  );
}

export default App;
