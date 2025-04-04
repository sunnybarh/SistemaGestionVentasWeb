"use client"

import React from "react"
import { useState } from "react"
import "./App.css"

function App() {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Usuario y contraseña son obligatorios.")
      return
    }

    // Clear any previous errors
    setError("")
    console.log("Acceso concedido:", { username }) // Lógica de tu API aquí
  }

  return (
    <div className="app-container">
      {/* Barra de navegación superior */}
      <div className="nav-bar">
        <div className="nav-title"></div>
      </div>

      {/* Contenedor principal centrado */}
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

      {/* Footer */}
      <footer className="app-footer">© 2025 Papelería La Esquina del Papel. Todos los derechos reservados.</footer>
    </div>
  )
}

export default App
