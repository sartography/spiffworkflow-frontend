import { Navbar, Nav, Container } from 'react-bootstrap';
import { capitalizeFirstLetter } from '../helpers';
import logo from '../logo.svg';

// for ref: https://react-bootstrap.github.io/components/navbar/
export default function NavigationBar() {
  const navItems = ['/admin', '/tasks'];

  const navElements = navItems.map((navItem) => {
    let className = '';
    if (window.location.pathname.startsWith(navItem)) {
      className = 'active';
    }
    const title = capitalizeFirstLetter(navItem.replace(/\/*/, ''));
    return (
      <Nav.Link href={navItem} className={className}>
        {title}
      </Nav.Link>
    );
  });

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Container>
        <Navbar.Brand href="/admin">
          <img src={logo} className="app-logo" alt="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">{navElements}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
