import React, { useState } from 'react';

const LoginView = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials);
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setShowCreateAccount(true);
    console.log("Create account clicked");
  };

  if (showCreateAccount) {
    return (
      <div className="login-container">
        <form className="login-form">
          <h2>Creare Cont Nou</h2>
          <div className="form-group">
            <label htmlFor="newEmail">Email:</label>
            <input
              type="email"
              id="newEmail"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Parolă:</label>
            <input
              type="password"
              id="newPassword"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol:</label>
            <select id="role" className="form-select">
              <option value="author">Autor</option>
              <option value="reviewer">Reviewer</option>
              <option value="organizer">Organizator</option>
            </select>
          </div>
          <button type="submit">Creează cont</button>
          <button 
            type="button" 
            onClick={() => setShowCreateAccount(false)}
            className="secondary-button"
          >
            Înapoi la Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={credentials.email}
            onChange={(e) => setCredentials(prev => ({
              ...prev,
              email: e.target.value
            }))}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({
              ...prev,
              password: e.target.value
            }))}
          />
        </div>
        <button type="submit">Login</button>
        <button 
          type="button" 
          onClick={handleCreateAccount}
          className="secondary-button"
        >
          Creare Cont Nou
        </button>
      </form>
    </div>
  );
};

export default LoginView;