"use client"

import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Productos.css"
import { FaEdit, FaTrash } from "react-icons/fa"

// Datos de ejemplo para productos
const productosIniciales = [
  {
    id: 1,
    nombre: "Cuaderno Profesional",
    categoria: "Escritura",
    precio: 15.99,
    stock: 20,
  },
]

const Productos: React.FC = () => {
  const navigate = useNavigate()
  const [productos, setProductos] = useState(productosIniciales)
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  })
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [modoEdicion, setModoEdicion] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNuevoProducto({
      ...nuevoProducto,
      [name]: value,
    })
  }

  const handleAgregarProducto = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.categoria || !nuevoProducto.precio || !nuevoProducto.stock) {
      alert("Por favor complete todos los campos")
      return
    }

    if (modoEdicion && editandoId !== null) {
      // Actualizar producto existente
      setProductos(
        productos.map((producto) =>
          producto.id === editandoId
            ? {
                ...producto,
                nombre: nuevoProducto.nombre,
                categoria: nuevoProducto.categoria,
                precio: Number.parseFloat(nuevoProducto.precio),
                stock: Number.parseInt(nuevoProducto.stock),
              }
            : producto,
        ),
      )
      setModoEdicion(false)
      setEditandoId(null)
    } else {
      // Agregar nuevo producto
      const nuevoId = productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1

      setProductos([
        ...productos,
        {
          id: nuevoId,
          nombre: nuevoProducto.nombre,
          categoria: nuevoProducto.categoria,
          precio: Number.parseFloat(nuevoProducto.precio),
          stock: Number.parseInt(nuevoProducto.stock),
        },
      ])
    }

    // Limpiar el formulario
    setNuevoProducto({
      nombre: "",
      categoria: "",
      precio: "",
      stock: "",
    })
  }

  const handleEditarProducto = (id: number) => {
    const productoAEditar = productos.find((producto) => producto.id === id)

    if (productoAEditar) {
      setNuevoProducto({
        nombre: productoAEditar.nombre,
        categoria: productoAEditar.categoria,
        precio: productoAEditar.precio.toString(),
        stock: productoAEditar.stock.toString(),
      })
      setEditandoId(id)
      setModoEdicion(true)
    }
  }

  const handleCancelarEdicion = () => {
    setNuevoProducto({
      nombre: "",
      categoria: "",
      precio: "",
      stock: "",
    })
    setEditandoId(null)
    setModoEdicion(false)
  }

  const handleEliminarProducto = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      setProductos(productos.filter((producto) => producto.id !== id))

      // Si estamos editando el producto que se va a eliminar, cancelamos la edición
      if (editandoId === id) {
        handleCancelarEdicion()
      }
    }
  }

  return (
    <div className="productos-container">
      {/* HEADER */}
      <header className="productos-header">
        <h1>Productos</h1>
        <button className="volver-menu-button" onClick={() => navigate("/Menu")}>
           Regresar al Menú
        </button>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="productos-content">
        <h2 className="productos-title">Gestión de Productos - Librería</h2>

        {/* Formulario de producto */}
        <div className="producto-form">
          <div className="form-group">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del producto"
              value={nuevoProducto.nombre}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="categoria"
              placeholder="Categoría"
              value={nuevoProducto.categoria}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="precio"
              placeholder="Precio"
              value={nuevoProducto.precio}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="stock"
              placeholder="Stock inicial"
              value={nuevoProducto.stock}
              onChange={handleInputChange}
            />
          </div>

          <button className="agregar-button" onClick={handleAgregarProducto}>
            {modoEdicion ? "Actualizar Producto" : "Agregar Producto"}
          </button>
        </div>

        {/* Tabla de productos */}
        <div className="productos-table-container">
          <table className="productos-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className={editandoId === producto.id ? "fila-editando" : ""}>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>{producto.precio.toFixed(2)}</td>
                  <td>{producto.stock}</td>
                  <td className="acciones-column">
                    <button className="edit-button" onClick={() => handleEditarProducto(producto.id)}>
                      <FaEdit />
                    </button>
                    <button className="delete-button" onClick={() => handleEliminarProducto(producto.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="productos-footer">
        <p>© 2025 Papelería La Esquina del Papel. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default Productos