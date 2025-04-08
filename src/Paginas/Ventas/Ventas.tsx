import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { FacturaPDF } from "../../Componentes/FacturaPDF";
import "./Ventas.css";

interface Producto {
  idproducto: number;
  nombreProducto: string;
  precioProducto: number;
  stockProducto: number;
}

interface ProductoEnVenta {
  idProducto: number;
  nombreProducto: string;
  cantidad: number | string;
  precio: number | string;
  subtotal: string;
}

interface Cliente {
  idcliente: string;
}

const Venta: React.FC = () => {
  const navigate = useNavigate();
  const [idFactura, setIdFactura] = useState<number | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState<number | string>("");
  const [cantidadProducto, setCantidadProducto] = useState<number | string>("");
  const [idProductoSeleccionado, setIdProductoSeleccionado] = useState<number | null>(null);
  const [productosEnVenta, setProductosEnVenta] = useState<ProductoEnVenta[]>([]);
  const [fecha, setFecha] = useState<string>("");
  const [clienteId, setClienteId] = useState("CLIENTE FINAL");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ventaResponse] = await Promise.all([axios.get("http://localhost:3311/api/Venta/getUltimoIdVenta")]);
        setIdFactura(ventaResponse.data.idventa);
        
        // Establecer la fecha de hoy
        const hoy = new Date();
        setFecha(hoy.toISOString().split("T")[0]);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };

    fetchData();
  }, []);

  const handleVerProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3311/api/producto/getProducto");
      setProductos(response.data.result);
      setMostrarTabla(true);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const handleSeleccionarProducto = (producto: Producto) => {
    setNombreProducto(producto.nombreProducto);
    setPrecioProducto(producto.precioProducto);
    setIdProductoSeleccionado(producto.idproducto);
    setMostrarTabla(false);
  };

  const handleAgregarProducto = () => {
    if (!idProductoSeleccionado || !cantidadProducto || !precioProducto) {
      alert("Por favor complete todos los campos del producto");
      return;
    }
    

    const subtotal = Number(cantidadProducto) * Number(precioProducto);
    const nuevoProducto: ProductoEnVenta = {
      idProducto: idProductoSeleccionado,
      nombreProducto,
      cantidad: cantidadProducto,
      precio: precioProducto,
      subtotal: subtotal.toFixed(2),
    };

    setProductosEnVenta([...productosEnVenta, nuevoProducto]);
    resetCamposProducto();
  };

  const handleEliminarProducto = (index: number) => {
    const nuevosProductos = [...productosEnVenta];
    nuevosProductos.splice(index, 1);
    setProductosEnVenta(nuevosProductos);
  };

  const resetCamposProducto = () => {
    setNombreProducto("");
    setPrecioProducto("");
    setCantidadProducto("");
    setIdProductoSeleccionado(null);
  };

  const calcularTotales = () => {
    const subtotal = productosEnVenta.reduce(
      (total, producto) => total + parseFloat(producto.subtotal), 
      0
    );
    const impuesto = subtotal * 0.15;
    const total = subtotal + impuesto;

    return {
      subtotal: subtotal.toFixed(2),
      impuesto: impuesto.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handlePagarVenta = async () => {
    if (!clienteId) {
      alert("Por favor ingrese el ID del cliente");
      return;
    }
  
    if (productosEnVenta.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }
  
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:3311/api/Cliente/getCliente");
      const clientes: Cliente[] = response.data.result; 

      const clienteEncontrado = clientes.find((cliente: Cliente) => cliente.idcliente === clienteId);
  
      if (!clienteEncontrado) {
        alert("El cliente no se encuentra en el sistema");
        return;
      }
  
      const { subtotal, impuesto, total } = calcularTotales();

      for (const producto of productosEnVenta) {
        await axios.post("http://localhost:3311/api/Venta/insertVenta", {
          idventa: idFactura,
          idcliente: clienteId,
          idProducto: producto.idProducto,
          cantidadVenta: producto.cantidad,
          totalVenta: total,
        });
      }

      const blob = await pdf(
        <FacturaPDF
          idFactura={idFactura}
          clienteId={clienteId}
          fecha={fecha}
          productos={productosEnVenta}
          totales={{ subtotal, impuesto, total }}
        />
      ).toBlob();
  
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `factura_${idFactura}PapeleriaLaEsquinadelPapel.pdf`; 
        document.body.appendChild(link);
        link.click();  
        document.body.removeChild(link);  
        URL.revokeObjectURL(url);
  
        alert("Venta procesada exitosamente");
        setIdFactura((prev) => (prev ?? 0) + 1);
        setProductosEnVenta([]);
        setClienteId(clienteId);
      } else {
        console.error("Error: El PDF no se generó correctamente");
        alert("Hubo un problema al generar el archivo PDF.");
      }
    } catch (error) {
      console.error("Error al procesar venta:", error);
      alert("Error al procesar la venta");
    } finally {
      setLoading(false);
    }
  };
  
  const { subtotal, impuesto, total } = calcularTotales();

  return (
    <div className="venta-container">
      <header className="venta-header">
        <button className="btn-back" onClick={() => navigate("/Menu")}>
          &larr; Regresar
        </button>
        <h1 className="page-title">Registro de Ventas</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="venta-content">
        <div className="venta-info">
          <div className="info-group">
            <span className="info-label">Factura #:</span>
            <span className="info-value">{idFactura ?? "Cargando..."}</span>
          </div>
          
          <div className="info-group">
            <label htmlFor="cliente-id" className="info-label">Cliente:</label>
            <input
              id="cliente-id"
              type="text"
              className="info-input"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            />
          </div>
          
          <div className="info-group">
            <label htmlFor="fecha" className="info-label">Fecha:</label>
            <input
              id="fecha"
              type="date"
              className="info-input"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>

        <div className="producto-form">
          <div className="form-row">
            <div className="input-group">
              <label>Producto:</label>
              <div className="producto-selector">
                <input
                  type="text"
                  value={nombreProducto}
                  readOnly
                  placeholder="Seleccione un producto"
                  className="producto-input"
                />
                <button 
                  className="btn-selector"
                  onClick={handleVerProductos}
                  type="button"
                >
                  {mostrarTabla ? "▲" : "▼"}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Cantidad:</label>
              <input
                type="number"
                min="1"
                value={cantidadProducto}
                onChange={(e) => setCantidadProducto(e.target.value)}
                className="cantidad-input"
              />
            </div>

            <div className="input-group">
              <label>Precio Unitario (S/):</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={precioProducto}
                readOnly
                className="precio-input"
              />
            </div>

            <button 
              className="btn-agregar"
              onClick={handleAgregarProducto}
            >
              Agregar
            </button>
          </div>

          {mostrarTabla && (
            <div className="productos-table-container">
              <table className="productos-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
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
                      <td>S/ {(Number(prod.precioProducto) || 0).toFixed(2)}</td>
                      <td>{prod.stockProducto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="venta-detalle">
          <h3>Detalle de Venta</h3>
          <div className="table-container">
            <table className="detalle-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosEnVenta.length > 0 ? (
                  productosEnVenta.map((producto, index) => (
                    <tr key={index}>
                      <td>{producto.idProducto}</td>
                      <td>{producto.nombreProducto}</td>
                      <td>{producto.cantidad}</td>
                      <td>S/ {Number(producto.precio).toFixed(2)}</td>
                      <td>S/ {producto.subtotal}</td>
                      <td>
                        <button
                          className="btn-eliminar"
                          onClick={() => handleEliminarProducto(index)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="no-data">
                      No hay productos agregados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="venta-totales">
          <div className="total-group">
            <span>Subtotal:</span>
            <span>S/ {subtotal}</span>
          </div>
          <div className="total-group">
            <span>IGV (15%):</span>
            <span>S/ {impuesto}</span>
          </div>
          <div className="total-group total-final">
            <span>TOTAL:</span>
            <span>S/ {total}</span>
          </div>
        </div>

        <div className="venta-footer">
          <button 
            className="btn-pagar"
            onClick={handlePagarVenta}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Pagar Venta"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Venta;
