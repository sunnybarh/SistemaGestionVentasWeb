import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Ventas.css";

interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

const Venta: React.FC = () => {
  const navigate = useNavigate();
  const handleRegresarAlMenu = () => navigate("/Menu");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState<number | "">("");
  const [precio, setPrecio] = useState<number | "">("");
  const [cliente, setCliente] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split("T")[0]);

  const handleAgregar = () => {
    if (!nombre || cantidad === "" || precio === "") {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const nuevoProducto: Producto = {
      id: Date.now(),
      nombre,
      cantidad: Number(cantidad),
      precio: Number(precio),
    };

    setProductos([...productos, nuevoProducto]);
    setNombre("");
    setCantidad("");
    setPrecio("");
  };

  const handleEliminar = (id: number) => {
    setProductos(productos.filter((producto) => producto.id !== id));
  };

  const calcularTotal = () => {
    return productos.reduce((total, producto) => total + producto.cantidad * producto.precio, 0);
  };

  return (
    <div className="venta-page">
      {/* Header */}
      <header className="menu-header">
        <button className="btn-back" onClick={handleRegresarAlMenu}>
          Regresar al menú
        </button>
      </header>

      {/* Contenedor principal más separado */}
      <div className="venta-container">
        <h2 className="titulo">Nueva Factura</h2>

        <div className="formulario">
          <div className="input-group">
            <input type="text" placeholder="Nombre del Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
            <input type="text" placeholder="Nombre del Vendedor" value={vendedor} onChange={(e) => setVendedor(e.target.value)} />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Campo de fecha con etiqueta */}
          <div className="input-fecha-container">
            <label htmlFor="fecha">Fecha:</label>
            <input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="input-fecha" />
          </div>

          <div className="input-group">
            <input type="text" placeholder="Nombre del producto" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <input type="number" placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value ? Number(e.target.value) : "")} />
            <input type="number" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value ? Number(e.target.value) : "")} />
          </div>

          <button onClick={handleAgregar}>Agregar Producto</button>
        </div>

        {/* Tabla con cuadros restaurados */}
        <table className="tabla-ventas">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.nombre}</td>
                <td>{producto.cantidad}</td>
                <td>{producto.precio.toFixed(2)}</td>
                <td>{(producto.cantidad * producto.precio).toFixed(2)}</td>
                <td>
                  <button className="btn-eliminar" onClick={() => handleEliminar(producto.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="total">Total: L {calcularTotal().toFixed(2)}</h3>
      </div>

      {/* Footer */}
      <footer className="venta-footer">
        <p>© 2025 Papelería La Esquina del Papel. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Venta;
