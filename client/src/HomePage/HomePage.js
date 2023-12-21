import React, { useState } from 'react';
import ToggleButton from '../ToggleButton/ToggleButton';
import Signup from '../Signup/Signup';
import './HomePage.css';
import Login from '../Login/Login';

function HomePage() {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1 className="homepage-title">Welcome to Our App</h1>
      </header>

      <main className="homepage-content">
        <p className="welcome-message">
          Explore our awesome features by signing up or logging in!
        </p>
        <ToggleButton isLoginView={isLoginView} onToggle={toggleView} />
      </main>

      {isLoginView && <Login />}
      {!isLoginView && <Signup />}

    </div>
  );
}

export default HomePage;