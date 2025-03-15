'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Calculator } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const Calculator = () => {
  // Design Info
  const [designName, setDesignName] = useState('');
  
  // Saved Designs State
  const [savedDesigns, setSavedDesigns] = useState([]);
  
useEffect(() => {
  if (typeof window !== 'undefined') {
    const [savedDesigns, setSavedDesigns] = useState([]);
useEffect(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('savedDesigns');
    if (saved) setSavedDesigns(JSON.parse(saved));
  }
}, []);


  // Materials State
  const [materials, setMaterials] = useState([
    { name: '', cost: 0, quantity: 1 }
  ]);

  const [savedMaterials, setSavedMaterials] = useState([]);

useEffect(() => {
  if (typeof window !== 'undefined') {
    const [savedMaterials, setSavedMaterials] = useState([]);
useEffect(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('savedMaterials');
    if (saved) setSavedMaterials(JSON.parse(saved));
  }
}, []);

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

  const [packagingCosts, setPackagingCosts] = useState(0);

  const [packaging, setPackaging] = useState({
    // Boxes
    boxPackageCost: 0,
    boxPackageQty: 1,
    boxNeeded: 1,
    // Bags
    bagPackageCost: 0,
    bagPackageQty: 1,
    bagNeeded: 1,
    // Business Cards
    cardPackageCost: 0,
    cardPackageQty: 1,
    cardNeeded: 1,
    // Other Items
    otherItems: [{
      name: '',
      packageCost: 0,
      packageQty: 1,
      needed: 1
    }]
  });
  // Component Calculator Functions
  const addFindingsToMaterials = () => {
    const costPerPiece = findingsCalc.packageCost / findingsCalc.pieceCount;
    const totalCost = costPerPiece * findingsCalc.piecesNeeded;
    setMaterials([...materials, {
      name: 'Findings Component',
      cost: costPerPiece,
      quantity: findingsCalc.piecesNeeded
    }]);
  };

  const addWireToMaterials = () => {
    const costPerInch = wireCalc.wireCost / 12;
    const totalCost = costPerInch * wireCalc.lengthNeeded;
    setMaterials([...materials, {
      name: 'Wire',
      cost: costPerInch,
      quantity: wireCalc.lengthNeeded
    }]);
  };

  const addChainToMaterials = () => {
    const costPerInch = chainCalc.bulkCost / chainCalc.bulkLength;
    const totalCost = costPerInch * chainCalc.lengthNeeded;
    setMaterials([...materials, {
      name: 'Chain',
      cost: costPerInch,
      quantity: chainCalc.lengthNeeded
    }]);
  };

  const addBeadsToMaterials = () => {
    const costPerBead = beadCalc.strandCost / beadCalc.beadsPerStrand;
    const totalCost = costPerBead * beadCalc.beadsNeeded;
    setMaterials([...materials, {
      name: 'Beads',
      cost: costPerBead,
      quantity: beadCalc.beadsNeeded
    }]);
  };
  // Labor Settings
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

useEffect(() => {
  if (typeof window !== 'undefined') {
    const [savedOverhead, setSavedOverhead] = useState(null);
useEffect(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('savedOverhead');
    if (saved) setSavedOverhead(JSON.parse(saved));
  }
}, []);

  // Pricing settings
  const [settings, setSettings] = useState({
    materialMarkup: 5,
    customRetailPrice: null
  });

   // Calculations with overhead and packaging
const materialTotal = materials.reduce((sum, mat) => sum + (mat.cost * mat.quantity), 0);
const laborHours = labor.hours + (labor.minutes / 60);
const laborCost = labor.hourlyRate * laborHours;
const overheadCost = savedOverhead ? (savedOverhead.monthlyTotal * (savedOverhead.designPercentage / 100)) : 0;

// Add packaging to myCost but don't mark it up
const myCost = materialTotal + laborCost + overheadCost + packagingCosts;

// Only mark up materials, not packaging
const materialWithMarkup = materialTotal * settings.materialMarkup;
const baseCost = materialWithMarkup + laborCost + overheadCost + packagingCosts;

// Calculate initial retail and wholesale prices
const calculatedRetailPrice = baseCost;
const calculatedWholesalePrice = calculatedRetailPrice / 2;

// Calculate market-adjusted prices
const finalRetailPrice = settings.customRetailPrice || calculatedRetailPrice;
const finalWholesalePrice = finalRetailPrice / 2;

// Calculate profits
const initialRetailProfit = calculatedRetailPrice - myCost;
const initialWholesaleProfit = calculatedWholesalePrice - myCost;
const finalRetailProfit = finalRetailPrice - myCost;
const finalWholesaleProfit = finalWholesalePrice - myCost;
  // Add new material line
  const addMaterial = () => {
    setMaterials([...materials, { name: '', cost: 0, quantity: 1 }]);
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

// Export Functions
const exportToExcel = () => {
  // Create array for vertical layout
  const exportData = [
    ["Design Name", designName],
    [""], // Empty row for spacing
    ["Materials List"],
    // Create a row for each material
    ...materials.map(m => [
      m.name, `$${m.cost.toFixed(2)}`, m.quantity, `$${(m.cost * m.quantity).toFixed(2)}`
    ]),
    [""], // Empty row for spacing
    ["Cost Breakdown"],
    ["Materials Total", `$${materialTotal.toFixed(2)}`],
    ["Labor Cost", `$${laborCost.toFixed(2)}`],
    ["Overhead Cost", savedOverhead ? `$${overheadCost.toFixed(2)}` : "$0.00"],
    ["My Total Cost", `$${myCost.toFixed(2)}`],
    [""], // Empty row for spacing
    ["Initial Pricing"],
    ["Materials with Markup", `$${materialWithMarkup.toFixed(2)}`],
    ["Retail Price", `$${calculatedRetailPrice.toFixed(2)}`],
    ["Retail Profit", `$${(calculatedRetailPrice - myCost).toFixed(2)}`],
    ["Wholesale Price", `$${calculatedWholesalePrice.toFixed(2)}`],
    ["Wholesale Profit", `$${(calculatedWholesalePrice - myCost).toFixed(2)}`]
  ];

  // Add market adjustment section if there's a custom price
  if (settings.customRetailPrice) {
    exportData.push(
      [""], // Empty row for spacing
      ["Market Adjusted Pricing"],
      ["Final Retail Price", `$${finalRetailPrice.toFixed(2)}`],
      ["Final Retail Profit", `$${(finalRetailPrice - myCost).toFixed(2)}`],
      ["Final Wholesale Price", `$${finalWholesalePrice.toFixed(2)}`],
      ["Final Wholesale Profit", `$${(finalWholesalePrice - myCost).toFixed(2)}`]
    );
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.sheet_add_aoa(wb, exportData);
  XLSX.utils.book_append_sheet(wb, ws, "Design Details");
  XLSX.writeFile(wb, `${designName || 'design'}.xlsx`);
};
const exportToSheets = () => {
  // Create array for vertical layout
  const exportData = [
    ["Design Name", designName],
    [""], // Empty row for spacing
    ["Materials List"],
    // Create a row for each material
    ...materials.map(m => [
      m.name, `$${m.cost.toFixed(2)}`, m.quantity, `$${(m.cost * m.quantity).toFixed(2)}`
    ]),
    [""], // Empty row for spacing
    ["Cost Breakdown"],
    ["Materials Total", `$${materialTotal.toFixed(2)}`],
    ["Labor Cost", `$${laborCost.toFixed(2)}`],
    ["Overhead Cost", savedOverhead ? `$${overheadCost.toFixed(2)}` : "$0.00"],
    ["My Total Cost", `$${myCost.toFixed(2)}`],
    [""], // Empty row for spacing
    ["Initial Pricing"],
    ["Materials with Markup", `$${materialWithMarkup.toFixed(2)}`],
    ["Retail Price", `$${calculatedRetailPrice.toFixed(2)}`],
    ["Retail Profit", `$${(calculatedRetailPrice - myCost).toFixed(2)}`],
    ["Wholesale Price", `$${calculatedWholesalePrice.toFixed(2)}`],
    ["Wholesale Profit", `$${(calculatedWholesalePrice - myCost).toFixed(2)}`]
  ];

  // Add market adjustment section if there's a custom price
  if (settings.customRetailPrice) {
    exportData.push(
      [""], // Empty row for spacing
      ["Market Adjusted Pricing"],
      ["Final Retail Price", `$${finalRetailPrice.toFixed(2)}`],
      ["Final Retail Profit", `$${(finalRetailPrice - myCost).toFixed(2)}`],
      ["Final Wholesale Price", `$${finalWholesalePrice.toFixed(2)}`],
      ["Final Wholesale Profit", `$${(finalWholesalePrice - myCost).toFixed(2)}`]
    );
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.sheet_add_aoa(wb, exportData);
  XLSX.utils.book_append_sheet(wb, ws, "Design Details");
  XLSX.writeFile(wb, `${designName || 'design'}.csv`);
};
const exportToPDF = () => {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 10;
  const leftMargin = 20;

  // Create array for vertical layout (just like Excel/Sheets)
  const exportData = [
    ["Design Name", designName],
    [""], // Empty row for spacing
    ["Materials List"],
    // Create a row for each material
    ...materials.map(m => [
      m.name, `$${m.cost.toFixed(2)}`, m.quantity, `$${(m.cost * m.quantity).toFixed(2)}`
    ]),
    [""], // Empty row for spacing
    ["Cost Breakdown"],
    ["Materials Total", `$${materialTotal.toFixed(2)}`],
    ["Labor Cost", `$${laborCost.toFixed(2)}`],
    ["Overhead Cost", savedOverhead ? `$${overheadCost.toFixed(2)}` : "$0.00"],
    ["My Total Cost", `$${myCost.toFixed(2)}`],
    [""], // Empty row for spacing
    ["Initial Pricing"],
    ["Materials with Markup", `$${materialWithMarkup.toFixed(2)}`],
    ["Retail Price", `$${calculatedRetailPrice.toFixed(2)}`],
    ["Retail Profit", `$${(calculatedRetailPrice - myCost).toFixed(2)}`],
    ["Wholesale Price", `$${calculatedWholesalePrice.toFixed(2)}`],
    ["Wholesale Profit", `$${(calculatedWholesalePrice - myCost).toFixed(2)}`]
  ];

  // Add market adjustment section if there's a custom price (exactly like Excel/Sheets)
  if (settings.customRetailPrice) {
    exportData.push(
      [""], // Empty row for spacing
      ["Market Adjusted Pricing"],
      ["Final Retail Price", `$${finalRetailPrice.toFixed(2)}`],
      ["Final Retail Profit", `$${(finalRetailPrice - myCost).toFixed(2)}`],
      ["Final Wholesale Price", `$${finalWholesalePrice.toFixed(2)}`],
      ["Final Wholesale Profit", `$${(finalWholesalePrice - myCost).toFixed(2)}`]
    );
  }

  // Write each line to the PDF
  exportData.forEach(line => {
    if (Array.isArray(line)) {
      const text = line.join(': ');
      doc.text(text, leftMargin, yPos);
    } else {
      doc.text(line, leftMargin, yPos);
    }
    yPos += lineHeight;
  });

  doc.save(`${designName || 'design'}.pdf`);
};

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="text-center py-4">
  <h1 className="text-3xl font-bold text-black">
    Jewelry Business School with Meaghan Young
  </h1>
</div>
     <CardHeader className="bg-gray-50">
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      <Calculator className="w-6 h-6 text-blue-600" />
      <CardTitle>Jewelry Pricing Calculator</CardTitle>
    </div>
    <div className="flex gap-2">
      <button 
        onClick={exportToExcel}
        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export to Excel
      </button>
      <button 
        onClick={exportToSheets}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Export to Sheets
      </button>
      <button 
        onClick={exportToPDF}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Download PDF
      </button>
    </div>
  </div>
</CardHeader>
      <CardContent className="p-6">
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
      ⭐ Important: Your designs are saved in your browser. To keep them safe:
      • Don't clear your browser history/cache
      • Download your important designs as a backup
    </div>
        <div className="space-y-8">
          
          {/* Design Name and Save Controls */}
          <div className="flex gap-4 items-end">
  <div className="flex-1">
    <label className="block text-sm font-medium">Design Name</label>
    <input
      type="text"
      value={designName}
      onChange={(e) => setDesignName(e.target.value)}
      placeholder="Enter design name"
      className="w-full p-2 border rounded"
    />
  </div>
  <div className="flex gap-2">
    <button
      onClick={() => {
        if (designName) {
          const designToSave = {
            name: designName,
            materials,
            labor,
            settings,
            packaging,
            date: new Date().toISOString()
          };
          setSavedDesigns(prev => {
            const newSaved = [...prev, designToSave];
            localStorage.setItem('savedDesigns', JSON.stringify(newSaved));
            return newSaved;
          });
          alert('Design saved!');
        } else {
          alert('Please enter a design name before saving');
        }
      }}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Save Design
    </button>
    <select
      onChange={(e) => {
        if (e.target.value === 'delete') {
          const designToDelete = prompt('Enter the name of the design to delete:');
          if (designToDelete) {
            setSavedDesigns(prev => {
              const newSaved = prev.filter(design => design.name !== designToDelete);
              localStorage.setItem('savedDesigns', JSON.stringify(newSaved));
              return newSaved;
            });
          }
        } else if (e.target.value) {
          const design = JSON.parse(e.target.value);
          setDesignName(design.name);
          setMaterials(design.materials);
          setLabor(design.labor);
          setSettings(design.settings);
          setPackaging(design.packaging);
        }
      }}
      className="p-2 border rounded"
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
          <div className="space-y-4">
          <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">Materials</h3>
              <div className="flex gap-2">
              <select
  onChange={(e) => {
    if (e.target.value === 'delete') {
      const materialToDelete = prompt('Enter the name of the material to delete:');
      if (materialToDelete) {
        setSavedMaterials(prev => {
          const newSaved = prev.filter(mat => mat.name !== materialToDelete);
          localStorage.setItem('savedMaterials', JSON.stringify(newSaved));
          return newSaved;
        });
      }
    } else if (e.target.value) {
      const savedMaterial = JSON.parse(e.target.value);
      setMaterials([...materials, savedMaterial]);
    }
  }}
  className="p-2 border rounded"
  value=""
>
  <option value="">Select Saved Material</option>
  {savedMaterials.map((material, index) => (
    <option key={index} value={JSON.stringify(material)}>
      {material.name}
    </option>
  ))}
  {savedMaterials.length > 0 && (
    <option value="delete">Delete a Material...</option>
  )}
</select>
                <button 
                  onClick={addMaterial}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Material
                </button>
              </div>
            </div>
            
            {materials.map((material, index) => (
  <div key={index} className="flex gap-3 items-start">
    <div className="flex-1">
      <label className="block text-sm mb-1">Material Name</label>
      <input
        type="text"
        placeholder="Enter material name"
        value={material.name}
        onChange={(e) => updateMaterial(index, 'name', e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="w-24">
 <label className="block text-sm mb-1">Cost</label>
<input
type="number"
placeholder="0.00"
value={material.cost}
onChange={(e) => updateMaterial(index, 'cost', e.target.value)}
className="w-full p-2 border rounded"
step="0.01"
/>
</div>
    <div className="w-24">
      <label className="block text-sm mb-1">Amount Used</label>
      <input
        type="number"
        placeholder="Qty"
        value={material.quantity}
        onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
        className="w-full p-2 border rounded"
        min="1"
      />
    </div>
    <div className="w-24">
      <label className="block text-sm mb-1">Line Total</label>
      <div className="p-2 bg-gray-50 border rounded">
        ${(material.cost * material.quantity).toFixed(2)}
      </div>
    </div>
    <div className="flex gap-2">
      <button 
        onClick={() => {
          setSavedMaterials(prev => {
            const newSaved = [...prev, material];
            localStorage.setItem('savedMaterials', JSON.stringify(newSaved));
            return newSaved;
          });
        }}
        className="px-2 py-2 mt-6 text-blue-500 hover:text-blue-700"
        title="Save for reuse"
      >
        💾
      </button>
      <button 
        onClick={() => removeMaterial(index)}
        className="px-2 py-2 mt-6 text-red-500 hover:text-red-700"
      >
        ×
      </button>
    </div>
  </div>
))}

{/* Materials Total */}
<div className="mt-4 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
  <span className="font-medium">Materials Subtotal:</span>
  <span className="text-lg font-bold">${materialTotal.toFixed(2)}</span>
</div>
          </div>
          
{/* Component Calculator */}
<div className="space-y-4 border-t pt-6">
            <h3 className="font-medium text-lg">Component Calculator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Findings Calculator */}
              <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium">Findings Calculator</h4>
                <div>
                  <label className="block text-sm mb-1">Package Cost</label>
                  <input
                    type="number"
                    placeholder="Cost of package"
                    value={findingsCalc.packageCost}
                    onChange={(e) => setFindingsCalc({...findingsCalc, packageCost: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Pieces in Package</label>
                  <input
                    type="number"
                    placeholder="Number of pieces"
                    value={findingsCalc.pieceCount}
                    onChange={(e) => setFindingsCalc({...findingsCalc, pieceCount: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Pieces Needed</label>
                  <input
                    type="number"
                    placeholder="How many needed"
                    value={findingsCalc.piecesNeeded}
                    onChange={(e) => setFindingsCalc({...findingsCalc, piecesNeeded: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
                <button 
                  onClick={addFindingsToMaterials}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add to Materials
                </button>
              </div>
              {/* Wire Calculator */}
<div className="space-y-3 p-4 border rounded-lg flex flex-col">
  <h4 className="font-medium">Wire Calculator</h4>
  <div>
    <label className="block text-sm mb-1">12" Wire Cost</label>
    <input
      type="number"
      placeholder="Cost per foot"
      value={wireCalc.wireCost}
      onChange={(e) => setWireCalc({...wireCalc, wireCost: Number(e.target.value)})}
      className="w-full p-2 border rounded"
      step="0.01"
    />
  </div>
  <div>
    <label className="block text-sm mb-1">Length Needed (inches)</label>
    <input
      type="number"
      placeholder="Inches needed"
      value={wireCalc.lengthNeeded}
      onChange={(e) => setWireCalc({...wireCalc, lengthNeeded: Number(e.target.value)})}
      className="w-full p-2 border rounded"
      step="0.25"
    />
  </div>
  
  {/* Smaller spacer */}
  <div className="flex-grow min-h-16"></div>
  
  <button
    onClick={addWireToMaterials}
    className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    Add to Materials
  </button>
</div>

             {/* Chain Calculator */}
             <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium">Chain Calculator</h4>
                <div>
                  <label className="block text-sm mb-1">Bulk Length Cost</label>
                  <input
                    type="number"
                    placeholder="Cost of bulk length"
                    value={chainCalc.bulkCost}
                    onChange={(e) => setChainCalc({...chainCalc, bulkCost: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Bulk Length (inches)</label>
                  <input
                    type="number"
                    placeholder="Total length"
                    value={chainCalc.bulkLength}
                    onChange={(e) => setChainCalc({...chainCalc, bulkLength: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Length Needed (inches)</label>
                  <input
                    type="number"
                    placeholder="Inches needed"
                    value={chainCalc.lengthNeeded}
                    onChange={(e) => setChainCalc({...chainCalc, lengthNeeded: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                    step="0.25"
                  />
                </div>
                <button 
                  onClick={addChainToMaterials}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add to Materials
                </button>
              </div>

              {/* Bead Calculator */}
              <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium">Bead Calculator</h4>
                <div>
                  <label className="block text-sm mb-1">Strand Cost</label>
                  <input
                    type="number"
                    placeholder="Cost of strand"
                    value={beadCalc.strandCost}
                    onChange={(e) => setBeadCalc({...beadCalc, strandCost: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Beads per Strand</label>
                  <input
                    type="number"
                    placeholder="Number of beads"
                    value={beadCalc.beadsPerStrand}
                    onChange={(e) => setBeadCalc({...beadCalc, beadsPerStrand: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Beads Needed</label>
                  <input
                    type="number"
                    placeholder="How many needed"
                    value={beadCalc.beadsNeeded}
                    onChange={(e) => setBeadCalc({...beadCalc, beadsNeeded: Number(e.target.value)})}
                    className="w-full p-2 border rounded"
                    min="1"
                  />
                </div>
                <button 
                  onClick={addBeadsToMaterials}
                  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add to Materials
                </button>
              </div>
            </div>
          </div>
          {/* Packaging Calculator */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-medium text-lg">Packaging Calculator</h3>
            <div className="p-4 border rounded-lg space-y-6">
              {/* Boxes */}
              <div className="space-y-2">
                <h4 className="font-medium">Boxes</h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Package Cost</label>
                    <input
                      type="number"
                      value={packaging.boxPackageCost}
                      onChange={(e) => setPackaging({...packaging, boxPackageCost: Number(e.target.value)})}
                      placeholder="Cost of package"
                      className="w-full p-2 border rounded"
                      step="0.01"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm mb-1">Qty in Package</label>
                    <input
                      type="number"
                      value={packaging.boxPackageQty}
                      onChange={(e) => setPackaging({...packaging, boxPackageQty: Number(e.target.value)})}
                      placeholder="Quantity"
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm mb-1">Needed</label>
                    <input
                      type="number"
                      value={packaging.boxNeeded}
                      onChange={(e) => setPackaging({...packaging, boxNeeded: Number(e.target.value)})}
                      placeholder="Needed"
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Bags */}
              <div className="space-y-2">
                <h4 className="font-medium">Bags</h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Package Cost</label>
                    <input
                      type="number"
                      value={packaging.bagPackageCost}
                      onChange={(e) => setPackaging({...packaging, bagPackageCost: Number(e.target.value)})}
                      placeholder="Cost of package"
                      className="w-full p-2 border rounded"
                      step="0.01"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm mb-1">Qty in Package</label>
                    <input
                      type="number"
                      value={packaging.bagPackageQty}
                      onChange={(e) => setPackaging({...packaging, bagPackageQty: Number(e.target.value)})}
                      placeholder="Quantity"
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm mb-1">Needed</label>
                    <input
                      type="number"
                      value={packaging.bagNeeded}
                      onChange={(e) => setPackaging({...packaging, bagNeeded: Number(e.target.value)})}
                      placeholder="Needed"
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Business Cards */}
              <div className="space-y-2">
                <h4 className="font-medium">Business Cards</h4>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm mb-1">Package Cost</label>
                    <input
                      type="number"
                      value={packaging.cardPackageCost}
                      onChange={(e) => setPackaging({...packaging, cardPackageCost: Number(e.target.value)})}
                      placeholder="Cost of package"
                      className="w-full p-2 border rounded"
                      step="0.01"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm mb-1">Qty in Package</label>
                    <input
                      type="number"
                      value={packaging.cardPackageQty}
                      onChange={(e) => setPackaging({...packaging, cardPackageQty: Number(e.target.value)})}
                      placeholder="Quantity"
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm mb-1">Needed</label>
                    <input
                      type="number"
                      value={packaging.cardNeeded}
                      onChange={(e) => setPackaging({...packaging, cardNeeded: Number(e.target.value)})}
                      placeholder="Needed"
                      className="w-full p-2 border rounded"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Other Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Other Items</h4>
                  <button
                    onClick={() => setPackaging({
                      ...packaging,
                      otherItems: [...packaging.otherItems, { name: '', packageCost: 0, packageQty: 1, needed: 1 }]
                    })}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Item
                  </button>
                </div>
                {packaging.otherItems.map((item, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded">
                    <div className="flex justify-between">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...packaging.otherItems];
                          newItems[index].name = e.target.value;
                          setPackaging({...packaging, otherItems: newItems});
                        }}
                        placeholder="Item name (e.g., Price Tag)"
                        className="w-full p-2 border rounded"
                      />
                      <button
                        onClick={() => {
                          const newItems = packaging.otherItems.filter((_, i) => i !== index);
                          setPackaging({...packaging, otherItems: newItems});
                        }}
                        className="ml-2 px-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <div className="flex-1">
                        <label className="block text-sm mb-1">Package Cost</label>
                        <input
                          type="number"
                          value={item.packageCost}
                          onChange={(e) => {
                            const newItems = [...packaging.otherItems];
                            newItems[index].packageCost = Number(e.target.value);
                            setPackaging({...packaging, otherItems: newItems});
                          }}
                          placeholder="Cost of package"
                          className="w-full p-2 border rounded"
                          step="0.01"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-sm mb-1">Qty in Package</label>
                        <input
                          type="number"
                          value={item.packageQty}
                          onChange={(e) => {
                            const newItems = [...packaging.otherItems];
                            newItems[index].packageQty = Number(e.target.value);
                            setPackaging({...packaging, otherItems: newItems});
                          }}
                          placeholder="Quantity"
                          className="w-full p-2 border rounded"
                          min="1"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-sm mb-1">Needed</label>
                        <input
                          type="number"
                          value={item.needed}
                          onChange={(e) => {
                            const newItems = [...packaging.otherItems];
                            newItems[index].needed = Number(e.target.value);
                            setPackaging({...packaging, otherItems: newItems});
                          }}
                          placeholder="Needed"
                          className="w-full p-2 border rounded"
                          min="1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Add Button */}
              <div className="mt-6 p-4 bg-gray-100 rounded-lg space-y-4">
                <div className="text-lg font-medium flex justify-between">
                  <span>Total Packaging Cost:</span>
                  <span>${(
                    (((packaging.boxPackageCost || 0) / (packaging.boxPackageQty || 1)) * (packaging.boxNeeded || 0)) +
                    (((packaging.bagPackageCost || 0) / (packaging.bagPackageQty || 1)) * (packaging.bagNeeded || 0)) +
                    (((packaging.cardPackageCost || 0) / (packaging.cardPackageQty || 1)) * (packaging.cardNeeded || 0)) +
                    packaging.otherItems.reduce((sum, item) => 
                      sum + (((item.packageCost || 0) / (item.packageQty || 1)) * (item.needed || 0)), 0)
                  ).toFixed(2)}</span>
                </div>
                <button 
  onClick={() => {
    const totalPackagingCost = 
      (((packaging.boxPackageCost || 0) / (packaging.boxPackageQty || 1)) * (packaging.boxNeeded || 0)) +
      (((packaging.bagPackageCost || 0) / (packaging.bagPackageQty || 1)) * (packaging.bagNeeded || 0)) +
      (((packaging.cardPackageCost || 0) / (packaging.cardPackageQty || 1)) * (packaging.cardNeeded || 0)) +
      packaging.otherItems.reduce((sum, item) => 
        sum + (((item.packageCost || 0) / (item.packageQty || 1)) * (item.needed || 0)), 0);
    
    setPackagingCosts(totalPackagingCost);
  }}
  className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
>
  Add Packaging to Cost
</button>
              </div>
            </div>
          </div>
          {/* Labor Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Labor</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Hourly Rate</label>
                <input
  type="number"
  placeholder="$0.00"
  value={labor.hourlyRate}
  onChange={(e) => setLabor({...labor, hourlyRate: Number(e.target.value) || 0})}
  className="w-full p-2 border rounded"
  step="0.01"
  min="0"
/>
              </div>
              <div>
                <label className="block text-sm mb-1">Hours</label>
                <input
                  type="number"
                  value={labor.hours}
                  onChange={(e) => setLabor({...labor, hours: Number(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Minutes</label>
                <select
                  value={labor.minutes}
                  onChange={(e) => setLabor({...labor, minutes: Number(e.target.value)})}
                  className="w-full p-2 border rounded"
                >
                  <option value="0">0</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
              </div>
            </div>
          </div>

{/* Overhead Calculator */}
<div className="space-y-4 border-t pt-6">
            <h3 className="font-medium text-lg">Monthly Overhead Calculator</h3>
            <div className="space-y-4">
              {overhead.expenses.map((expense, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Expense name"
                      value={expense.name}
                      onChange={(e) => updateExpense(index, 'name', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={expense.amount}
                      onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                      className="w-full p-2 border rounded"
                      step="0.01"
                    />
                  </div>
                  <button 
                    onClick={() => removeExpense(index)}
                    className="px-2 py-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              <button 
                onClick={addExpense}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Expense
              </button>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Monthly Total:</span>
                  <span className="text-lg font-bold">${overhead.monthlyTotal.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
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
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex gap-2 mt-4">
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
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save Overhead Settings
                  </button>
                </div>
                
                {savedOverhead && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm">Saved Overhead:</p>
                        <p className="font-medium">${savedOverhead.monthlyTotal.toFixed(2)} monthly at {savedOverhead.designPercentage}% per design</p>
                      </div>
                      <button 
                        onClick={() => {
                          localStorage.removeItem('savedOverhead');
                          setSavedOverhead(null);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>

          {/* Material Markup */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Material Markup</h3>
            <div>
              <label className="block text-sm mb-1">Markup Multiplier (×)</label>
              <input
                type="number"
                value={settings.materialMarkup}
                onChange={(e) => setSettings({...settings, materialMarkup: Number(e.target.value) || 1})}
                className="w-full p-2 border rounded"
                min="1"
                step="0.1"
              />
            </div>
          </div>

           {/* Initial Price Calculations */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-medium text-xl">Cost & Suggested Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
  <p className="text-lg font-medium">My Cost</p>
  <div className="text-base text-gray-600">
  <p>Materials: ${materialTotal.toFixed(2)}</p>
  <p>Labor: ${laborCost.toFixed(2)}</p>
  {packagingCosts > 0 && (
    <p>Packaging: ${packagingCosts.toFixed(2)}</p>
  )}
  {savedOverhead && (
    <p>Overhead ({savedOverhead.designPercentage}%): ${overheadCost.toFixed(2)}</p>
  )}
  <p className="text-lg font-medium mt-2">Total My Cost: ${myCost.toFixed(2)}</p>
  <div className="mt-4 pt-4 border-t">
  <p>Materials with Markup: ${materialWithMarkup.toFixed(2)}</p>
</div>
</div>
</div>
              <div className="space-y-3">
                <p className="text-lg font-medium">Initial Pricing</p>
                <div className="space-y-4">
                <div>
  <p className="text-lg font-bold">Retail: ${calculatedRetailPrice.toFixed(2)}</p>
  <p className="text-base text-gray-600">
    Retail Profit: ${(calculatedRetailPrice - myCost).toFixed(2)}
  </p>
</div>
<div>
  <p className="text-lg font-bold">Wholesale: ${calculatedWholesalePrice.toFixed(2)}</p>
  <p className="text-base text-gray-600">
    Wholesale Profit w/ Labor: ${((calculatedWholesalePrice - myCost) + laborCost).toFixed(2)}
  </p>
</div>
                </div>
              </div>
            </div>
          </div>

          {/* Market Adjustment Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="font-medium text-lg">Market Price Adjustment</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Compare with similar products and adjust your retail price if needed
              </p>
              <div>
                <label className="block text-sm mb-1">Adjusted Retail Price</label>
                <input
                  type="number"
                  value={settings.customRetailPrice || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    customRetailPrice: e.target.value ? Number(e.target.value) : null
                  })}
                  placeholder={`Suggested: $${calculatedRetailPrice.toFixed(2)}`}
                  className="w-full p-2 border rounded"
                  step="0.01"
                />
              </div>
              
              {settings.customRetailPrice && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <p className="font-medium">Final Retail Price</p>
                    <p className="text-xl font-bold">${finalRetailPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Retail Profit: ${(finalRetailPrice - myCost).toFixed(2)}</p>
                  </div>
                  <div>
  <p className="font-medium">Final Wholesale Price</p>
  <p className="text-xl font-bold">${finalWholesalePrice.toFixed(2)}</p>
  <p className="text-sm text-gray-600">Wholesale Profit w/ Labor: ${((finalWholesalePrice - myCost) + laborCost).toFixed(2)}</p>
</div>
                </div>
              )}
            </div>
            {/* Footer Message */}
          <div className="mt-8 pt-6 border-t text-center">
          <p className="text-gray-600 mb-4 font-bold">
              Want to grow your jewelry business or add the skill of metalsmithing? Learn about our business programs, jewelry classes, retreats and more at The Crested Butte Jewelry School and Jewelry Business School.
            </p>
            <p className="text-gray-600 mb-4 italic">
  ⭐⭐⭐⭐⭐<br />
  "I love these courses so life-changing for me. I would recommend them to anyone. You are such a great teacher and coach. You simply are the best."
</p>
            <a 
              href="https://www.cbjewelryschool.com/what-is-jewelry-business-school" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Learn More Here
            </a>
          </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calculator;
