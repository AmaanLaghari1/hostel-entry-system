import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import Loader from '../components/Loader'

const Student = () => {
  const authToken = localStorage.getItem("token")
  // console.log(authToken)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)


  const navigate = useNavigate()

  const fetchStudents = async (token) => {
    setLoading(true)
    try {
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL + 'student/get_students', {
        hostel_for_id: 2
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
      // console.log(response)
      setStudents(response.data.data)
    } catch (error) {
      console.log(error.response)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStudents(authToken)
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
      selector: row => row.firstName + " " + row.lastName ?? '',
      sortable: true
    },
    {
      name: "Father's Name",
      selector: row => row.fName,
      sortable: true
    },
    {
      name: "Roll No",
      selector: row => row.rollNo,
    },
    {
      name: "Program Title",
      selector: row => row.programTitle,
    },
    {
      name: "Hostel",
      selector: row => row.hostelName,
      sortable: true
    },
    {
      name: "Block",
      selector: row => row.blockName,
      sortable: true
    },
    {
      name: "Room No",
      selector: row => row.roomNo,
      sortable: true
    },
    {
      name: "Action",
      cell: (row) => (<>
        <Button size='sm' variant='warning'
          onClick={() => {
            navigate('/student_log', {
              state: {
                rollNo: row.rollNo
              }
            })
          }}
        >View Log</Button>
      </>)
    }
  ]

  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) =>
    [
      student.firstName,
      student.rollNo,
      student.programTitle,
      student.blockName,
      student.roomNo,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );


  return (
    <div className='w-100 h-100 justify-content-start align-self-start p-3 mt-5' style={{ flexGrow: 1 }}>
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

export default Student