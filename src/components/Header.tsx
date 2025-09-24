'use client';

import { Container, Nav, Navbar } from 'react-bootstrap';
import Link from 'next/link';

export default function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>Economises</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Link href="/" passHref>
              <Nav.Link as="span">Home</Nav.Link>
            </Link>
            <Link href="/admin" passHref>
              <Nav.Link as="span">Admin</Nav.Link>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
