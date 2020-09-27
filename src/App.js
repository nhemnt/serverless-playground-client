import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Auth } from "aws-amplify";

import { AppContext } from "./libs/contextLib";

import Routes from "./Routes";

import './App.css';



function App() {
  const history = useHistory();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push("/login");
  }

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch (e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    setIsAuthenticating(false);
  }

  useEffect(() => {
    onLoad();
  }, []);
  return (
    !isAuthenticating &&
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
            ?
            <>
              <Nav.Link>
                <Link to="/settings">Settings</Link>
              </Nav.Link>
              <Nav onClick={handleLogout}>Logout</Nav>
            </>

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
