import ExcelJS from "exceljs";

export async function generarExcelPagos(pagos = []) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Pagos");

  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Cliente", key: "cliente", width: 25 },
    { header: "Monto", key: "monto", width: 15 },
    { header: "Tipo", key: "tipo", width: 15 },
    { header: "Fecha de Pago", key: "fecha_pago", width: 20 },
    { header: "Pagado", key: "pagado", width: 10 },
  ];

  pagos.forEach(p => {
    sheet.addRow({
      id: p.id,
      cliente: p.nombre,
      monto: p.monto,
      tipo: p.tipo,
      fecha_pago: p.fecha_pago,
      pagado: p.pagado ? "Sí" : "No",
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

export async function generarExcelVentas(ventas = []) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Ventas");

  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Cliente", key: "cliente", width: 25 },
    { header: "Producto", key: "producto", width: 25 },
    { header: "Cantidad", key: "cantidad", width: 10 },
    { header: "Fecha", key: "fecha", width: 20 },
  ];

  ventas.forEach(v => {
    sheet.addRow({
      id: v.id,
      cliente: v.cliente,
      producto: v.producto,
      cantidad: v.cantidad,
      fecha: v.fecha,
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}