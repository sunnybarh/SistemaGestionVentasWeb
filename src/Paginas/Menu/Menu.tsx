import React from "react";
import { Link } from "react-router-dom";
import { FaTags, FaUser, FaBox, FaShoppingCart } from "react-icons/fa";
import "../Menu/Menu.css";

const Menu: React.FC = () => {
  const handleLogout = () => {
    alert("Cerrando sesión...");
  };

  return (
    <div className="menu-container">
      {/* HEADER */}
      <header className="menu-header">
        <h1>Menú</h1>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </header>

      {/* MENÚ PRINCIPAL */}
      <h2 className="menu-title">Papelería La Esquina del Papel</h2>
      <div className="menu-buttons">
        <Link to="/categoria" className="menu-button">
          <span className="menu-icon">
            <FaTags />
          </span>
          Categorías
        </Link>
        <Link to="/cliente" className="menu-button">
          <span className="menu-icon">
            <FaUser />
          </span>
          Clientes
        </Link>
        <Link to="/productos" className="menu-button">
          <span className="menu-icon">
            <FaBox />
          </span>
          Productos
        </Link>
        <Link to="/venta" className="menu-button">
          <span className="menu-icon">
            <FaShoppingCart />
          </span>
          Ventas
        </Link>
      </div>

      {/* FOOTER */}
      <footer className="menu-footer">
        <p>© 2025 Papelería La Esquina del Papel. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Menu;