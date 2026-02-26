import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router'
import Loader from '../components/Loader'
import { convertUTCToLocalTime } from '../helper'

const StudentLog = () => {
  const authToken = localStorage.getItem("token")
  // console.log(authToken)

  const [students, setStudents] = useState([{}])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const { rollNo } = location.state || {}

  const fetchStudentLog = async (token, rollNo) => {
    setLoading(true)
    try {
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL + 'student/get_log', {
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
      selector: (row, i) => i + 1,
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
      name: "Direction",
      selector: row => row.direction || '-',
      sortable: true
    },
    {
      name: "Log Date",
      selector: row => convertUTCToLocalTime(row.logDate) || '-',
      sortable: true,
      width: "200px"
    },
    {
      name: "Action",
      cell: (row) => (<>
      </>)
    }
  ]

  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) =>
    [
      student.fullName,
      student.rollNo,
      student.hostelName,
      student.blockName,
      student.roomNo,
      student.direction,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className='w-100 p-3 mt-5' style={{ flexGrow: 1 }}>

      {
        loading ? <Loader /> :
          <>
            <h1 className="mb-4 mt-5">Student Log</h1>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: "10px", padding: "5px" }}
            />
            <DataTable
              columns={columns}
              data={filteredStudents}
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