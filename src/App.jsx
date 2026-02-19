import { HostelProvider, useHostel } from "./context/HostelContext";
import './assets/css/style.css'
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <HostelProvider>
      <Dashboard />
    </HostelProvider>
  );
}

export default App;
