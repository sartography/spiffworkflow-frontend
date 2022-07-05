import { Navbar, Nav, Container } from 'react-bootstrap';
import { capitalizeFirstLetter } from '../helpers';
// @ts-expect-error TS(2307): Cannot find module '../logo.svg' or its correspond... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
      <Nav.Link href={navItem} className={className}>
        {title}
      </Nav.Link>
    );
  });

  return (
    // @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message
    <Navbar bg="dark" expand="lg" variant="dark">
      {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
      <Container>
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Navbar.Brand href="/admin">
          {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
          <img src={logo} className="app-logo" alt="logo" />
        </Navbar.Brand>
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
        <Navbar.Collapse id="basic-navbar-nav">
          {/* @ts-expect-error TS(2686): 'React' refers to a UMD global, but the current fi... Remove this comment to see the full error message */}
          <Nav className="me-auto">{navElements}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
