import React, { useState, useEffect } from 'react';
import '../styles/ui.css';

// We'll remove these imports and get the SVG list from the plugin
// import Vector1 from '../assets/Vector.svg';
// import Vector2 from '../assets/Vector-1.svg';

// ... (keep existing ChevronDown and CustomSelect components)

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
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [selectedVector, setSelectedVector] = useState('');
  const [previewSrc, setPreviewSrc] = useState('');
  const [vectorOptions, setVectorOptions] = useState(['Select Vector']);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };

  const handleVectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVector(e.target.value);
    updatePreview(e.target.value);
  };

  const updatePreview = (vector: string) => {
    if (vector !== 'Select Vector') {
      parent.postMessage({ pluginMessage: { type: 'get-svg-preview', vector } }, '*');
    } else {
      setPreviewSrc('');
    }
  };

  const onPlaceIt = () => {
    parent.postMessage({ pluginMessage: { type: 'place-svg', vector: selectedVector, color: primaryColor } }, '*');
  };

  useEffect(() => {
    // Request the list of SVGs from the plugin
    parent.postMessage({ pluginMessage: { type: 'get-svg-list' } }, '*');

    // Listen for messages from the plugin
    window.onmessage = (event) => {
      const message = event.data.pluginMessage;
      if (message.type === 'svg-list') {
        setVectorOptions(['Select Vector', ...message.vectors]);
      } else if (message.type === 'svg-preview') {
        setPreviewSrc(message.svgString);
      } else if (message.type === 'svg-placed') {
        console.log(message.message);
      } else if (message.type === 'svg-preview-error' || message.type === 'svg-place-error') {
        console.error(message.error);
        // You might want to show an error message to the user here
      }
    };
  }, []);

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
          {previewSrc && <div dangerouslySetInnerHTML={{ __html: previewSrc }} style={{width: '100%', height: '100%'}} />}
        </div>
      </div>

      <button className="place-it-button" onClick={onPlaceIt} disabled={!selectedVector || selectedVector === "Select Vector"}>
        Place it
      </button>
    </div>
  );
}

export default App;
