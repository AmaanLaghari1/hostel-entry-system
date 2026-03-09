import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router'
import Loader from '../components/Loader'
import { convertUTCToLocalTime } from '../helper'
import { Button, Modal } from 'react-bootstrap'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import icon from "../assets/images/right_logo.png";

const StudentLog = () => {
  const authToken = localStorage.getItem("token")
  // console.log(authToken)

  const [students, setStudents] = useState([{}])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const location = useLocation()
  const navigate = useNavigate()

  const { rollNo, hostelName, hostelForName } = location.state || {}

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
      console.log(response.data.data)

      // if image is null, set it to default image
      response.data.data = response.data.data.map(student => {
        // convert buffer to base64 string if image exists
        if (student.image) {
          console.log(student.image)
          const byteArray = new Uint8Array(student.image.data.data);

          // Convert to base64
          let binary = '';
          byteArray.forEach(byte => binary += String.fromCharCode(byte));
          const base64String = btoa(binary);
          student.image = `data:image/jpeg;base64,${base64String}`;
        } else {
          student.image = null; // or set to a default image URL
        }
        return student;
      })

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
      name: "Image",
      cell: row => (
        <img
          src={row.image || 'https://www.undefinedrobotics.org/_app/immutable/assets/logo.tN1ysH9G.png'}
          alt="Student"
          style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer" }}
          onClick={() => {
            setSelectedImage(row.image);
            setShowModal(true);
          }}
        />
      ),
      sortable: true
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
    // {
    //   name: "Action",
    //   cell: (row) => (<>
    //   </>)
    // }
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

  const exportToPdf = (columns, data) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Logo
    const imgWidth = 25;
    const imgProps = doc.getImageProperties(icon);
    const imgHeight = (imgProps.height / imgProps.width) * imgWidth;

    const marginLeft = 14;
    const headerY = 15;

    doc.addImage(icon, "PNG", marginLeft, headerY - 15, imgWidth, imgHeight);

    // Title (Centered)
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");

    const title = "University of Sindh";
    doc.text(title, pageWidth / 2, headerY, { align: "center" });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(hostelForName || '-', pageWidth / 2, headerY + 8, { align: "center" });

    // table data
    const tableColumn = columns.map((col) => col.name);

    const tableRows = data.map((row, rowIndex) =>
      // skip image column
      columns.filter((col) => col.name !== "Image").map((col) => col.selector(row, rowIndex))
    );

    // table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: headerY + 15, // dynamic start below header
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 2,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: 255,
        valign: "center",
      },
      columnStyles: {
        0: { cellWidth: "auto" },
      },
      margin: { left: 14, right: 14 },
      didDrawPage: function (data) {
        // Footer on every page
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.setFont("helvetica", "italic");

        doc.text(
          "Developed by Information Technology and Services Centre, University of Sindh",
          14,
          pageHeight - 8,
          { align: "left" }
        );

        // Page number
        doc.text(
          `Page ${doc.internal.getNumberOfPages()}`,
          pageWidth - 20,
          pageHeight - 8,
          { align: "right" }
        );
      },
    });

    doc.save(`${rollNo}_${hostelName}.pdf`);
  };
  return (
    <div className='w-100 p-3 mt-5' style={{ flexGrow: 1 }}>

      {
        loading ? <Loader /> :
          <>
            <Button
              variant="dark"
              className="mt-5 rounded-0"
              size='sm'
              onClick={() =>
                navigate('/students', {
                  state: location.state
                })
              }
            >
              ← Back
            </Button>
            <h1 className="mb-4">Student Log</h1>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ marginBottom: "10px", padding: "5px" }}
            />
            <Button
              variant="secondary"
              className="ms-1 rounded-0"
              size='sm'
              onClick={() => exportToPdf(columns, filteredStudents)}
            >
              Export to PDF
            </Button>
            <DataTable
              columns={columns}
              data={filteredStudents}
              pagination
              highlightOnHover
              striped
              responsive
            />
            <Modal show={showModal} onHide={() => setShowModal(false)} size="md" centered>
              {/* close button */}
              <Modal.Header className='border-0' closeButton>
              </Modal.Header>
              <Modal.Body className="d-flex justify-content-center">
                <img
                  src={selectedImage || 'https://www.undefinedrobotics.org/_app/immutable/assets/logo.tN1ysH9G.png'}
                  alt="Student"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Modal.Body>
            </Modal>
          </>
      }

    </div>
  )
}

export default StudentLog