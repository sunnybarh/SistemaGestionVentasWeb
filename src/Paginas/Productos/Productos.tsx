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
  const [idproducto, setIdProducto] = useState<number | null>(null);
  const [idCategoria, setIdCategoria] = useState<number>(0);
  const [nombreProducto, setNombreProducto] = useState<string>("");
  const [descripcionProducto, setDescripcionProducto] = useState<string>("");
  const [precioProducto, setPrecioProducto] = useState<number>(0);
  const [stockProducto, setStockProducto] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [, setLoading] = useState<boolean>(false);
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
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3311/api/categoria/getCategoria");
      setCategorias(response.data.result);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const getNombreCategoria = (idCat: number) => {
    const cat = categorias.find((c) => c.idCategoria === idCat);
    return cat ? cat.nombreCategoria : "Desconocida";
  };

  //insertar producto
  const handleInsert = async () => {
    if (!nombreProducto || !descripcionProducto || !precioProducto || !stockProducto || !idCategoria) {
      setMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3311/api/producto/insertProducto", {
        idCategoria,
        nombreProducto,
        descripcionProducto,
        precioProducto,
        stockProducto,
      });

      if (response.status === 201) {
        setMessage("Producto agregado exitosamente.");
        await fetchProductos();
        clearFields();
      } else {
        setMessage(response.data.message || "Error al agregar el producto.");
      }
    } catch (error) {
      console.error("Error en la solicitud de inserción:", error);
      setMessage("Hubo un error al insertar el producto.");
    } finally {
      setLoading(false);
    }
  };

  //editar producto
  const handleEdit = async () => {
    if (idproducto && nombreProducto && descripcionProducto && precioProducto && stockProducto && idCategoria) {
      try {
        const response = await axios.put("http://localhost:3311/api/producto/updateProducto", {
          idproducto,
          idCategoria,
          nombreProducto,
          descripcionProducto,
          precioProducto,
          stockProducto,
        });

        setMessage(response.data.message);
        await fetchProductos();
        clearFields();
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        setMessage("Hubo un error al actualizar el producto.");
      }
    }
  };

  //eliminar producto
  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete("http://localhost:3311/api/producto/deleteProducto", {
        data: { idproducto: id },
      });
      setMessage(response.data.message);
      setProductos((prev) => prev.filter((prod) => prod.idproducto !== id));
      clearFields();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setMessage("Hubo un error al eliminar el producto.");
    }
  };

  const handleRowClick = (prod: Producto) => {
    setIdProducto(prod.idproducto);
    setIdCategoria(prod.idCategoria);
    setNombreProducto(prod.nombreProducto);
    setDescripcionProducto(prod.descripcionProducto);
    setPrecioProducto(prod.precioProducto);
    setStockProducto(prod.stockProducto);
  };

  const clearFields = () => {
    setIdProducto(null);
    setIdCategoria(0);
    setNombreProducto("");
    setDescripcionProducto("");
    setPrecioProducto(0);
    setStockProducto(0);
  };

 
  const handleVerCategorias = () => {
    setMostrarCategorias(!mostrarCategorias);
  };


  const handleCategoriaClick = (categoriaId: number) => {
    setIdCategoria(categoriaId); // Coloca el idCategoria en el input
    setMostrarCategorias(false); // Oculta la tabla
  };

  return (
    <div className="menu-producto">
      <header className="menu-prod">
        <button className="btn-back" onClick={() => navigate("/Menu")}>
          Regresar al Menú
        </button>
      </header>

      <div className="producto-container">
        <h2 className="titulo">Productos</h2>

        {message && <p>{message}</p>}

        <div className="formulario">
          <div className="input-group">
            <label>ID Categoría:</label>
            <input
              type="text"
              value={getNombreCategoria(idCategoria)} // Muestra el nombre de la categoría
              readOnly // No editable directamente
            />
            <button onClick={handleVerCategorias}>
              {mostrarCategorias ? "Ocultar Categorías" : "Ver Categorías"}
            </button>
          </div>

          {/* Tabla de categorías visible cuando mostrarCategorias es true */}
          {mostrarCategorias && (
            <table className="tabla-categorias">
              <thead>
                <tr>
                  <th>ID Categoría</th>
                  <th>Nombre Categoría</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.idCategoria} onClick={() => handleCategoriaClick(categoria.idCategoria)}>
                    <td>{categoria.idCategoria}</td>
                    <td>{categoria.nombreCategoria}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="input-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombreProducto}
              onChange={(e) => setNombreProducto(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Descripción:</label>
            <input
              type="text"
              value={descripcionProducto}
              onChange={(e) => setDescripcionProducto(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Precio:</label>
            <input
              type="number"
              value={precioProducto}
              onChange={(e) => setPrecioProducto(parseFloat(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>Stock:</label>
            <input
              type="number"
              value={stockProducto}
              onChange={(e) => setStockProducto(parseInt(e.target.value))}
            />
          </div>

          <div className="input-group">
            <button className="btn-agregar" onClick={handleInsert}>
              Agregar
            </button>
            {idproducto && (
              <button className="btn-editar" onClick={handleEdit}>
                Editar
              </button>
            )}
          </div>
        </div>

        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Categoría</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length > 0 ? (
              productos.map((prod) => (
                <tr key={prod.idproducto} onClick={() => handleRowClick(prod)}>
                  <td>{prod.idproducto}</td>
                  <td>{getNombreCategoria(prod.idCategoria)}</td>
                  <td>{prod.nombreProducto}</td>
                  <td>{prod.descripcionProducto}</td>
                  <td>{prod.precioProducto}</td>
                  <td>{prod.stockProducto}</td>
                  <td>
                    <button className="btn-editar" onClick={() => handleRowClick(prod)}>
                      Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleDelete(prod.idproducto)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No hay productos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="producto-footer">
        <p>© 2025 Papelería La Esquina del Papel. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Productos;
