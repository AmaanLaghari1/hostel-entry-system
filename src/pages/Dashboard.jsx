import { Row, Col, Container, Button } from "react-bootstrap";
import Header from "../components/Header";
import qrCodeImg from "../assets/images/qr_code_img.png";

// FontAwesome
import {
  faArrowCircleDown,
  faDoorClosed,
  faHome,
  faTh
} from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Login from "./Login";
import { useHostel } from "../context/HostelContext";
import Register from "./Register";
import { useState } from "react";

export default function Dashboard() {
  const { isLoggedIn } = useHostel()
  const [authSwitch, setAuthSwitch] = useState('login')
  if (isLoggedIn) {
    return (
      <Container
        fluid
        className="min-vh-100 d-flex flex-column p-0"
      >
        <Header />
  
        {/* MAIN CONTENT */}
        <Container fluid className="flex-grow-1 bg-white d-flex align-items-center">
          <Row className="border border-2 border-light rounded-5 w-100 mx-2 mx-lg-5 p-3 p-lg-4 shadow-sm g-3">
  
            {/* LEFT SIDE — QR */}
            <Col
              xs={12}
              lg={5}
              className="h-100 bg-light bg-opacity-10 d-flex flex-column align-items-center justify-content-center shadow-sm rounded-5 p-3"
            >
              <div className="mb-4 text-center w-100">
                <div className="fw-bolder d-flex justify-content-between align-items-center bg-primary border border-2 border-light p-3 text-white rounded-pill shadow-sm fs-5 fs-md-4 fs-lg-3 px-4 px-lg-5">
                  Scan QR Code
                  <FontAwesomeIcon icon={faArrowCircleDown} />
                </div>
              </div>
  
              <div className="d-flex flex-wrap justify-content-center gap-3 p-3 shadow-sm rounded-5">
  
                {/* QR IMAGE */}
                <div className="card border-2 rounded-5 p-3 shadow-lg bg-black">
                  <img
                    src={qrCodeImg}
                    alt="QR Code"
                    className="img-fluid h-100 rounded-5"
                    style={{ maxWidth: "10rem" }}
                  />
                </div>
  
                {/* TEXT AREA */}
                <div className="card border border-5 border-dark rounded-5 p-3 shadow-lg">
                  <textarea
                    className="w-100 border-0 fs-6 fs-md-5"
                    style={{ outline: 0, maxWidth: "10rem", height: "10rem" }}
                  />
                </div>
              </div>
            </Col>
  
            {/* RIGHT SIDE — USER INFO */}
            <Col
              xs={12}
              lg={7}
              className="h-100 bg-light bg-opacity-10 d-flex flex-column justify-content-center shadow-sm rounded-5 p-3"
            >
              <div className="d-flex flex-column flex-md-row align-items-center gap-3 p-3 shadow-sm rounded-5">
  
                {/* PROFILE IMAGE */}
                <img
                  src="https://images.ctfassets.net/xjcz23wx147q/iegram9XLv7h3GemB5vUR/0345811de2da23fafc79bd00b8e5f1c6/Max_Rehkopf_200x200.jpeg"
                  alt="User"
                  className="img-thumbnail img-fluid"
                  style={{ maxWidth: "220px" }}
                />
  
                {/* USER DETAILS */}
                <div className="text-center text-md-start">
                  <h3 className="fw-bolder fs-1 fs-md-2 fs-lg-1">
                    Jon Doe
                  </h3>
  
                  <p className="mb-1 fs-6 fs-md-5 fs-lg-4">
                    <FontAwesomeIcon className="text-primary me-2" icon={faHome} />
                    Hostel: 101
                  </p>
  
                  <p className="mb-1 fs-6 fs-md-5 fs-lg-4">
                    <FontAwesomeIcon className="text-primary me-2" icon={faDoorClosed} />
                    Room No: 11
                  </p>
  
                  <p className="mb-1 fs-6 fs-md-5 fs-lg-4">
                    <FontAwesomeIcon className="text-primary me-2" icon={faTh} />
                    Block No: 01
                  </p>
                </div>
              </div>
            </Col>
  
          </Row>
        </Container>
  
        {/* FOOTER */}
        <small className="ps-3 ps-lg-5 pb-2 text-primary">
          © 2025 Developed by: Information Technology Services Centre, University of Sindh
        </small>
      </Container>
    );
  }
  else {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-0">
        {
          authSwitch === 'login' ? (
            <div className="p-4 shadow shadow-lg border-0 rounded-0 col-12 col-sm-4 text-start">
              <Login />
              <span className="me-1 small">Don't have an account?</span>
              <Button variant="link" size="sm" onClick={() => setAuthSwitch('register')}>Register</Button>
            </div>
          ) : (
            <div className="p-4 shadow shadow-lg border-0 rounded-0 col-12 col-sm-4 text-start">
              <Register />
              <span className="me-1 small">Already have an account?</span>
              <Button variant="link" size="sm" onClick={() => setAuthSwitch('login')}>Login</Button>
            </div>
          )
        }
      </div>
    )
    
  }
}
