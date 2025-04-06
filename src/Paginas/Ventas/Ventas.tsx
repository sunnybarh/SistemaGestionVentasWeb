import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Ventas.css";

const Venta: React.FC = () => {
  const navigate = useNavigate();
  const handleRegresarAlMenu = () => navigate("/Menu");

  const [idFactura, setIdFactura] = useState<number | null>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState<number | string>("");
  const [cantidadProducto, setCantidadProducto] = useState<number | string>("");
  const [idProductoSeleccionado, setIdProductoSeleccionado] = useState<
    number | null
  >(null);
  const [productosEnVenta, setProductosEnVenta] = useState<any[]>([]);
  const [fecha, setFecha] = useState<string>("");
  const [clienteId, setClienteId] = useState("CLIENTE FINAL");


  
  useEffect(() => {
    axios
      .get("http://localhost:3311/api/Venta/getUltimoIdVenta")
      .then((res) => {
        setIdFactura(res.data.idventa);
      })
      .catch((err) => console.error("Error al obtener ID de factura:", err));

    // Establecer la fecha de hoy al cargar el componente
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    setFecha(fechaFormateada);
  }, []);

  
  const handleVerProductos = () => {
    axios
      .get("http://localhost:3311/api/producto/getProducto")
      .then((res) => {
        setProductos(res.data.result);
        setMostrarTabla(true); // Mostrar la tabla
      })
      .catch((err) => console.error("Error al obtener productos:", err));
  };

  
  const handleSeleccionarProducto = (producto: any) => {
    setNombreProducto(producto.nombreProducto);
    setPrecioProducto(producto.precioProducto);
    setIdProductoSeleccionado(producto.idproducto);
    setMostrarTabla(false); 
  };

  // Agregar el producto a la lista de productos en venta
  const handleAgregarProducto = () => {
    if (idProductoSeleccionado && cantidadProducto && precioProducto) {
      const subtotal =
        parseFloat(cantidadProducto.toString()) *
        parseFloat(precioProducto.toString());
      const nuevoProducto = {
        idProducto: idProductoSeleccionado,
        nombreProducto,
        cantidad: cantidadProducto,
        precio: precioProducto,
        subtotal: subtotal.toFixed(2),
      };
      setProductosEnVenta([...productosEnVenta, nuevoProducto]);
      setNombreProducto("");
      setCantidadProducto("");
      setPrecioProducto("");
      setIdProductoSeleccionado(null);
    }
  };

  // Eliminar producto de la lista de productos en venta
  const handleEliminarProducto = (index: number) => {
    const productosActualizados = productosEnVenta.filter(
      (_, i) => i !== index
    );
    setProductosEnVenta(productosActualizados);
  };

  // Calcular el total
  const subtotalTotal = productosEnVenta
    .reduce((total, producto) => total + parseFloat(producto.subtotal), 0)
    .toFixed(2);
  const impuesto = (parseFloat(subtotalTotal) * 0.15).toFixed(2);
  const totalConImpuesto = (
    parseFloat(subtotalTotal) + parseFloat(impuesto)
  ).toFixed(2);

  // Función para procesar el pago y guardar la venta
  const handlePagarVenta = async () => {
    try {
      if (!clienteId) {
        alert("Por favor ingrese el ID del cliente.");
        return;
      }
      const idCliente = clienteId;
      const idVenta = idFactura;

      for (const producto of productosEnVenta) {
        const data = {
          idventa: idVenta,  
          idcliente: idCliente,
          idProducto: producto.idProducto,
          cantidadVenta: producto.cantidad,
          totalVenta: totalConImpuesto,  
        };
        await axios.post("http://localhost:3311/api/Venta/insertVenta", data);
      }
  
      alert("Venta procesada exitosamente.");
  
      // Iincrementar idventa para la próxima venta
      setIdFactura((prevId) => (prevId ?? 0) + 1);
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      alert("Ocurrió un error al procesar la venta.");
    }

    setClienteId("");
    setNombreProducto("");
    setPrecioProducto("");
    setCantidadProducto("");
    setProductosEnVenta([]);
    setMostrarTabla(false);
  };
  

  return (
    <div className="venta-page">
      <header className="menu-header">
        <button className="btn-back" onClick={handleRegresarAlMenu}>
          Regresar al Menú
        </button>
      </header>
      <div className="venta-container">
        <h2 className="titulo">Nueva Factura</h2>

        <div className="formulario">
          <label
            style={{ color: "black", fontWeight: "bold", display: "block" }}
          >
            # Factura: {idFactura ?? "Cargando..."}
          </label>

          <label htmlFor="cliente-id" style={{ fontWeight: "bold" }}>
            Id cliente
          </label>
          <div className="input-group">
            <input
              id="cliente-id"
              type="text"
              placeholder="CLIENTE FINAL"
              value={clienteId} 
              onChange={(e) => setClienteId(e.target.value)} 
            />
          </div>

          <div className="input-fecha-container">
            <label htmlFor="fecha">Fecha:</label>
            <input
              id="fecha"
              type="date"
              className="input-fecha"
              value={fecha} 
              onChange={(e) => setFecha(e.target.value)} 
            />
          </div>

          <div className="input-productos-group">
            <div className="input-group">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={nombreProducto}
                readOnly
              />
              <button
                className="btn-ver-productos"
                onClick={handleVerProductos}
              >
                Ver productos
              </button>
              <input
                type="number"
                placeholder="Cantidad"
                value={cantidadProducto}
                onChange={(e) => setCantidadProducto(e.target.value)}
              />
              <input
                type="number"
                placeholder="Precio"
                value={precioProducto}
                readOnly
              />
            </div>
          </div>

          <button onClick={handleAgregarProducto}>Agregar Producto</button>
        </div>

        {/* Mostrar la tabla de productos justo debajo del botón */}
        {mostrarTabla && (
          <div className="mini-tabla-container">
            <table className="tabla-mini">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((prod) => (
                  <tr
                    key={prod.idproducto}
                    onClick={() => handleSeleccionarProducto(prod)}
                  >
                    <td>{prod.idproducto}</td>
                    <td>{prod.nombreProducto}</td>
                    <td>{prod.precioProducto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mostrar la tabla con los productos seleccionados */}
        <table className="tabla-ventas">
          <thead>
            <tr>
              <th>Id del producto</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productosEnVenta.map((producto, index) => {
              const precio = parseFloat(producto.precio);
              const precioFormateado = precio.toFixed(2);

              return (
                <tr key={index}>
                  <td>{producto.idProducto}</td>
                  <td>{producto.nombreProducto}</td>
                  <td>{producto.cantidad}</td>
                  <td>{precioFormateado}</td>
                  <td>{producto.subtotal}</td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleEliminarProducto(index)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="totales">
          <h3>Total: ${subtotalTotal}</h3>
          <h3>Impuesto (15%): ${impuesto}</h3>
          <h3>Total con Impuesto: ${totalConImpuesto}</h3>
        </div>

        <button className="btn-pagar" onClick={handlePagarVenta}>
          Pagar Venta
        </button>
      </div>
    </div>
  );
};

export default Venta;
