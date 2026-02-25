import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router'
import Loader from '../components/Loader'

const StudentLog = () => {
  const authToken = localStorage.getItem("token")
  // console.log(authToken)

  const [students, setStudents] = useState([{}])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const {rollNo} = location.state || {}

  const fetchStudentLog = async (token, rollNo) => {
    setLoading(true)
    try {
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL+'student/get_log', {
        roll_no: rollNo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      console.log(response)
      setStudents(response.data.data)
    } catch (error) {
      console.log(error.response)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStudentLog(authToken, rollNo)
  }, [])

  const columns = [
    {
      name: "#",
      selector: (row, i) => i+1,
      sortable: true,
      width: "80px"
    },
    {
      name: "Name",
      selector: row => row.fullName || '-',
      sortable: true
    },
    {
      name: "Roll No",
      selector: row => row.rollNo || '-',
    },
    {
      name: "Hostel",
      selector: row => row.hostelName || '-',
      sortable: true
    },
    {
      name: "Block",
      selector: row => row.blockName || '-',
      sortable: true
    },
    {
      name: "Room No",
      selector: row => row.roomNo || '-',
      sortable: true
    },
    {
      name: "Action",
      cell: (row) => (<>
      </>)
    }
  ]

  return (
    <div className='w-100 p-3 mt-5'>

        {
          loading ? <Loader /> :
          <>
            <h1 className="mb-4 mt-5">Student Log</h1>
            <DataTable
              columns={columns}
              data={students}
              pagination
              highlightOnHover
              striped
              responsive
            />
          </>
        }

    </div>
  )
}

export default StudentLog