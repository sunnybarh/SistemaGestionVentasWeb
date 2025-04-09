import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

interface ProductoEnVenta {
  idProducto: number;
  nombreProducto: string;
  cantidad: number | string;
  precio: number | string;
  subtotal: string;
}

interface FacturaProps {
  idFactura: number | null;
  clienteId: string;
  fecha: string;
  productos: ProductoEnVenta[];
  totales: {
    subtotal: string;
    impuesto: string;
    total: string;
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#fffcfc", 
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#003366", 
    marginBottom: 15,
  },
  text: {
    fontSize: 12,
    color: "#050505", 
    marginBottom: 5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#219ebc", 
    color: "#ffffff", 
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  tableHeaderCell: {
    width: "20%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#ffffff", 
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #ddd",
    paddingVertical: 8,
  },
 
  cell: {
    width: "20%",
    padding: 5,
    textAlign: "center",
    fontSize: 12,
    color: "#050505", 
  },
  footer: {
    marginTop: 20,
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
    color: "#003366", 
  },
});

export const FacturaPDF: React.FC<FacturaProps> = ({
  idFactura,
  clienteId,
  fecha,
  productos,
  totales
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Papelería La Esquina del Papel{}</Text>
        <Text style={styles.text}>Factura #{idFactura}</Text>
        <Text style={styles.text}>Cliente: {clienteId}</Text>
        <Text style={styles.text}>Fecha: {fecha}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.tableHeader}>
          <Text style={styles.cell}>Productos</Text>
          <Text style={styles.cell}>Cantidad</Text>
          <Text style={styles.cell}>Precio</Text>
          <Text style={styles.cell}>Subtotal</Text>
        </View>

        {productos.map((prod, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.cell}>{prod.nombreProducto}</Text>
            <Text style={styles.cell}>{prod.cantidad}</Text>
            <Text style={styles.cell}>L {prod.precio}</Text>
            <Text style={styles.cell}>L {prod.subtotal}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Subtotal: L {totales.subtotal}</Text>
        <Text style={styles.text}>Impuesto (15%): L {totales.impuesto}</Text>
        <Text style={styles.text}>Total: L {totales.total}</Text>
      </View>
    </Page>
  </Document>
);

export default FacturaPDF;
