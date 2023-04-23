import React from "react";
import "./button.styles.css";

const Button = ({ onClick, label }) => {
    return (
        <button className="neumorphic-button" onClick={onClick}>
            {label}
        </button>
    );
};

export default Button;