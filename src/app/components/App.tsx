import React, { useState } from 'react';
import '../styles/ui.css';

function ChevronDown(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M8 10.14a20.36 20.36 0 0 0 3.702 3.893c.175.141.42.141.596 0A20.361 20.361 0 0 0 16 10.14" />
    </svg>
  )
}

function CustomSelect({ value, onChange, options }: { value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[] }) {
  return (
    <div className="custom-select">
      <select value={value} onChange={onChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="select-icon" />
    </div>
  );
}

function App() {
  const [primaryColor, setPrimaryColor] = useState('#00000');
  const [selectedVector, setSelectedVector] = useState('');

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const handleVectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVector(e.target.value);
  };

  const onPlaceIt = () => {
    // Implement the logic to place the vector with the selected color
    console.log('Placing vector:', selectedVector, 'with color:', primaryColor);
  };

  const vectorOptions = ["Select Vector", "Vector 1", "Vector 2", "Vector 3"]; // Add your vector options here

  return (
    <div className="container">
      <h1>Vector Generator</h1>
      
      <div className="input-group">
        <label>PRIMARY COLOR</label>
        <div className="color-input">
          <input
            type="color"
            value={primaryColor}
            onChange={handleColorChange}
          />
          <input
            type="text"
            value={primaryColor}
            onChange={handleColorChange}
          />
        </div>
      </div>

      <div className="input-group">
        <label>CHOOSE VECTOR</label>
        <CustomSelect
          value={selectedVector}
          onChange={handleVectorChange}
          options={vectorOptions}
        />
      </div>

      <div className="input-group">
        <label>PREVIEW</label>
        <div className="preview-box">
          {/* Add preview logic here */}
        </div>
      </div>

      <button className="place-it-button" onClick={onPlaceIt}>
        Place it
      </button>
    </div>
  );
}

export default App;
