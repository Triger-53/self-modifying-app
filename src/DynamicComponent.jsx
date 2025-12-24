import React from 'react';

const DynamicComponent = () => {
  return (
    <div style={{ padding: '20px', border: '2px dashed #646cff', borderRadius: '8px', marginTop: '20px' }}>
      <h2>I am the Dynamic Component</h2>
      <p>I have been updated!</p>
    </div>
  );
};

export default DynamicComponent;