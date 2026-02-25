
const Loader = () => {
  return (
    <div className='position-absolute start-0 top-0 w-100' style={{ zIndex: 9999, background: 'rgba(0, 0, 0, 0.4)' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="spinner-border text-light fw-bolder fs-1" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
  )
}

export default Loader