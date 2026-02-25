import { Button } from "react-bootstrap";
import Login from "./Login";
import { useHostel } from "../context/HostelContext";
import Register from "./Register";
import { useState } from "react";
import Dashboard from "./Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Student from "./Student";
import StudentLog from "./StudentLog";
import AppLayout from "../components/AppLayout";

export default function Home() {
  const { isLoggedIn } = useHostel()
  const [authSwitch, setAuthSwitch] = useState('login')
  if (isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/*" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/students" element={<AppLayout><Student /></AppLayout>} />
          <Route path="/student_log" element={<AppLayout><StudentLog /></AppLayout>} />
        </Routes>
        
      </Router>
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
