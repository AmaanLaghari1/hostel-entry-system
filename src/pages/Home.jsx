import Login from "./Login";
import { useHostel } from "../context/HostelContext";
import Register from "./Register";
// import { useState } from "react";
import Dashboard from "./Dashboard";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Student from "./Student";
import StudentLog from "./StudentLog";
import AppLayout from "../components/AppLayout";

export default function Home() {
  const { isLoggedIn } = useHostel()
  // const [authSwitch, setAuthSwitch] = useState('login')
    return (
      <Router>
        <Routes>
          <Route path="/*" Component={() => <><h1>404 - Page Not Found</h1></> } />
          <Route path="/abc/register" element={isLoggedIn ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={isLoggedIn ? <AppLayout><Dashboard /></AppLayout> : <Login />} />
          {/* <Route path="/" element={<AppLayout><WebcamCapture /></AppLayout>} /> */}
          <Route path="/students" element={<AppLayout><Student /></AppLayout>} />
          <Route path="/student_log" element={<AppLayout><StudentLog /></AppLayout>} />
        </Routes>
        
      </Router>
    );
}
