import React, { useState } from "react";
import { registerUser } from "../Api.js";

const LoginView = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    role: "author",
  });

  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(registerData);
      alert("Cont creat cu succes! Puteți să vă autentificați.");
      setShowCreateAccount(false);
    } catch (error) {
      alert(error.message);
    }
  };

  if (showCreateAccount) {
    return (
      <div className="login-container">
        <form onSubmit={handleRegisterSubmit} className="login-form">
          <h2>Creare Cont Nou</h2>
          <div className="form-group">
            <label htmlFor="newEmail">Email:</label>
            <input
              type="email"
              id="newEmail"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Parolă:</label>
            <input
              type="password"
              id="newPassword"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol:</label>
            <select
              id="role"
              value={registerData.role}
              onChange={(e) =>
                setRegisterData((prev) => ({ ...prev, role: e.target.value }))
              }
              className="form-select"
            >
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
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
        </div>
        <button type="submit">Login</button>
        <button
          type="button"
          onClick={() => setShowCreateAccount(true)}
          className="secondary-button"
        >
          Creare Cont Nou
        </button>
      </form>
    </div>
  );
};

export default LoginView;
