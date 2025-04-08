"use strict";

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import Menu from "../Menu/Menu"; 
import Categorias from "../Categorías/Categorias";
import Productos from "../Productos/Productos";
import Ventas from "../Ventas/Ventas";
import Cliente from "../Cliente/Cliente";
import "./App.css";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3311/api/Login/SignIn", {
        user: username,
        password: password,
      });

      if (response.status === 200) {
        console.log("Login exitoso:", response.data);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", response.data.user);
        localStorage.setItem("rol", response.data.rol);

        navigate("/menu");
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Error al conectar con el servidor");
      }
    }
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
        <Route path="/cliente" element={<Cliente/>} />
      </Routes>
    </Router>
  );
}

export default App;