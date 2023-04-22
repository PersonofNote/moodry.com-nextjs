import React from 'react';
import './loader.module.css'

export default function Loader() {

    return (
      <div style={{height: '50px', display: 'flex', justifyContent: 'center'}}>
        <div className="loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    );
  }


