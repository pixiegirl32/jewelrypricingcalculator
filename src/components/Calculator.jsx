'use client'

import React, { useState, useEffect } from 'react';

const Calculator = () => {
  // Design Info
  const [designName, setDesignName] = useState('');
  
  // Saved Designs State
  const [savedDesigns, setSavedDesigns] = useState([]);

  // Load saved designs from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedDesigns');
    if (saved) {
      setSavedDesigns(JSON.parse(saved));
    }
    
    const savedOverhead = localStorage.getItem('savedOverhead');
    if (savedOverhead) {
      setSavedOverhead(JSON.parse(savedOverhead));
    }
  }, []);
  
  // Materials State
  const [materials, setMaterials] = useState([
    { name: '', cost: 0, quantity: 1 }
  ]);
  
  // Labor state
  const [labor, setLabor] = useState({
    hourlyRate: 0,
    hours: 0,
    minutes: 0
  });
  
  // Overhead State
  const [overhead, setOverhead] = useState({
    monthlyTotal: 0,
    expenses: [
      { name: 'Studio Rent', amount: 0 }
    ],
    designPercentage: 10
  });

  // Saved Overhead State
  const [savedOverhead, setSavedOverhead] = useState(null);
  
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
  
  // Packaging costs
  const [packagingCosts, setPackagingCosts] = useState(0);
  
  // Save current design
  const saveDesign = () => {
    if (!designName) {
      alert('Please enter a design name before saving');
      return;
    }
    
    const designToSave = {
      name: designName,
      materials,
      labor,
      settings,
      date: new Date().toISOString()
    };
    
    const newSavedDesigns = [...savedDesigns, designToSave];
    setSavedDesigns(newSavedDesigns);
    localStorage.setItem('savedDesigns', JSON.stringify(newSavedDesigns));
    alert('Design saved!');
  };
  
  // Load a saved design
  const loadDesign = (design) => {
    setDesignName(design.name);
    setMaterials(design.materials);
    setLabor(design.labor);
    setSettings(design.settings);
  };
  
  // Delete a saved design
  const deleteDesign = (designName) => {
    const newSavedDesigns = savedDesigns.filter(design => design.name !== designName);
    setSavedDesigns(newSavedDesigns);
    localStorage.setItem('savedDesigns', JSON.stringify(newSavedDesigns));
  };
  
  // Overhead Functions
  const addExpense = () => {
    setOverhead(prev => ({
      ...prev,
      expenses: [...prev.expenses, { name: '', amount: 0 }]
    }));
  };

  const updateExpense = (index, field, value) => {
    const updatedExpenses = [...overhead.expenses];
    updatedExpenses[index] = {
      ...updatedExpenses[index],
      [field]: field === 'amount' ? Number(value) : value
    };
    
    // Calculate new monthly total
    const newTotal = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    setOverhead(prev => ({
      ...prev,
      expenses: updatedExpenses,
      monthlyTotal: newTotal
    }));
  };

  const removeExpense = (index) => {
    const updatedExpenses = overhead.expenses.filter((_, i) => i !== index);
    const newTotal = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    setOverhead(prev => ({
      ...prev,
      expenses: updatedExpenses,
      monthlyTotal: newTotal
    }));
  };
  
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
  
  // Remove material line
  const removeMaterial = (index) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };
  
  // Calculations with overhead and packaging
  const materialTotal = materials.reduce((sum, mat) => sum + (mat.cost * mat.quantity), 0);
  const laborHours = labor.hours + (labor.minutes / 60);
  const laborCost = labor.hourlyRate * laborHours;
  const overheadCost = savedOverhead ? (savedOverhead.monthlyTotal * (savedOverhead.designPercentage / 100)) : 0;
  
  // My cost calculation with overhead
  const myCost = materialTotal + laborCost + overheadCost + packagingCosts;
  
  // Material markup calculation
  const materialWithMarkup = materialTotal * settings.materialMarkup;
  const baseCost = materialWithMarkup + laborCost + overheadCost + packagingCosts;
  
  // Initial pricing
  const calculatedRetailPrice = baseCost;
  const calculatedWholesalePrice = calculatedRetailPrice / 2;
  
  // Final prices with custom retail (if provided)
  const finalRetailPrice = settings.customRetailPrice || calculatedRetailPrice;
  const finalWholesalePrice = finalRetailPrice / 2;
  
  // Calculate profits
  const initialRetailProfit = calculatedRetailPrice - myCost;
  const initialWholesaleProfit = calculatedWholesalePrice - myCost;
  const finalRetailProfit = finalRetailPrice - myCost;
  const finalWholesaleProfit = finalWholesalePrice - myCost;
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        padding: '15px', 
        background: '#f8f9fa', 
        marginBottom: '20px', 
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#4a90e2' }}>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <h1 style={{ margin: 0, fontSize: '20px' }}>Jewelry Pricing Calculator</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              padding: '5px 10px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Export to Excel
          </button>
        </div>
      </div>
      
      <div style={{ 
        marginBottom: '16px', 
        padding: '12px', 
        backgroundColor: '#e3f2fd', 
        border: '1px solid '#bbdefb', 
        borderRadius: '4px', 
        fontSize: '14px' 
      }}>
        ⭐ Important: Your designs are saved in your browser. To keep them safe:
        <br />• Don't clear your browser history/cache
        <br />• Download your important designs as a backup
      </div>
      
      {/* Design Name and Save Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Design Name</label>
          <input 
            type="text" 
            value={designName} 
            onChange={(e) => setDesignName(e.target.value)}
            placeholder="Enter design name"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={saveDesign}
            style={{ 
              padding: '8px 16px', 
              background: '#4a90e2', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Save Design
          </button>
          <select
            onChange={(e) => {
              if (e.target.value === 'delete') {
                const designToDelete = prompt('Enter the name of the design to delete:');
                if (designToDelete) {
                  deleteDesign(designToDelete);
                }
              } else if (e.target.value) {
                loadDesign(JSON.parse(e.target.value));
              }
            }}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            value=""
          >
            <option value="">Load Saved Design</option>
            {savedDesigns.map((design, index) => (
              <option key={index} value={JSON.stringify(design)}>
                {design.name} - {new Date(design.date).toLocaleDateString()}
              </option>
            ))}
            {savedDesigns.length > 0 && (
              <option value="delete">Delete a Design...</option>
            )}
          </select>
        </div>
      </div>
      
      {/* Materials Section */}
      <div style={{ marginTop: '20px' }}>
        <h2>Materials</h2>
        
        {materials.map((material, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
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
              style={{ width: '80px', marginRight: '10px', padding: '5px' }}
            />
            <div style={{ width: '80px', padding: '5px', background: '#f5f5f5', border: '1px solid #ddd', textAlign: 'center' }}>
              ${(material.cost * material.quantity).toFixed(2)}
            </div>
            <button 
              onClick={() => removeMaterial(index)}
              style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#e53935', fontSize: '18px', cursor: 'pointer' }}
            >
              ×
            </button>
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
      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold' }}>Materials Subtotal:</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${materialTotal.toFixed(2)}</span>
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
      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold' }}>Labor Cost:</span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${laborCost.toFixed(2)}</span>
      </div>
      
      {/* Overhead Calculator */}
      <div style={{ marginTop: '20px' }}>
        <h2>Monthly Overhead Calculator</h2>
        <div style={{ marginTop: '10px' }}>
          {overhead.expenses.map((expense, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Expense name"
                value={expense.name}
                onChange={(e) => updateExpense(index, 'name', e.target.value)}
                style={{ flex: '1', padding: '5px' }}
              />
              <input
                type="number"
                placeholder="Amount"
                value={expense.amount}
                onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                style={{ width: '120px', padding: '5px' }}
                step="0.01"
              />
              <button 
                onClick={() => removeExpense(index)}
                style={{ background: 'none', border: 'none', color: '#e53935', fontSize: '18px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
          ))}
          
          <button 
            onClick={addExpense}
            style={{ padding: '5px 10px', background: '#4a90e2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px' }}
          >
            Add Expense
          </button>

          <div style={{ marginTop: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 'bold' }}>Monthly Total:</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>${overhead.monthlyTotal.toFixed(2)}</span>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Percentage to Add to Each Design (10-15%)
              </label>
              <input
                type="number"
                min="10"
                max="15"
                value={overhead.designPercentage}
                onChange={(e) => setOverhead(prev => ({
                  ...prev,
                  designPercentage: Math.min(15, Math.max(10, Number(e.target.value)))
                }))}
                style={{ width: '100%', padding: '5px' }}
              />
            </div>
            
            <div style={{ marginTop: '15px' }}>
              <button 
                onClick={() => {
                  localStorage.setItem('savedOverhead', JSON.stringify({
                    monthlyTotal: overhead.monthlyTotal,
                    designPercentage: overhead.designPercentage
                  }));
                  setSavedOverhead({
                    monthlyTotal: overhead.monthlyTotal,
                    designPercentage: overhead.designPercentage
                  });
                  alert('Overhead settings saved!');
                }}
                style={{ padding: '5px 10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Save Overhead Settings
              </button>
            </div>
            
            {savedOverhead && (
              <div style={{ marginTop: '15px', padding: '10px', background: '#e3f2fd', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Saved Overhead:</p>
                    <p style={{ margin: '0', fontWeight: 'medium' }}>
                      ${savedOverhead.monthlyTotal.toFixed(2)} monthly at {savedOverhead.designPercentage}% per design
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('savedOverhead');
                      setSavedOverhead(null);
                    }}
                    style={{ background: 'none', border: 'none', color: '#e53935', fontSize: '18px', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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
        <h2 style={{ marginTop: '0' }}>Cost & Suggested Pricing</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' }}>My Cost</p>
            <div style={{ fontSize: '14px', color: '#333' }}>
              <p style={{ margin: '3px 0' }}>Materials: ${materialTotal.toFixed(2)}</p>
              <p style={{ margin: '3px 0' }}>Labor: ${laborCost.toFixed(2)}</p>
              {packagingCosts > 0 && (
                <p style={{ margin: '3px 0' }}>Packaging: ${packagingCosts.toFixed(2)}</p>
              )}
              {savedOverhead && (
                <p style={{ margin: '3px 0' }}>
                  Overhead ({savedOverhead.designPercentage}%): ${overheadCost.toFixed(2)}
                </p>
              )}
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '10px 0' }}>
                Total My Cost: ${myCost.toFixed(2)}
              </p>
              <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ccc' }}>
                <p style={{ margin: '3px 0' }}>Materials with Markup: ${materialWithMarkup.toFixed(2)}</p>
                <p style={{ fontWeight: 'medium' }}>Total Cost with Markup: ${baseCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Initial Pricing</p>
            <div>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>
                Retail: ${calculatedRetailPrice.toFixed(2)}
              </p>
              <p style={{ fontSize: '14px', color: '#333', margin: '3px 0' }}>
                Retail Profit: ${initialRetailProfit.toFixed(2)}
              </p>
            </div>
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0' }}>
                Wholesale: ${calculatedWholesalePrice.toFixed(2)}
              </p>
              <p style={{ fontSize: '14px', color: '#333', margin: '3px 0' }}>
                Wholesale Profit: ${initialWholesaleProfit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Market Adjustment */}
      <div style={{ marginTop: '20px' }}>
        <h2>Market Price Adjustment</h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Compare with similar products and adjust your retail price if needed
        </p>
        
        <div>
          <label>Adjusted Retail Price</label>
          <input
            type="number"
            value={settings.customRetailPrice || ''}
            onChange={(e) => setSettings({
              ...settings,
              customRetailPrice: e.target.value ? Number(e.target.value) : null
            })}
            placeholder={`Suggested: $${calculatedRetailPrice.toFixed(2)}`}
            style={{ display: 'block', width: '100%', padding: '5px', marginTop: '5px' }}
            step="0.01"
          />
        </div>
        
        {settings.customRetailPrice && (
          <div style={{ marginTop: '15px', background: '#e8f5e9', padding: '15px', borderRadius: '4px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>Final Retail Price</h3>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>${finalRetailPrice.toFixed(2)}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  Profit: ${finalRetailProfit.toFixed(2)}
                </p>
              </div>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>Final Wholesale Price</h3>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>${finalWholesalePrice.toFixed(2)}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  Profit: ${finalWholesaleProfit.toFixed(2)}
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
