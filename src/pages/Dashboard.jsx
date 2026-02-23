import { Row, Col, Container } from "react-bootstrap";
import Header from "../components/Header";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Scanner } from "@yudiel/react-qr-scanner";
import defaulPic from "../assets/images/default.jpg";

import {
  faArrowCircleDown,
  faDoorClosed,
  faHome,
  faTh
} from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Dashboard() {
  const authToken = localStorage.getItem("token");
  const [scanMode, setScanMode] = useState("LASER"); // CAMERA | LASER
  const [machineInput, setMachineInput] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState("IN");

  const scanLock = useRef(false);
  const scanTimeout = useRef(null);
  const inputRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser] = useState({
    name: "Waiting for scan...",
    hostel: "-",
    room: "-",
    block: "-",
    image: defaulPic
  });

  // Autofocus Laser Mode
  useEffect(() => {
    if (scanMode === "LASER") {
      inputRef.current?.focus();
    }
  }, [scanMode]);

  // Main QR Processing
  const processQRCode = async (scannedValue) => {
    if (!scannedValue || scanLock.current) return;

    scanLock.current = true;
    setScanResult(scannedValue);
    setLoading(true);

    const rollNo = scannedValue.split("~")[0];

    try {
      const response = await axios.post(
        `${API_BASE}markLog`,
        {
          rollNo,
          direction,
          qrcode: scannedValue,
          // searchBy: rollNo cnicNo
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("API RESPONSE:", response.data);

      if (response.data) {
        // Base64 extraction from raw string (old method, not used now)
        // let rawImage = response.data.data.image;
        // let base64Image = "";

        // if (rawImage) {
        //   rawImage = rawImage.toString();

        //   const firstQuote = rawImage.indexOf("'");
        //   const lastQuote = rawImage.lastIndexOf("'");

        //   if (firstQuote !== -1 && lastQuote !== -1) {
        //     base64Image = rawImage.substring(firstQuote + 1, lastQuote);
        //   }
        // }

        // console.log("BASE64 LENGTH:", base64Image.length);

        const byteArray = new Uint8Array(response.data.data.image.buffer.data);

        // Convert to base64
        let binary = '';
        byteArray.forEach(byte => binary += String.fromCharCode(byte));
        const base64String = btoa(binary);

        setUser({
          name: response.data.data.firstName,
          hostel: response.data.data.hostelName,
          room: response.data.data.roomNo,
          block: response.data.data.blockName,
          image: `data:image/jpeg;base64,${base64String}`
        });
      }
    } catch (error) {
      console.log("API ERROR:", error.response || error);
    } finally {
      setLoading(false);

      // Unlock after 3 seconds
      setTimeout(() => {
        scanLock.current = false;
      }, 3000);
    }
  };

  // Camera Scan Handler
  const handleCameraScan = (result) => {
    if (!result || result.length === 0) return;

    const scannedValue = result[0]?.rawValue;
    if (scannedValue) {
      processQRCode(scannedValue);
    }
  };

  // AUTO Laser Scan
  const handleLaserChange = (e) => {
    const value = e.target.value;
    setMachineInput(value);

    if (scanTimeout.current) {
      clearTimeout(scanTimeout.current);
    }

    // Trigger API when typing stops (scanner finished sending data)
    scanTimeout.current = setTimeout(() => {
      if (value.trim().length > 5) {
        processQRCode(value.trim());
        setMachineInput("");
      }
    }, 120); // 120ms works best for most scanners
  };

  return (
    <Container fluid className="min-vh-100 d-flex flex-column p-0">
      <Header />

      <Container fluid className="flex-grow-1 bg-white d-flex align-items-center">
        <Row className="border border-2 rounded-5 w-100 mx-3 p-4 shadow-sm">

          {/* LEFT SIDE */}
          <Col lg={5} className="d-flex flex-column align-items-center">

            <div className="fw-bold bg-primary text-white p-3 rounded-pill w-100 text-center mb-4">
              Scan QR Code
              <FontAwesomeIcon icon={faArrowCircleDown} className="ms-2" />
            </div>

            {/* Direction Toggle */}
            <div className="mb-3">
              <button
                className={`btn me-2 ${
                  direction === "IN" ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => setDirection("IN")}
              >
                IN
              </button>

              <button
                className={`btn ${
                  direction === "OUT" ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => setDirection("OUT")}
              >
                OUT
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="mb-4">
              <button
                className={`btn me-2 ${
                  scanMode === "LASER" ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={() => setScanMode("LASER")}
              >
                Laser Mode
              </button>

              <button
                className={`btn me-2 ${
                  scanMode === "CAMERA" ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={() => setScanMode("CAMERA")}
              >
                Camera Mode
              </button>

              <button
                className={`btn ${
                  scanMode === "ROLL_NO" ? "btn-dark" : "btn-outline-dark"
                }`}
                onClick={() => setScanMode("ROLL_NO")}
              >
                Roll No
              </button>

            </div>

            {/* CAMERA MODE */}
            {scanMode === "CAMERA" && (
              <div className="card p-3 shadow-lg bg-dark rounded-4">
                <div style={{ width: "260px" }}>
                  <Scanner
                    onScan={handleCameraScan}
                    onError={(err) => console.log("SCAN ERROR:", err)}
                  />
                </div>
              </div>
            )}

            {/* LASER MODE */}
            {scanMode === "LASER" && (
              <div className="card p-4 shadow-lg rounded-4">
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control form-control-lg text-center"
                  placeholder="Cursor here"
                  value={machineInput}
                  onChange={handleLaserChange}
                />
              </div>
            )}

            {/* {scanResult && (
              <div className="mt-3 text-center">
                <small className="text-muted">Scanned:</small>
                <div>{scanResult}</div>
              </div>
            )} */}

            {loading && (
              <div className="mt-2 text-primary fw-bold">
                Marking log...
              </div>
            )}
          </Col>

          {/* RIGHT SIDE */}
          <Col lg={7} className="d-flex align-items-center">
            <div className="d-flex align-items-center gap-4 w-100">

              <img
                // src={!scanLock ? `data:image/jpeg;base64,${user.image}` : user.image}
                src={user.image}
                alt="User"
                className="img-thumbnail"
                style={{ width: "220px" }}
              />

              <div>
                <h3 className="fw-bold">{user.name}</h3>

                <p className="fs-4">
                  <FontAwesomeIcon icon={faHome} className="me-2 text-primary" />
                  Hostel: {user.hostel}
                </p>

                <p className="fs-4">
                  <FontAwesomeIcon icon={faDoorClosed} className="me-2 text-primary" />
                  Room: {user.room}
                </p>

                <p className="fs-4">
                  <FontAwesomeIcon icon={faTh} className="me-2 text-primary" />
                  Block: {user.block}
                </p>
              </div>

            </div>
          </Col>

        </Row>
      </Container>

      <small className="ps-3 pb-2 text-primary">
        © 2025 Developed by: Information Technology Services Centre,
        University of Sindh
      </small>
    </Container>
  );
}