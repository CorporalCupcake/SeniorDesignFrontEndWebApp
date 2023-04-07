/**
 * The `Loading` component is a React functional component that renders a loading screen
 * with a spinner animation if the `isLoading` prop is truthy. If `isLoading` is falsy,
 * the component returns null.
 *
 * @param {boolean} props.isLoading - A boolean value that determines whether the loading screen
 * should be displayed or not.
 *
 */


import React from 'react';
import './loading.styles.css';

const Loading = ({ isLoading }) => {
    return isLoading ? (
        <div className="loading-screen">
            <div className="loader">
                <div className="dot dot1"></div>
                <div className="dot dot2"></div>
                <div className="dot dot3"></div>
                <div className="dot dot4"></div>
                <div className="dot dot5"></div>
            </div>
        </div>
    ) : null;
};

export default Loading;
