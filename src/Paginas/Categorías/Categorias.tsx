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
    if ( !nombreCategoria) {
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
        setMessage("Categoria agregada exitosamente.");
        await fetchCategorias();
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
        console.error("Error al actualizar el producto:", error);
        setMessage("Hubo un error al actualizar el producto.");
      }
    }
  };

  //funcion para eliminar
  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete("http://localhost:3311/api/categoria/deleteCategoria", {
        data: { idCategoria: id },
      });
      setMessage(response.data.message);
      await fetchCategorias();
      clearFields();//borra los campos
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      setMessage("Hubo un error al eliminar la categoría.");
    }
  };

  //mandar a la tabla
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
          Regresar al Menú
        </button>
      </header>
  
      <div className="categorias-container">
        <h2 className="titulo">Categorias</h2>
  
        {message && <p>{message}</p>}
  
        <div className="formulario">
          <div className="input-group">
            <label>ID Categoría:</label>
            
          </div>
  
          <div className="input-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombreCategoria}
              onChange={(e) => setnombreCategoria(e.target.value)}
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
              <th>ID</th>
              <th>Nombre de Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length > 0 ? (
              categorias.map((cat) => (
                <tr key={cat.idCategoria}>
                  <td>{cat.idCategoria}</td>
                  <td>{cat.nombreCategoria}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => handleRowClick(cat)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleDelete(cat.idCategoria)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>No hay productos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      <footer className="categorias-footer">
        <p>© 2025 Papelería La Esquina del Papel. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}  
export default Categorias;
