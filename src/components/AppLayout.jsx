import { useHostel } from "../context/HostelContext";
import Header from "./Header"

const AppLayout = ({children}) => {
  const {logout} = useHostel();
  return (
    <div className="min-vh-100 d-flex flex-column p-0 justify-content-center align-items-center">
        <Header />
        {children}
        <div className="d-flex flex-wrap justify-content-between">
          <small className="ps-3 pb-2 text-primary position-fixed bottom-0 start-0">
              © 2025 Developed by: Information Technology Services Centre,
              University of Sindh
          </small>
          <small
            className="small btn btn-link btn-sm position-fixed bottom-0 end-0 me-3 mb-1 text-decoration-none"
            onClick={() => {
              logout()
            }}
          >
            Sign Out
          </small>
        </div>
    </div>
  )
}

export default AppLayout