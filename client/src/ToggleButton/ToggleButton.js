import React from 'react';

const ToggleButton = ({ isLoginView, onToggle }) => {
  const toggleText = isLoginView ? 'Sign Up' : 'Login';

  return (
    <button className="toggle-button" onClick={onToggle}>
      {toggleText}
    </button>
  );
};

export default ToggleButton;