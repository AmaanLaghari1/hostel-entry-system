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
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL+'student/get_students', {
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
      selector: (row, i) => i+1,
      sortable: true,
      width: "80px"
    },
    {
      name: "Name",
      selector: row => row.firstName+" "+row.lastName??'',
      sortable: true
    },
    {
      name: "Father's Name",
      selector: row => row.fName,
      sortable: true
    },
    {
      name: "Email",
      selector: row => row.email,
    },
    {
      name: "Roll No",
      selector: row => row.rollNo,
    },
    {
      name: "Hostel",
      selector: row => row.hostelForName,
      sortable: true
    },
    {
      name: "Block",
      selector: row => row.blockName,
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

export default Student