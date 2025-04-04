import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Categorias.css";

interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [idCategoria, setIdCategoria] = useState<number | null>(null);
  const [nombreCategoria, setNombreCategoria] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Obtener las categorías al cargar la página
  useEffect(() => {
    axios
      .get("http://localhost:3311/api/categoria/getCategoria")
      .then((response) => {
        setCategorias(response.data.result);
      })
      .catch((error) => {
        console.error("Hubo un error al obtener las categorías:", error);
      });
  }, []);

  // Manejo de la inserción
  const handleInsert = async () => {
    if (!nombreCategoria) {
      setMessage("El nombre de la categoría es obligatorio.");
      return;
    }
  
    try {
      setLoading(true); 
  
      const response = await axios.post("http://localhost:3311/api/categoria/insertCategoria", {
        nombreCategoria,
      });
  
      // Verifica que la respuesta sea válida
      if (response.status === 201) {
        setMessage("Categoría agregada exitosamente.");
        
        const updatedCategorias = await axios.get("http://localhost:3311/api/categoria/getCategoria");
        setCategorias(updatedCategorias.data.result); 
        setNombreCategoria(""); 
      } else {
   
        setMessage(response.data.message || "Hubo un problema al agregar la categoría.");
      }
    } catch (error) {
      console.error("Error en la solicitud de inserción:", error);
      setMessage("Hubo un error al insertar la categoría.");
    } finally {
      setLoading(false);
    }
  };
  
  // Manejo de la edición
  const handleEdit = async () => {
    if (idCategoria && nombreCategoria) {
      try {
        const response = await axios.put("http://localhost:3311/api/categoria/updateCategoria", {
          idCategoria,
          nombreCategoria,
        });
        setMessage(response.data.message);
        setCategorias((prevCategorias) =>
          prevCategorias.map((cat) =>
            cat.idCategoria === idCategoria ? { ...cat, nombreCategoria } : cat
          )
        );
        setIdCategoria(null); 
        setNombreCategoria(""); 
      } catch (error) {
        console.error("Hubo un error al actualizar la categoría:", error);
        setMessage("Hubo un error al actualizar la categoría.");
      }
    }
  };

  // Manejo de la eliminación
  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete("http://localhost:3311/api/categoria/deleteCategoria", {
        data: { idCategoria: id },
      });
      setMessage(response.data.message);
      setCategorias((prevCategorias) =>
        prevCategorias.filter((cat) => cat.idCategoria !== id)
      );
    } catch (error) {
      console.error("Hubo un error al eliminar la categoría:", error);
      setMessage("Hubo un error al eliminar la categoría.");
    }
  };

  // Manejo de la selección de una fila para editar
  const handleRowClick = (id: number, nombre: string) => {
    setIdCategoria(id);
    setNombreCategoria(nombre);
  };

  return (
    <div className="menu-categoria">
      <header className="menu-cate">
        <button className="btn-back" onClick={() => navigate("/Menu")}>
          Regresar al Menú
        </button>
      </header>

      <div className="categoria-container">
        <h2 className="titulo">Categorías</h2>

        {message && <p>{message}</p>}

        <div className="formulario">
          <div className="input-group">
            <label>Categoría:</label>
            <input
              type="text"
              placeholder="Ingrese la categoría"
              value={nombreCategoria}
              onChange={(e) => setNombreCategoria(e.target.value)}
            />
          </div>

          <div className="input-group">
            <button className="btn-agregar" onClick={handleInsert}>
              Agregar
            </button>
            {idCategoria && (
              <button className="btn-editar" onClick={handleEdit}>
                Editar
              </button>
            )}
          </div>
        </div>

        <table className="tabla-categorias">
          <thead>
            <tr>
              <th>ID Categoría</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length > 0 ? (
              categorias.map((cat) => (
                <tr key={cat.idCategoria} onClick={() => handleRowClick(cat.idCategoria, cat.nombreCategoria)}>
                  <td>{cat.idCategoria}</td>
                  <td>{cat.nombreCategoria}</td>
                  <td>
                    <button className="btn-editar" onClick={() => handleRowClick(cat.idCategoria, cat.nombreCategoria)}>
                      Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleDelete(cat.idCategoria)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No hay categorías disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="categoria-footer">
        <p>© 2025 Papelería La Esquina del Papel. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Categorias;