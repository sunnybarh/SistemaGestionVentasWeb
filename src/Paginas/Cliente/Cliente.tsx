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
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formData, setFormData] = useState<Omit<Cliente, 'idcliente'> & { idcliente: string }>({
    idcliente: "",
    nombreCliente: "",
    apellidoCliente: "",
    direccionCliente: "",
    telefonoCliente: "",
    correoCliente: ""
  });
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:3311/api/Cliente/getCliente");
      setClientes(response.data.result);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      setMessage("Error al cargar los clientes");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInsert = async () => {
    const { idcliente, nombreCliente, apellidoCliente, direccionCliente, telefonoCliente, correoCliente } = formData;
    
    if (!idcliente || !nombreCliente || !apellidoCliente || !direccionCliente || !telefonoCliente || !correoCliente) {
      setMessage("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3311/api/Cliente/insertCliente", formData);

      if (response.status === 201) {
        setMessage("Cliente agregado exitosamente.");
        await fetchClientes();
        clearFields();
      } else {
        setMessage(response.data.message || "Error al agregar el cliente.");
      }
    } catch (error) {
      console.error("Error al insertar cliente:", error);
      setMessage("Error al insertar el cliente");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put("http://localhost:3311/api/Cliente/updateCliente", formData);
      setMessage(response.data.message);
      await fetchClientes();
      clearFields();
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      setMessage("Error al actualizar el cliente");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete("http://localhost:3311/api/Cliente/deleteCliente", {
        data: { idcliente: id }
      });
      setMessage(response.data.message);
      await fetchClientes();
      clearFields();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      setMessage("Error al eliminar el cliente");
    }
  };

  const handleRowClick = (cli: Cliente) => {
    setFormData({
      idcliente: cli.idcliente,
      nombreCliente: cli.nombreCliente,
      apellidoCliente: cli.apellidoCliente,
      direccionCliente: cli.direccionCliente,
      telefonoCliente: cli.telefonoCliente,
      correoCliente: cli.correoCliente
    });
  };

  const clearFields = () => {
    setFormData({
      idcliente: "",
      nombreCliente: "",
      apellidoCliente: "",
      direccionCliente: "",
      telefonoCliente: "",
      correoCliente: ""
    });
  };

  return (
    <div className="cliente-container">
      <header className="cliente-header">
        <button className="btn-back" onClick={() => navigate("/Menu")}>
          &larr; Regresar
        </button>
        <h1 className="page-title">Gestión de Clientes</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="cliente-content">
        {message && (
          <div className={`message-alert ${message.includes("exitosamente") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <section className="form-section">
          <div className="form-card">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="idcliente">DNI:</label>
                <input
                  id="idcliente"
                  name="idcliente"
                  type="text"
                  value={formData.idcliente}
                  onChange={handleInputChange}
                  placeholder="Ingrese DNI"
                />
              </div>

              <div className="input-group">
                <label htmlFor="nombreCliente">Nombres:</label>
                <input
                  id="nombreCliente"
                  name="nombreCliente"
                  type="text"
                  value={formData.nombreCliente}
                  onChange={handleInputChange}
                  placeholder="Ingrese nombres"
                />
              </div>

              <div className="input-group">
                <label htmlFor="apellidoCliente">Apellidos:</label>
                <input
                  id="apellidoCliente"
                  name="apellidoCliente"
                  type="text"
                  value={formData.apellidoCliente}
                  onChange={handleInputChange}
                  placeholder="Ingrese apellidos"
                />
              </div>

              <div className="input-group">
                <label htmlFor="direccionCliente">Dirección:</label>
                <input
                  id="direccionCliente"
                  name="direccionCliente"
                  type="text"
                  value={formData.direccionCliente}
                  onChange={handleInputChange}
                  placeholder="Ingrese dirección"
                />
              </div>

              <div className="input-group">
                <label htmlFor="telefonoCliente">Teléfono:</label>
                <input
                  id="telefonoCliente"
                  name="telefonoCliente"
                  type="text"
                  value={formData.telefonoCliente}
                  onChange={handleInputChange}
                  placeholder="Ingrese teléfono"
                />
              </div>

              <div className="input-group">
                <label htmlFor="correoCliente">Correo:</label>
                <input
                  id="correoCliente"
                  name="correoCliente"
                  type="email"
                  value={formData.correoCliente}
                  onChange={handleInputChange}
                  placeholder="Ingrese correo electrónico"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-primary" 
                onClick={handleInsert}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Agregar Cliente"}
              </button>
              {formData.idcliente && (
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
            <table className="clientes-table">
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length > 0 ? (
                  clientes.map((cli) => (
                    <tr 
                      key={cli.idcliente} 
                      className={formData.idcliente === cli.idcliente ? "active-row" : ""}
                      onClick={() => handleRowClick(cli)}
                    >
                      <td>{cli.idcliente}</td>
                      <td>{cli.nombreCliente}</td>
                      <td>{cli.apellidoCliente}</td>
                      <td>{cli.direccionCliente}</td>
                      <td>{cli.telefonoCliente}</td>
                      <td>{cli.correoCliente}</td>
                      <td className="actions-cell">
                        <button
                          className="btn-action btn-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(cli);
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(cli.idcliente);
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
                      No hay clientes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="cliente-footer">
        <p>© {new Date().getFullYear()} Papelería La Esquina del Papel. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Cliente;