import { Navbar, Nav, Container } from 'react-bootstrap';
import logo from '../logo.svg';

// for ref: https://react-bootstrap.github.io/components/navbar/
export default function NavigationBar() {
  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} className="app-logo" alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Admin</Nav.Link>
            <Nav.Link href="/tasks">Tasks</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
