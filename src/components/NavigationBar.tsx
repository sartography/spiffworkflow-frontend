import { Button, Navbar, Nav, Container } from 'react-bootstrap';
import { capitalizeFirstLetter } from '../helpers';
// @ts-expect-error TS(2307) FIXME: Cannot find module '../logo.svg' or its correspond... Remove this comment to see the full error message
import logo from '../logo.svg';
import UserService from '../services/UserService';

// for ref: https://react-bootstrap.github.io/components/navbar/
export default function NavigationBar() {
  const navItems: string[] = [];
  if (UserService.hasRole(['admin'])) {
    navItems.push('/admin');
  }
  navItems.push('/tasks');

  const navElements = navItems.map((navItem) => {
    let className = '';
    if (window.location.pathname.startsWith(navItem)) {
      className = 'active';
    }
    const navItemWithoutSlash = navItem.replace(/\/*/, '');
    const title = capitalizeFirstLetter(navItemWithoutSlash);
    return (
      <Nav.Link
        href={navItem}
        className={className}
        data-qa={`nav-item-${navItemWithoutSlash}`}
      >
        {title}
      </Nav.Link>
    );
  });

  const handleLogout = () => {
    UserService.doLogout();
  };

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
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <strong>{UserService.getUsername()}</strong>
          </Navbar.Text>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            <Button variant="link" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
