
import React, { Component } from "react";
import { Container } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer px-0 px-lg-3">
        <Container fluid>
          <nav className="footer-menu">
          
            <p className="copyright text-center">
              © {new Date().getFullYear()}{" "}
            CLARIAN TECH 
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;
