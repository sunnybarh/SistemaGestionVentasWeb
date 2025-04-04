"use client";

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Menu from "../Menu/Menu"; 
import Categorias from "../Categorías/Categorias";
import Productos from "../Productos/Productos";
import Ventas from "../Ventas/Ventas";
import "./App.css";


const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    setError("");
    console.log("Acceso concedido:", { username });

    navigate("/menu");
  };

  return (
    <div className="app-container">
      <div className="nav-bar">
        <div className="nav-title"></div>
      </div>

      <div className="main-content">
        <div className="login-container">
          <div className="login-header">
            <h1>Papelería La Esquina del Papel</h1>
            <br />
            <br />
            <h2>Iniciar Sesión</h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}

            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={!username && error ? "input-error" : ""}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={!password && error ? "input-error" : ""}
            />

            <button type="submit">Ingresar</button>
          </form>
        </div>
      </div>

      <footer className="app-footer">
        © 2025 Papelería La Esquina del Papel. Todos los derechos reservados.
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/categoria" element={<Categorias />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/venta" element={<Ventas />} />
      </Routes>
    </Router>
  );
}

export default App;
