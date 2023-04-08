import React from 'react';
import './section.styles.css';

const Section = ({ title, subtitle, color }) => {
    return (
        <div className={`section section-${color}`}>
            <div className="section-content">
                <h2 className="section-title">{title}</h2>
                <h3 className="section-subtitle">{subtitle}</h3>
            </div>
        </div>
    );
};

export default Section;
