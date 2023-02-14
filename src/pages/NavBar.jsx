import React from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import libraBanner from "@/assets/libra_banner_icon.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
export default function NavBar () {
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/login");
    });
  };
  const handleGoHome = () => {
    navigate("/books");
  };
  const navigate = useNavigate();
  return (
    <Navbar className="bg-gray-300" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand onClick={handleGoHome} href="#" className="ms-3"><img
              src={libraBanner}
              width="70"
              height="60"
              className="d-inline-block align-top libra-logo"
              alt="Libra ILS logo"
            /></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
          </Nav>
          <Form className="d-flex">
            <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
