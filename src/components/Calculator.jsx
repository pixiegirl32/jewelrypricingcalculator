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
  
  // Pricing settings
  const [settings, setSettings] = useState({
    materialMarkup: 3,
    customRetailPrice: null
  });
  
  // Component Calculator States
  const [findingsCalc, setFindingsCalc] = useState({
    packageCost: 0,
    pieceCount: 1,
    piecesNeeded: 1
  });

  const [wireCalc, setWireCalc] = useState({
    wireCost: 0,
    lengthNeeded: 0
  });

  const [chainCalc, setChainCalc] = useState({
    bulkCost: 0,
    bulkLength: 0,
    lengthNeeded: 0
  });

  const [beadCalc, setBeadCalc] = useState({
    strandCost: 0,
    beadsPerStrand: 0,
    beadsNeeded: 0
  });
  
  // Component Calculator Functions
  const addFindingsToMaterials = () => {
    const costPerPiece = findingsCalc.packageCost / findingsCalc.pieceCount;
    setMaterials([...materials, {
      name: 'Findings Component',
      cost: costPerPiece,
      quantity: findingsCalc.piecesNeeded
    }]);
  };

  const addWireToMaterials = () => {
    const costPerInch = wireCalc.wireCost / 12;
    setMaterials([...materials, {
      name: 'Wire',
      cost: costPerInch,
      quantity: wireCalc.lengthNeeded
    }]);
  };

  const addChainToMaterials = () => {
    const costPerInch = chainCalc.bulkCost / chainCalc.bulkLength;
    setMaterials([...materials, {
      name: 'Chain',
      cost: costPerInch,
      quantity: chainCalc.lengthNeeded
    }]);
  };

  const addBeadsToMaterials = () => {
    const costPerBead = beadCalc.strandCost / beadCalc.beadsPerStrand;
    setMaterials([...materials, {
      name: 'Beads',
      cost: costPerBead,
      quantity: beadCalc.beadsNeeded
    }]);
  };
  
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
  
  // My cost calculation
  const myCost = materialTotal + laborCost;
  
  // Material markup calculation
  const materialWithMarkup = materialTotal * settings.materialMarkup;
  const suggestedRetailPrice = materialWithMarkup + laborCost;
  const suggestedWholesalePrice = suggestedRetailPrice / 2;
  
  // Final prices with custom retail (if provided)
  const finalRetailPrice = settings.customRetailPrice || suggestedRetailPrice;
  const finalWholesalePrice = finalRetailPrice / 2;
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
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
      
      {/* Component Calculator */}
      <div style={{ marginTop: '20px' }}>
        <h2>Component Calculator</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {/* Findings Calculator */}
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
            <h3 style={{ marginTop: '0' }}>Findings Calculator</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>Package Cost</label>
              <input
                type="number"
                placeholder="Cost of package"
                value={findingsCalc.packageCost}
                onChange={(e) => setFindingsCalc({...findingsCalc, packageCost: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                step="0.01"
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Pieces in Package</label>
              <input
                type="number"
                placeholder="Number of pieces"
                value={findingsCalc.pieceCount}
                onChange={(e) => setFindingsCalc({...findingsCalc, pieceCount: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                min="1"
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Pieces Needed</label>
              <input
                type="number"
                placeholder="How many needed"
                value={findingsCalc.piecesNeeded}
                onChange={(e) => setFindingsCalc({...findingsCalc, piecesNeeded: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                min="1"
              />
            </div>
            <button 
              onClick={addFindingsToMaterials}
              style={{ width: '100%', padding: '8px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add to Materials
            </button>
          </div>
          
          {/* Wire Calculator */}
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
            <h3 style={{ marginTop: '0' }}>Wire Calculator</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>12" Wire Cost</label>
              <input
                type="number"
                placeholder="Cost per foot"
                value={wireCalc.wireCost}
                onChange={(e) => setWireCalc({...wireCalc, wireCost: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                step="0.01"
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Length Needed (inches)</label>
              <input
                type="number"
                placeholder="Inches needed"
                value={wireCalc.lengthNeeded}
                onChange={(e) => setWireCalc({...wireCalc, lengthNeeded: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                step="0.25"
              />
            </div>
            <div style={{ marginBottom: '10px' }}></div>
            <button 
              onClick={addWireToMaterials}
              style={{ width: '100%', padding: '8px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add to Materials
            </button>
          </div>
          
          {/* Chain Calculator */}
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
            <h3 style={{ marginTop: '0' }}>Chain Calculator</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>Bulk Length Cost</label>
              <input
                type="number"
                placeholder="Cost of bulk length"
                value={chainCalc.bulkCost}
                onChange={(e) => setChainCalc({...chainCalc, bulkCost: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                step="0.01"
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Bulk Length (inches)</label>
              <input
                type="number"
                placeholder="Total length"
                value={chainCalc.bulkLength}
                onChange={(e) => setChainCalc({...chainCalc, bulkLength: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                min="1"
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Length Needed (inches)</label>
              <input
                type="number"
                placeholder="Inches needed"
                value={chainCalc.lengthNeeded}
                onChange={(e) => setChainCalc({...chainCalc, lengthNeeded: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                step="0.25"
              />
            </div>
            <button 
              onClick={addChainToMaterials}
              style={{ width: '100%', padding: '8px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add to Materials
            </button>
          </div>
          
          {/* Bead Calculator */}
          <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
            <h3 style={{ marginTop: '0' }}>Bead Calculator</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>Strand Cost</label>
              <input
                type="number"
                placeholder="Cost of strand"
                value={beadCalc.strandCost}
                onChange={(e) => setBeadCalc({...beadCalc, strandCost: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                step="0.01"
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Beads per Strand</label>
              <input
                type="number"
                placeholder="Number of beads"
                value={beadCalc.beadsPerStrand}
                onChange={(e) => setBeadCalc({...beadCalc, beadsPerStrand: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                min="1"
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Beads Needed</label>
              <input
                type="number"
                placeholder="How many needed"
                value={beadCalc.beadsNeeded}
                onChange={(e) => setBeadCalc({...beadCalc, beadsNeeded: Number(e.target.value)})}
                style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
                min="1"
              />
            </div>
            <button 
              onClick={addBeadsToMaterials}
              style={{ width: '100%', padding: '8px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Add to Materials
            </button>
          </div>
        </div>
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
      
      {/* Material Markup */}
      <div style={{ marginTop: '20px' }}>
        <h2>Material Markup</h2>
        <div>
          <label>Markup Multiplier (×)</label>
          <input
            type="number"
            value={settings.materialMarkup}
            onChange={(e) => setSettings({...settings, materialMarkup: Number(e.target.value) || 1})}
            style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
            min="1"
            step="0.1"
          />
        </div>
      </div>
      
      {/* Pricing Information */}
      <div style={{ marginTop: '20px', background: '#e1f5fe', padding: '15px', borderRadius: '4px' }}>
        <h2 style={{ marginTop: '0' }}>Pricing Information</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>My Cost</h3>
            <p style={{ margin: '0' }}>${myCost.toFixed(2)}</p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>Materials with Markup</h3>
            <p style={{ margin: '0' }}>${materialWithMarkup.toFixed(2)}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>Suggested Retail</h3>
            <p style={{ margin: '0' }}>${suggestedRetailPrice.toFixed(2)}</p>
          </div>
          <div>
            <h3 style={{ margin: '0 0 5px 0' }}>Suggested Wholesale</h3>
            <p style={{ margin: '0' }}>${suggestedWholesalePrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Market Adjustment */}
      <div style={{ marginTop: '20px' }}>
        <h2>Market Price Adjustment</h2>
        <p style={{ fontSize: '14px', color: '#666' }}>Compare with similar products and adjust your retail price if needed</p>
        
        <div>
          <label>Adjusted Retail Price</label>
          <input
            type="number"
            value={settings.customRetailPrice || ''}
            onChange={(e) => setSettings({
              ...settings,
              customRetailPrice: e.target.value ? Number(e.target.value) : null
            })}
            placeholder={`Suggested: $${suggestedRetailPrice.toFixed(2)}`}
            style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
            step="0.01"
          />
        </div>
        
        {settings.customRetailPrice && (
          <div style={{ marginTop: '15px', background: '#e8f5e9', padding: '15px', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>Final Retail Price</h3>
                <p style={{ margin: '0', fontWeight: 'bold' }}>${finalRetailPrice.toFixed(2)}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  Profit: ${(finalRetailPrice - myCost).toFixed(2)}
                </p>
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>Final Wholesale Price</h3>
                <p style={{ margin: '0', fontWeight: 'bold' }}>${finalWholesalePrice.toFixed(2)}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  Profit: ${(finalWholesalePrice - myCost).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Information */}
      <div style={{ marginTop: '30px', padding: '15px', textAlign: 'center', borderTop: '1px solid #ddd' }}>
        <p style={{ fontWeight: 'bold' }}>
          Want to grow your jewelry business or add the skill of metalsmithing?
        </p>
        <p>
          Learn about our business programs, jewelry classes, retreats and more at The Crested Butte Jewelry School and Jewelry Business School.
        </p>
        <a 
          href="https://www.cbjewelryschool.com/what-is-jewelry-business-school" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'inline-block', 
            padding: '8px 16px', 
            background: '#4a90e2', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            marginTop: '10px'
          }}
        >
          Learn More Here
        </a>
      </div>
    </div>
  );
};

export default Calculator;
