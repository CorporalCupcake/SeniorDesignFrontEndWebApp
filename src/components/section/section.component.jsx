import React from 'react';
import PropTypes from 'prop-types';

class Section extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHovered: false,
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseEnter() {
        this.setState({ isHovered: true });
    }

    handleMouseLeave() {
        this.setState({ isHovered: false });
    }

    render() {
        const { heading, subheading, color } = this.props;
        const { isHovered } = this.state;

        const wrapperStyle = {
            display: 'inline-block',
            borderRadius: '50px',
            backgroundColor: color,
            padding: '12px 24px',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '24px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
        };

        const pulseStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            transform: isHovered ? 'scale(1.2)' : 'scale(1)',
            borderRadius: '50%',
            opacity: isHovered ? 1 : 0,
            transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
        };

        const subheadingStyle = {
            fontSize: '18px',
        };

        return (
            <div style={wrapperStyle} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                {heading}
                <div style={subheadingStyle}>{subheading}</div>
                <div style={pulseStyle}></div>
            </div>
        );
    }
}

Section.propTypes = {
    heading: PropTypes.string.isRequired,
    subheading: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
};

export default Section;
