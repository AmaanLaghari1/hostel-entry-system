import { HostelProvider } from "./context/HostelContext";
import './assets/css/style.css'
import Home from "./pages/Home";

function App() {
  return (
    <HostelProvider>
      <Home />
    </HostelProvider>
  );
}

export default App;
