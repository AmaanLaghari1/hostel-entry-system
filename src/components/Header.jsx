import { Navbar, Nav, Container, Button } from "react-bootstrap";
import icon from "../assets/images/right_logo.png";
import SyncStudents from "./SyncStudents";
import { Link } from "react-router";

const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Navbar bg="white" expand="lg" className="py-3 fixed-top">
      <Container fluid>
        {/* Logo + Title */}
        <Navbar.Brand className="d-flex align-items-center">
          <img src={icon} alt="logo" width={55} className="me-3" />
          <div>
            <div
              style={{ letterSpacing: "3px" }}
              className="fw-bolder fs-5 text-dark"
            >
              HOSTEL
            </div>
            <div
              style={{ letterSpacing: "2px", fontWeight: "500" }}
              className="text-muted"
            >
              Management System
            </div>
          </div>
        </Navbar.Brand>

        {/* Toggle for mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Nav Links */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">

            <Nav.Link as={Link} to="/dashboard" className="me-3">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/students">
              <Button className="rounded-0" variant="dark"
                    onClick={() => {}}
                >
                    <span className="text-white fw-bold">
                         Students
                    </span>
                </Button>
            </Nav.Link>

            
            <SyncStudents />

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;