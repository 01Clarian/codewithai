
import React, { useState, useContext } from "react";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import CodeOptions from 'components/CodeOptions/CodeOptions.js'
import { ConsoleContext } from '../../context/consoleContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ChatContext } from '../../context/chatContext';

import { NavLink, Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'
import '../../assets/css/index.css';


function Header() {

  const { userInput, setUserInput, userOutput, setUserOutput, loading, setLoading} = useContext(ConsoleContext);
  const [, , clearMessages] = useContext(ChatContext)

  const [displayNameLocal, setDisplayNameLocal] = useLocalStorage('displayName', '');
  const [profileImageLocal, setProfileImageLocal] = useLocalStorage('profileImage', '');
  const [emailLocal, setEmailLocal] = useLocalStorage('profileImage', '');

  const [open, setOpen] = useState(true)

  const navigate = useNavigate();

  const SignOut = () => {
    if (auth.currentUser) {
      setDisplayNameLocal("")
      setProfileImageLocal("")
      setEmailLocal("")
      window.sessionStorage.clear()
      clearMessages()
      auth.signOut()
      //setLimit(-1)
  }
}

const handleHomeClick = (e) => {
  e.preventDefault() 
  //clearMessages()
  navigate('/')
}

  return (

    <Navbar className="" expand="lg">

      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Navbar.Brand >
           <Link style={{cursor:'pointer'}} onClick={handleHomeClick}  to="/"
           >CODE WITH AI</Link> 
          </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="mr-2">
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
          <span className="navbar-toggler-bar burger-lines"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="nav mr-auto" navbar>
            <Nav.Item>
              <Nav.Link
                data-toggle="dropdown"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                className="m-0"
              >
              </Nav.Link>
            </Nav.Item>
         <CodeOptions />
          </Nav>
          <Nav className="ml-auto" navbar>
              <span
                className="m-0 navlink2"
              
              >
                <NavLink  className="no-icon m-0 link-custom" 
                style={{color:'#a4f79f',
              
              }}
                to="/user">Account</NavLink>
              </span>
              <span
                className="m-0 navlink2"
              
              >
                <NavLink  className="no-icon m-0 link-custom" 
                style={{color:'#a4f79f',
              
              }}
              onClick={SignOut} to="/">Log Out</NavLink>
              </span>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
