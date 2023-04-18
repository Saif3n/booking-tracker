import React, { useState } from 'react';
import { Post } from "./Post";


function Input() {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };


  return (
    <div>
      <div className={`box transform ${expanded ? 'transform-active2 ' : ''}`}>
        {!expanded &&
          <div className="intro">
            <h1>Bachcare Cancellation Tracker</h1>
            <h4>A tracker that notifies you when the desired dates of a Bachcare property becomes available.</h4>
            <button type="button" className="butto" onClick={handleClick}>Get Started</button>
          </div>
        }
        {expanded && <Post/>}


      </div>
    </div>

  );
}

export default Input;
