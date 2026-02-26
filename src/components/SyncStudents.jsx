import axios from "axios";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Loader from "./Loader";

const SyncStudents = () => {
    const [loading, setLoading] = useState(false);
    const authToken = localStorage.getItem("token");
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const syncStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_BASE}loadStudents`,
                {
                    hostelForID: 2
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                }
            );

            console.log("Sync Response:", response.data);
            // alert("User data synchronized successfully!");
        } catch (error) {
            console.log("Sync Error:", error.response || error);
            // alert("Failed to synchronize user data.");
        }
        setLoading(false);
    }

    return (
        <div>
            {/* {loading ? <Loader /> : null} */}
            <div className="container p-3">
                <Button className="rounded-0" variant="dark"
                    onClick={() => syncStudents()}
                    disabled={loading}
                >
                    <span className="text-white fw-bold">
                        {
                            loading ? 'Syncing...' : 'Sync Students'
                        }
                    </span>
                </Button>
            </div>

        </div>
    )
}

export default SyncStudents