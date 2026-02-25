import Header from "./Header"

const AppLayout = ({children}) => {
  return (
    <div className="min-vh-100 d-flex flex-column p-0 justify-content-center align-items-center">
        <Header />
        {children}
        <small className="ps-3 pb-2 text-primary position-fixed bottom-0 start-0">
            © 2025 Developed by: Information Technology Services Centre,
            University of Sindh
        </small>
    </div>
  )
}

export default AppLayout