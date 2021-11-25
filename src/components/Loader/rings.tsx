import React from 'react'
import '../../assets/loading.css';

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function Loader({
}) {
  return (
    <div className="s-showbox">
      <div className="s-loader">
        <svg className="s-circular" viewBox="25 25 50 50">
          <circle className="s-path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle>
        </svg>
      </div>
    </div>
  )
}
