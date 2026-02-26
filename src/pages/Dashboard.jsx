import { Row, Col, Container, Alert, Button } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Scanner } from "@yudiel/react-qr-scanner";
import defaultPic from "../assets/images/default.jpg";

import {
  faArrowCircleDown,
  faDoorClosed,
  faHome,
  faTh,
  faGraduationCap,
  faUser
} from "@fortawesome/fontawesome-free-solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertUTCToLocalTime } from "../helper";

export default function Dashboard() {
  const authToken = localStorage.getItem("token");
  const [scanMode, setScanMode] = useState("LASER"); // CAMERA | LASER
  const [machineInput, setMachineInput] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState("IN");
  const [error, setError] = useState(null);
  const [scanTime, setScanTime] = useState(null);

  const scanLock = useRef(false);
  const scanTimeout = useRef(null);
  const inputRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const userInitialData = {
    name: "Waiting for scan...",
    hostel: "-",
    room: "-",
    block: "-",
    image: defaultPic,
    programTitle: "-",
    rollNo: "-"
  }

  const [user, setUser] = useState(userInitialData);

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
    
    let payload = {
      direction,
      qrcode: scannedValue,
    }
    
    // if scanned value contains digits only, treat it as cnic
    if(/^\d+$/.test(scannedValue)) {
      // get last 11 digits for cnic
      const cnic = scannedValue.slice(-14);
      // extract last 1 digit from cnic

      payload = {
        searchBy: 'cnicNo',
        rollNo: cnic.slice(0, 13),
        direction,
        qrcode: scannedValue,
      }
    }
    else{
      const rollNo = scannedValue.split("~")[0];
      payload = {
        ...payload,
        searchBy: 'rollNo',
        rollNo: rollNo
      }
    }

    try {
      const response = await axios.post(
        `${API_BASE}markLog`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("API RESPONSE:", response.data);
      // console.log(response.data.scanTime)

      if (response?.data) {
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
          name: response.data.data.firstName +" "+ response.data.data.lastName,
          hostel: response.data.data.hostelName,
          room: response.data.data.roomNo,
          block: response.data.data.blockName,
          programTitle: response.data.data.programTitle,
          rollNo: response.data.data.rollNo,
          image: `data:image/jpeg;base64,${base64String}`
        });

        setScanTime(response.data.scanTime);
      }
    } catch (error) {
      // console.log('payload: ', payload)
      console.log("API ERROR:", error.response || error);
      setError(error.response.data.error[0].msg || error.response.data.error || "An error occurred while marking log.");
      setUser(userInitialData)
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

  const rollNoInputHandler = async (e) => {
    const value = e.target.value;
    console.log("Roll No: " + value);
    if (value.trim().length > 0) {
      try {
        const response = await axios.post(
          `${API_BASE}markLog`,
          {
            searchBy: 'rollNo',
            rollNo: value.trim(),
            direction,
            qrcode: value.trim()
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        console.log(response);

        const byteArray = new Uint8Array(response.data.data.image.buffer.data);

        // Convert to base64
        let binary = '';
        byteArray.forEach(byte => binary += String.fromCharCode(byte));
        const base64String = btoa(binary);

        setUser({
          name: response.data.data.firstName +" "+ response.data.data.lastName,
          hostel: response.data.data.hostelName,
          room: response.data.data.roomNo,
          block: response.data.data.blockName,
          programTitle: response.data.data.programTitle,
          rollNo: response.data.data.rollNo,
          image: `data:image/jpeg;base64,${base64String}`
        });

        setScanTime(response.data.scanTime);
      } catch (error) {
        console.log(error.response || error);
        setUser(userInitialData)
        setError(error.response.data.error[0].msg || error.response.data.error || "An error occurred while marking log.");
      }
    }
  }

  // error auto-clear after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Container fluid className="h-100">

      <Container fluid className="flex-grow-1 bg-white d-flex flex-column align-items-center justify-content-center">
        {
          scanTime && (
              <p className="text-end w-100 pe-3 text-muted fw-bold">
                Last Scan Time: {convertUTCToLocalTime(scanTime)}
              </p>
          )
        }
        <Row className="border border-2 rounded-5 w-100 mx-3 p-4 shadow-sm">
          {
            error && (
              <Alert variant="danger" className="text-center w-100 mb-4">
                {error}
              </Alert>
            )
          }

          {/* LEFT SIDE */}
          <Col lg={4} className="d-flex flex-column align-items-center">

            <div className="fw-bold bg-dark text-white p-3 rounded-pill w-100 text-center mb-4">
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
                <div style={{ width: "150px" }}>
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

            {
              scanMode === "ROLL_NO" && (
                <div className="card p-4 shadow-lg rounded-4">
                  <input
                    type="text"
                    className="form-control form-control-lg text-center"
                    placeholder="Enter Roll No"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        rollNoInputHandler(e)
                      }
                    }}
                  />
                </div>
              )
            }

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
          <Col lg={8} className="d-flex align-items-center">
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

                <p className="fs-4">
                  <FontAwesomeIcon icon={faGraduationCap} className="me-2 text-primary" />
                  Program: {user.programTitle || '-'}
                </p>

                <p className="fs-4">
                  <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                  Roll No: {user.rollNo || '-'}
                </p>
              </div>

            </div>
          </Col>

        </Row>
      </Container>

      
    </Container>
  );
}