import Login from "./Login";
import { useHostel } from "../context/HostelContext";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Student from "./Student";
import StudentLog from "./StudentLog";
import AppLayout from "../components/AppLayout";

import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// detect electron
const isElectron = navigator.userAgent.toLowerCase().includes("electron");

// choose router
const Router = isElectron ? HashRouter : BrowserRouter;

export default function Home() {
  const { isLoggedIn } = useHostel();

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<h1>404 - Page Not Found</h1>} />

        <Route
          path="/"
          element={
            isLoggedIn ? (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/abc/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register />}
        />

        <Route
          path="/students"
          element={
            <AppLayout>
              <Student />
            </AppLayout>
          }
        />

        <Route
          path="/student_log"
          element={
            <AppLayout>
              <StudentLog />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}