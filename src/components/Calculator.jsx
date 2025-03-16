'use client'

import React, { useState } from 'react';

const Calculator = () => {
  // State variables
  const [designName, setDesignName] = useState('');
  const [materials, setMaterials] = useState([
    { name: '', cost: 0, quantity: 1 }
  ]);
  
  // Labor state
  const [labor, setLabor] = useState({
    hourlyRate: 0,
    hours: 0,
    minutes: 0
  });
  
  // Update material line
  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: field === 'cost' || field === 'quantity' ? Number(value) || 0 : value
    };
    setMaterials(updatedMaterials);
  };
  
  // Calculations
  const materialTotal = materials.reduce((sum, mat) => sum + (mat.cost * mat.quantity), 0);
  const laborHours = labor.hours + (labor.minutes / 60);
  const laborCost = labor.hourlyRate * laborHours;
  const totalCost = materialTotal + laborCost;
  
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
      
      {/* Display materials total */}
      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Materials Total: ${materialTotal.toFixed(2)}</h3>
      </div>
      
      {/* Labor Section */}
      <div style={{ marginTop: '20px' }}>
        <h2>Labor</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label>Hourly Rate ($)</label>
            <input
              type="number"
              value={labor.hourlyRate}
              onChange={(e) => setLabor({...labor, hourlyRate: Number(e.target.value) || 0})}
              style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Hours</label>
            <input
              type="number"
              value={labor.hours}
              onChange={(e) => setLabor({...labor, hours: Number(e.target.value) || 0})}
              style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
            />
          </div>
          <div>
            <label>Minutes</label>
            <select
              value={labor.minutes}
              onChange={(e) => setLabor({...labor, minutes: Number(e.target.value)})}
              style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px', height: '30px' }}
            >
              <option value="0">0</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Display labor cost */}
      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
        <h3>Labor Cost: ${laborCost.toFixed(2)}</h3>
      </div>
      
      {/* Display total cost */}
      <div style={{ marginTop: '20px', padding: '10px', background: '#e1f5fe', borderRadius: '4px' }}>
        <h2>Total Cost: ${totalCost.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default Calculator;
