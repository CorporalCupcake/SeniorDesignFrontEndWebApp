import Form from "react-bootstrap/Form";
import React from "react";

const formInput = ({ onChange, label, type, placeholder}) => (
    <Form.Group
        className="mb-3"
        onChange={onChange}
    >
        <Form.Label>{label}</Form.Label>
        <Form.Control type={type} placeholder={placeholder} />
    </Form.Group>
)

export default formInput;
