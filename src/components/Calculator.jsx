'use client'

import React, { useState } from 'react';

const Calculator = () => {
  // State variables
  const [designName, setDesignName] = useState('');
  const [materials, setMaterials] = useState([
    { name: '', cost: 0, quantity: 1 }
  ]);
  
  // Update material line
  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: field === 'cost' || field === 'quantity' ? Number(value) || 0 : value
    };
    setMaterials(updatedMaterials);
  };
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Jewelry Pricing Calculator</h1>
      
      {/* Design Name */}
      <div style={{ marginBottom: '20px' }}>
        <label>Design Name: </label>
        <input 
          type="text" 
          value={designName} 
          onChange={(e) => setDesignName(e.target.value)}
          style={{ padding: '5px', marginLeft: '5px' }}
        />
      </div>
      
      {/* Materials Section */}
      <div style={{ marginTop: '20px' }}>
        <h2>Materials</h2>
        
        {materials.map((material, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Material name"
              value={material.name}
              onChange={(e) => updateMaterial(index, 'name', e.target.value)}
              style={{ flex: '1', marginRight: '10px', padding: '5px' }}
            />
            <input
              type="number"
              placeholder="Cost"
              value={material.cost}
              onChange={(e) => updateMaterial(index, 'cost', e.target.value)}
              style={{ width: '80px', marginRight: '10px', padding: '5px' }}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={material.quantity}
              onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
              style={{ width: '80px', padding: '5px' }}
            />
          </div>
        ))}
        
        <button 
          onClick={() => setMaterials([...materials, { name: '', cost: 0, quantity: 1 }])}
          style={{ padding: '5px 10px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Material
        </button>
      </div>
      
      {/* Display total */}
      {materials.some(m => m.name) && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Materials Total: ${materials.reduce((sum, mat) => sum + (mat.cost * mat.quantity), 0).toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};

export default Calculator;
