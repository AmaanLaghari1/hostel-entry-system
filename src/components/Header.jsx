import icon from '../assets/images/right_logo.png'

const Header = () => {
  return (
    <div style={{height: '15vh'}} className='w-100 d-flex align-items-center'>
        <div className="ms-5 px-5">
            <div className='d-flex align-items-center'>
                <img src={icon} alt="logo image" width={60} />
                <div>
                    <span style={{letterSpacing: '3px'}} className="fw-bolder fs-4 text-dark">
                        HOSTEL <br />
                    </span>
                    <span style={{letterSpacing: '2px', fontWeight: '500'}} className=''>
                        Management System
                    </span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header