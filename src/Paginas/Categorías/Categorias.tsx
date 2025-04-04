import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Categorias.css";

interface Categoria {
  idCategoria: number;
  categoria: string;
}

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [idCategoria, setIdCategoria] = useState<string>("");
  const [categoria, setCategoria] = useState("");
  const [editando, setEditando] = useState<boolean>(false);
  const [categoriaEditada, setCategoriaEditada] = useState<Categoria | null>(null);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleAgregar = () => {
    if (idCategoria !== "" && categoria !== "") {
      const idNumber = Number(idCategoria);

      if (isNaN(idNumber) || idNumber <= 0) {
        setError("El Id de la categoría debe ser un número mayor que 0.");
        return;
      }

      if (editando && categoriaEditada) {
        setCategorias(
          categorias.map((cat) =>
            cat.idCategoria === categoriaEditada.idCategoria
              ? { idCategoria: categoriaEditada.idCategoria, categoria }
              : cat
          )
        );
        setEditando(false);
        setCategoriaEditada(null);
      } else {
        setCategorias([...categorias, { idCategoria: idNumber, categoria }]);
      }
      setIdCategoria("");
      setCategoria("");
      setError(""); 
    } else {
      setError("Los campos no deben estar vacíos.");
    }
  };

  const handleEliminar = (id: number) => {
    setCategorias(categorias.filter((cat) => cat.idCategoria !== id));
  };

  const handleEditar = (cat: Categoria) => {
    setIdCategoria(cat.idCategoria.toString());
    setCategoria(cat.categoria);
    setEditando(true);
    setCategoriaEditada(cat);
  };

  return (
    <div className="menu-categoria" >
        <header className="menu-cate">
      <button className="btn-back" onClick={() => navigate("/")}>
        Regresar al Menú
      </button>
      </header>
      
      <div className="categoria-container">
        <h2 className="titulo">Categorías</h2>
        <div className="formulario">
          <div className="input-group">
            <label>ID Categoría:</label>
            <input
              type="number"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              placeholder="Ingrese el ID"
              min="1" 
            />
          </div>

          <div className="input-group">
            <label>Categoría:</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Ingrese la categoría"
            />
          </div>

          {error && <p className="error">{error}</p>}

          <div className="input-group">
            <button onClick={handleAgregar}>
              {editando ? "Actualizar" : "Ingresar"}
            </button>
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
            {categorias.map((cat) => (
              <tr key={cat.idCategoria}>
                <td>{cat.idCategoria}</td>
                <td>{cat.categoria}</td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => handleEditar(cat)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleEliminar(cat.idCategoria)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* FOOTER */}
      <footer className="categoria-footer">
        <p>© 2025 Papelería La Esquina del Papel. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Categorias;
