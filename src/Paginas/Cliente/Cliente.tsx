import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./cliente.css";

interface Cliente {
  idcliente: string;
  nombreCliente: string;
  apellidoCliente: string;
  direccionCliente: string;
  telefonoCliente: string;
  correoCliente: string;
}

const Cliente: React.FC = () => {
  const [cliente, setcliente] = useState<Cliente[]>([]);
  const [idcliente, setidcliente] = useState<string>("");
  const [nombreCliente, setNombreCliente] = useState<string>("");
  const [apellidoCliente, setApellidoCliente] = useState<string>("");
  const [direccionCliente, setDireccionCliente] = useState<string>("");
  const [telefonoCliente, setTelefonoCliente] = useState<string>("");
  const [correoCliente, setCorreoCliente] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCliente();
  }, []);

  const fetchCliente = async () => {
    try {
      const response = await axios.get("http://localhost:3311/api/Cliente/getCliente");
      setcliente(response.data.result);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
    }
  };


  //insertar producto
  const handleInsert = async () => {
    if (!idcliente || !apellidoCliente || !direccionCliente || !telefonoCliente || !correoCliente) {
      setMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3311/api/Cliente/insertCliente", {
        idcliente,
        nombreCliente,
        apellidoCliente,
        direccionCliente,
        telefonoCliente,
        correoCliente,
      });

      if (response.status === 201) {
        setMessage("Cliente agregado exitosamente.");
        await fetchCliente();
        clearFields();
      } else {
        setMessage(response.data.message || "Error al agregar el cliente.");
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
    if (idcliente && nombreCliente && apellidoCliente && direccionCliente && telefonoCliente && correoCliente) {
      try {
        const response = await axios.put("http://localhost:3311/api/Cliente/updateCliente", {
          idcliente,
          nombreCliente,
          apellidoCliente,
          direccionCliente,
          telefonoCliente,
          correoCliente,
        });

        setMessage(response.data.message);
        await fetchCliente();
        clearFields();
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        setMessage("Hubo un error al actualizar el producto.");
      }
    }
  };

  //eliminar producto
  const handleDelete = async (cli: string) => {
    try {
      const response = await axios.delete("http://localhost:3311/api/Cliente/deleteCliente", {
        data: { idcliente: cli },
      });
      setMessage(response.data.message);
      await fetchCliente();
      clearFields();//borra los campos
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      setMessage("Hubo un error al eliminar el cliente.");
    }
  };

  const handleRowClick = (cli: Cliente) => {
    setidcliente(cli.idcliente);
    setNombreCliente(cli.nombreCliente);
    setApellidoCliente(cli.apellidoCliente);
    setDireccionCliente(cli.direccionCliente);
    setTelefonoCliente(cli.telefonoCliente);
    setCorreoCliente(cli.correoCliente);
  };

  const clearFields = () => {
    setidcliente("");
    setNombreCliente("");
    setApellidoCliente("");
    setDireccionCliente("");
    setTelefonoCliente("");
    setCorreoCliente("");
  };

  return (
    <div className="menu-producto">
      <header className="menu-prod">
        <button className="btn-back" onClick={() => navigate("/Menu")}>
          Regresar al Menú
        </button>
      </header>

      <div className="producto-container">
        <h2 className="titulo">CLIENTES</h2>

        {message && <p>{message}</p>}

        <div className="formulario">

          <div className="input-group">
            <label>ID Cliente:</label>
            <input
              type="text"
              value={idcliente}
              onChange={(e) => setidcliente(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Apellido:</label>
            <input
              type="text"
              value={apellidoCliente}
              onChange={(e) => setApellidoCliente(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Dirección:</label>
            <input
              type="text"
              value={direccionCliente}
              onChange={(e) => setDireccionCliente(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Teléfono:</label>
            <input
              type="text"
              value={telefonoCliente}
              onChange={(e) => setTelefonoCliente(e.target.value)}
            />
          </div>
          
          <div className="input-group">
            <label>Correo:</label>
            <input
              type="text"
              value={correoCliente}
              onChange={(e) => setCorreoCliente(e.target.value)}
            />
          </div>


          <div className="input-group">
            <button className="btn-agregar" onClick={handleInsert}>
              Agregar
            </button>
            {idcliente && (
              <button className="btn-editar" onClick={handleEdit}>
                Editar
              </button>
            )}
          </div>
        </div>

        <table className="tabla-productos">
          <thead>
            <tr>
              <th>DNI</th>
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>DIRECCIÓN</th>
              <th>TELEFONO</th>
              <th>CORREO</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cliente.length > 0 ? (
              cliente.map((cli) => (
                <tr key={cli.idcliente} onClick={() => handleRowClick(cli)}>
                  <td>{cli.idcliente}</td>
                  <td>{cli.nombreCliente}</td>
                  <td>{cli.apellidoCliente}</td>
                  <td>{cli.direccionCliente}</td>
                  <td>{cli.telefonoCliente}</td>
                  <td>{cli.correoCliente}</td>
                  <td>
                    <button className="btn-editar" onClick={() => handleRowClick(cli)}>
                      Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleDelete(cli.idcliente)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No existen clientes.</td>
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

export default Cliente;
