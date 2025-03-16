'use client'

import React, { useState } from 'react';

const Calculator = () => {
  // Add a basic state variable
  const [designName, setDesignName] = useState('');
  
  return (
    <div>
      <h1>Jewelry Pricing Calculator</h1>
      
      <div style={{ marginTop: '20px' }}>
        <label>Design Name: </label>
        <input 
          type="text" 
          value={designName} 
          onChange={(e) => setDesignName(e.target.value)}
          style={{ padding: '5px', marginLeft: '5px' }}
        />
      </div>
      
      {designName && (
        <p>Current design: {designName}</p>
      )}
    </div>
  );
};

export default Calculator;
