import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Productos.css";

interface Producto {
  idproducto: number;
  idCategoria: number;
  nombreProducto: string;
  descripcionProducto: string;
  precioProducto: number;
  stockProducto: number;
}

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [formData, setFormData] = useState<Omit<Producto, 'idproducto'> & { idproducto: number | null }>({
    idproducto: null,
    idCategoria: 0,
    nombreProducto: "",
    descripcionProducto: "",
    precioProducto: 0,
    stockProducto: 0
  });
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [mostrarCategorias, setMostrarCategorias] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3311/api/producto/getProducto");
      setProductos(response.data.result);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      setMessage("Error al cargar los productos");
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3311/api/categoria/getCategoria");
      setCategorias(response.data.result);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
      setMessage("Error al cargar las categorías");
    }
  };

  const getNombreCategoria = (idCat: number) => {
    const cat = categorias.find((c) => c.idCategoria === idCat);
    return cat ? cat.nombreCategoria : "Desconocida";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'precioProducto' || name === 'stockProducto' 
        ? Number(value) 
        : value 
    }));
  };

  const handleInsert = async () => {
    const { idCategoria, nombreProducto, descripcionProducto, precioProducto, stockProducto } = formData;
    
    if (!nombreProducto || !descripcionProducto || !precioProducto || !stockProducto || !idCategoria) {
      setMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3311/api/producto/insertProducto", formData);

      if (response.status === 201) {
        setMessage("Producto agregado exitosamente.");
        await fetchProductos();
        clearFields();
      } else {
        setMessage(response.data.message || "Error al agregar el producto.");
      }
    } catch (error) {
      console.error("Error al insertar producto:", error);
      setMessage("Error al insertar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put("http://localhost:3311/api/producto/updateProducto", formData);
      setMessage(response.data.message);
      await fetchProductos();
      clearFields();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setMessage("Error al actualizar el producto");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete("http://localhost:3311/api/producto/deleteProducto", {
        data: { idproducto: id }
      });
      setMessage(response.data.message);
      setProductos(prev => prev.filter(prod => prod.idproducto !== id));
      clearFields();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setMessage("Error al eliminar el producto");
    }
  };

  const handleRowClick = (prod: Producto) => {
    setFormData({
      idproducto: prod.idproducto,
      idCategoria: prod.idCategoria,
      nombreProducto: prod.nombreProducto,
      descripcionProducto: prod.descripcionProducto,
      precioProducto: prod.precioProducto,
      stockProducto: prod.stockProducto
    });
  };

  const clearFields = () => {
    setFormData({
      idproducto: null,
      idCategoria: 0,
      nombreProducto: "",
      descripcionProducto: "",
      precioProducto: 0,
      stockProducto: 0
    });
  };

  const handleVerCategorias = () => {
    setMostrarCategorias(!mostrarCategorias);
  };

  const handleCategoriaClick = (categoriaId: number) => {
    setFormData(prev => ({ ...prev, idCategoria: categoriaId }));
    setMostrarCategorias(false);
  };

  return (
    <div className="producto-container">
      <header className="producto-header">
        <button className="btn-back" onClick={() => navigate("/Menu")}>
          &larr; Regresar
        </button>
        <h1 className="page-title">Productos</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="producto-content">
        {message && (
          <div className={`message-alert ${message.includes("exitosamente") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <section className="form-section">
          <div className="form-card">
            <div className="form-grid">
              <div className="input-group">
                <label>Categoría:</label>
                <div className="categoria-selector">
                  <input
                    type="text"
                    value={getNombreCategoria(formData.idCategoria)}
                    readOnly
                    className="categoria-input"
                    placeholder="Seleccione una categoría"
                  />
                  <button 
                    className="btn-categoria"
                    onClick={handleVerCategorias}
                    type="button"
                  >
                    {mostrarCategorias ? "▲" : "▼"}
                  </button>
                </div>
                
                {mostrarCategorias && (
                  <div className="categorias-dropdown">
                    <table className="categorias-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categorias.map((categoria) => (
                          <tr 
                            key={categoria.idCategoria} 
                            onClick={() => handleCategoriaClick(categoria.idCategoria)}
                          >
                            <td>{categoria.idCategoria}</td>
                            <td>{categoria.nombreCategoria}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="nombreProducto">Nombre:</label>
                <input
                  id="nombreProducto"
                  name="nombreProducto"
                  type="text"
                  value={formData.nombreProducto}
                  onChange={handleInputChange}
                  placeholder="Nombre del producto"
                />
              </div>

              <div className="input-group">
                <label htmlFor="descripcionProducto">Descripción:</label>
                <input
                  id="descripcionProducto"
                  name="descripcionProducto"
                  type="text"
                  value={formData.descripcionProducto}
                  onChange={handleInputChange}
                  placeholder="Descripción del producto"
                />
              </div>

              <div className="input-group">
                <label htmlFor="precioProducto">Precio (L):</label>
                <input
                  id="precioProducto"
                  name="precioProducto"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.precioProducto}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>

              <div className="input-group">
                <label htmlFor="stockProducto">Stock:</label>
                <input
                  id="stockProducto"
                  name="stockProducto"
                  type="number"
                  min="0"
                  value={formData.stockProducto}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-primary" 
                onClick={handleInsert}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Agregar Producto"}
              </button>
              {formData.idproducto && (
                <button 
                  className="btn btn-secondary" 
                  onClick={handleEdit}
                  disabled={loading}
                >
                  Guardar Cambios
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="table-section">
          <div className="table-responsive">
            <table className="productos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Categoría</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio (L)</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.length > 0 ? (
                  productos.map((prod) => (
                    <tr 
                      key={prod.idproducto} 
                      className={formData.idproducto === prod.idproducto ? "active-row" : ""}
                      onClick={() => handleRowClick(prod)}
                    >
                      <td>{prod.idproducto}</td>
                      <td>{getNombreCategoria(prod.idCategoria)}</td>
                      <td>{prod.nombreProducto}</td>
                      <td>{prod.descripcionProducto}</td>
                      <td>{Number(prod.precioProducto).toFixed(2)}</td>
                      <td>{prod.stockProducto}</td>
                      <td className="actions-cell">
                        <button
                          className="btn-action btn-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(prod);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(prod.idproducto);
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="no-data">
                      No hay productos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="producto-footer">
        <p>© {new Date().getFullYear()} Papelería La Esquina del Papel. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Productos;