import { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useHostel } from "../context/HostelContext";
import { loginRequest } from "../api/AuthRequest";

export default function Login() {
    const { login } = useHostel()
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const validate = () => {
        let tempErrors = {};

        if (!formData.username.trim()) {
            tempErrors.username = "Username is required";
        }

        if (!formData.password) {
            tempErrors.password = "Password is required";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginRequest(formData)
            console.log(response)
            login(response.data)
        } catch (error) {
            console.log(error)
            setError(error.response?.data?.error || "Login failed. Please try again.")
        }
    }

    return (
        <Card className="border-0" style={{ margin: "auto" }}>
            <h3 className="text-center mb-3">Login</h3>

            {success && <Alert size='sm' variant="success">{success}</Alert>}
            {error && <Alert size='sm' variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Username<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        className="rounded-0"
                        size="sm"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        isInvalid={!!errors.username}
                        placeholder="Enter username"
                    />
                    <Form.Control.Feedback type="invalid" className="rounded-0 small">
                        {errors.username}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold small">Password<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        className="rounded-0"
                        size="sm"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder="Enter password"
                    />
                    <Form.Control.Feedback type="invalid" className="rounded-0 small">
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="dark" className="w-100 btn-sm rounded-0 mb-3">
                    Login
                </Button>
            </Form>
        </Card>
    );
}
