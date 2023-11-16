import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

export default function Header({ user }) {
  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="bg-body-tertiary"
      style={{ padding: "1.4rem" }}
    >
      <Container>
        <Navbar.Brand href="/" style={{ fontSize: "1.4rem" }}>
          WEB MANAGEMENT SYSTEM v1.0
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <span style={{ color: "white" }}>{user}</span>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
