import React from "react";
import Spinner from 'react-bootstrap/Spinner';

const ErrorPage = () => (
    <div>
        <Spinner animation="grow" />
        Oops, I can't find the page you're looking for. Please head back to the Home Page
    </div>
)

export default ErrorPage;