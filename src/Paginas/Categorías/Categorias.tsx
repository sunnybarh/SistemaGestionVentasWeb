import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Categorias.css";

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombreCategoria, setnombreCategoria] = useState<string>("");
  const [idCategoria, setIdCategoria] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://localhost:3311/api/categoria/getCategoria");
      setCategorias(response.data.result);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleInsert = async () => {
    if (!nombreCategoria) {
      setMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3311/api/categoria/insertCategoria", {
        idCategoria,
        nombreCategoria,
      });

      if (response.status === 201) {
        setMessage("Categoría agregada exitosamente.");
        await fetchCategorias();
        clearFields();
      } else {
        setMessage(response.data.message || "Error al agregar la categoría.");
      }
    } catch (error) {
      console.error("Error en la solicitud de inserción:", error);
      setMessage("Hubo un error al insertar la categoría.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (nombreCategoria && idCategoria) {
      try {
        const response = await axios.put("http://localhost:3311/api/categoria/updateCategoria", {
          idCategoria,
          nombreCategoria,
        });

        setMessage(response.data.message);
        await fetchCategorias();
        clearFields();
      } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        setMessage("Hubo un error al actualizar la categoría.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete("http://localhost:3311/api/categoria/deleteCategoria", {
        data: { idCategoria: id },
      });
      setMessage(response.data.message);
      await fetchCategorias();
      clearFields();
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      setMessage("Hubo un error al eliminar la categoría.");
    }
  };

  const handleRowClick = (cat: Categoria) => {
    setIdCategoria(cat.idCategoria);
    setnombreCategoria(cat.nombreCategoria);
  };

  const clearFields = () => {
    setIdCategoria(0);
    setnombreCategoria("");
  };

  return (
    <div className="menu-categorias">
      <header className="menu-prod">
        <button className="btn-back" onClick={() => navigate("/Menu")}>
          &larr; Regresar
        </button>
        <h1 className="page-title">Categorías</h1>
        <div className="header-spacer"></div>
      </header>
  
      <div className="contenido">
        {message && <div className="message-alert">{message}</div>}
  
        <div className="form-container">
          <div className="form-card">
            <div className="input-group">
              <label htmlFor="idCategoria">ID Categoría:</label>
              <input
                id="idCategoria"
                type="text"
                value={idCategoria || ""}
                onChange={(e) => setIdCategoria(Number(e.target.value))}
                className="id-input"
                readOnly
              />
            </div>

            <div className="input-group">
              <label htmlFor="nombreCategoria">Nombre de Categoría:</label>
              <input
                id="nombreCategoria"
                type="text"
                value={nombreCategoria}
                onChange={(e) => setnombreCategoria(e.target.value)}
              />
            </div>
  
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleInsert}>
                Agregar Categoría
              </button>
              {idCategoria > 0 && (
                <button className="btn btn-secondary" onClick={handleEdit}>
                  Guardar Cambios
                </button>
              )}
            </div>
          </div>
        </div>
  
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length > 0 ? (
                categorias.map((cat) => (
                  <tr 
                    key={cat.idCategoria} 
                    className={idCategoria === cat.idCategoria ? "active-row" : ""}
                  >
                    <td>{cat.idCategoria}</td>
                    <td>{cat.nombreCategoria}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleRowClick(cat)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(cat.idCategoria)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="no-data">
                    No hay categorías disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
  
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Papelería La Esquina del Papel. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Categorias;