import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

import { AppContext } from "./libs/contextLib";

import Routes from "./Routes";

import './App.css';

function App() {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  function handleLogout() {
    userHasAuthenticated(false);
  }
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


          {isAuthenticated
            ? <Nav onClick={handleLogout}>Logout</Nav>
            : <>
              <Nav>
                <Nav.Link>
                  <Link to="/signup">signup</Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/login">login</Link>
                </Nav.Link>
              </Nav>
            </>
          }
        </Navbar.Collapse>
      </Navbar>
      <AppContext.Provider value={{
        isAuthenticated,
        userHasAuthenticated
      }}>
        <Routes />
      </AppContext.Provider>
    </div>
  );
}

export default App;
