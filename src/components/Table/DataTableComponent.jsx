import React, { useEffect, useRef, useState } from "react";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Button, Tooltip } from "@mui/material";
import { IconFile, IconFileSpreadsheet, IconSearch } from "@tabler/icons";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Box } from "@mui/system";
// import { ProductService } from "./service/ProductService";

export default function RowEditingDemo() {
   const [products, setProducts] = useState([
      {
         id: "1000",
         code: "f230fh0g3",
         name: "Bamboo Watch",
         description: "Product Description",
         image: "bamboo-watch.jpg",
         price: 65,
         category: "Accessories",
         quantity: 24,
         inventoryStatus: "INSTOCK",
         rating: 5
      },
      {
         id: "1001",
         code: "f230fh0g3",
         name: "Bamboo Watch",
         description: "Product Description",
         image: "bamboo-watch.jpg",
         price: 65,
         category: "Accessories",
         quantity: 24,
         inventoryStatus: "INSTOCK",
         rating: 5
      },
      {
         id: "1002",
         code: "f230fh0g3",
         name: "Bamboo Watch",
         description: "Product Description",
         image: "bamboo-watch.jpg",
         price: 65,
         category: "Accessories",
         quantity: 24,
         inventoryStatus: "INSTOCK",
         rating: 5
      }
   ]);
   const dt = useRef(null);
   const [statuses] = useState(["INSTOCK", "LOWSTOCK", "OUTOFSTOCK"]);

   useEffect(() => {
      // ProductService.getProductsMini().then((data) => setProducts(data));
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   const getSeverity = (value) => {
      switch (value) {
         case "INSTOCK":
            return "success";

         case "LOWSTOCK":
            return "warning";

         case "OUTOFSTOCK":
            return "danger";

         default:
            return null;
      }
   };

   const onRowEditComplete = (e) => {
      let _products = [...products];
      let { newData, index } = e;

      _products[index] = newData;

      setProducts(_products);
   };

   const textEditor = (options) => {
      return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
   };

   const statusEditor = (options) => {
      return (
         <Dropdown
            value={options.value}
            options={statuses}
            onChange={(e) => options.editorCallback(e.value)}
            placeholder="Select a Status"
            itemTemplate={(option) => {
               return <Tag value={option} severity={getSeverity(option)}></Tag>;
            }}
         />
      );
   };

   const priceEditor = (options) => {
      return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />;
   };

   const statusBodyTemplate = (rowData) => {
      return <Tag value={rowData.inventoryStatus} severity={getSeverity(rowData.inventoryStatus)}></Tag>;
   };

   const priceBodyTemplate = (rowData) => {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(rowData.price);
   };

   const columns = [
      { field: "code", header: "Code", functionEdit: textEditor, body: null },
      { field: "name", header: "Name", functionEdit: textEditor, body: null },
      { field: "inventoryStatus", header: "Status", functionEdit: statusEditor, body: statusBodyTemplate },
      { field: "price", header: "Price", functionEdit: priceEditor, body: priceBodyTemplate }
   ];

   //#region EXPORTAR
   const exportColumns = columns.map((col) => ({ title: col.header, dataKey: col.field }));

   const exportCSV = (selectionOnly) => {
      dt.current.exportCSV({ selectionOnly });
   };

   const exportPdf = () => {
      import("jspdf").then((jsPDF) => {
         import("jspdf-autotable").then(() => {
            const doc = new jsPDF.default(0, 0);

            doc.autoTable(exportColumns, products);
            doc.save("products.pdf");
         });
      });
   };

   const exportExcel = () => {
      import("xlsx").then((xlsx) => {
         const worksheet = xlsx.utils.json_to_sheet(products);
         const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
         const excelBuffer = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "array"
         });

         saveAsExcelFile(excelBuffer, "products");
      });
   };

   const saveAsExcelFile = (buffer, fileName) => {
      import("file-saver").then((module) => {
         if (module && module.default) {
            let EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            let EXCEL_EXTENSION = ".xlsx";
            const data = new Blob([buffer], {
               type: EXCEL_TYPE
            });

            module.default.saveAs(data, fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION);
         }
      });
   };

   const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      "country.name": { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
      balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
   });
   const [globalFilter, setGlobalFilter] = useState("");
   const [globalFilterValue, setGlobalFilterValue] = useState("");
   const onGlobalFilterChange = (e) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters["global"].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
   };

   const header = (
      // <div className="flex align-items-center justify-content-end gap-2">
      <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", alignItems: "center" }}>
         {/* <h4 className="m-0">Customers</h4> */}
         <span className="p-input-icon-left">
            <IconSearch />
            {/* <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscador general" /> */}
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscador general..." />
         </span>
         {/* <Tooltip title="Exportar a CSV" placement="top">
            <Button type="button" variant="contained" color="primary" sx={{ borderRadius: "12px", mr: 1 }} onClick={() => exportCSV(false)} data-pr-tooltip="CSV">
            <IconFile />
            </Button>
         </Tooltip> */}
         <Tooltip title="Exportar a Excel" placement="top">
            <Button type="button" variant="text" color="success" sx={{ borderRadius: "12px", mr: 1 }} onClick={exportExcel}>
               <IconFileSpreadsheet />
            </Button>
         </Tooltip>

         <Tooltip title="Exportar a PDF" placement="top">
            <Button type="button" variant="text" color="error" sx={{ borderRadius: "12px", mr: 1 }} onClick={exportPdf}>
               <PictureAsPdfIcon />
            </Button>
         </Tooltip>
      </Box>
   );

   //#endregion EXPORTAR

   return (
      <div className="card p-fluid">
         {/* <Tooltip target=".export-buttons>button" position="bottom" /> */}
         <DataTable
            value={products}
            editMode="row"
            header={header}
            dataKey="id"
            paginator
            rowsPerPageOptions={[5, 10, 50, 100]}
            rows={10}
            globalFilter={globalFilter}
            globalFilterFields={["name", "country.name", "representative.name", "balance", "status"]}
            // rowsPerPageOptions={[10, 25, 50]}
            filterDisplay="menu"
            onRowEditComplete={onRowEditComplete}
            tableStyle={{ minWidth: "50rem" }}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            emptyMessage="No se encontraron datos."
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
         >
            {columns.map((col, index) => (
               <Column
                  key={index}
                  field={col.field}
                  header={col.header}
                  editor={(options) => col.functionEdit(options)}
                  body={col.body}
                  style={{ width: "20%" }}
               ></Column>
            ))}
            {/* <Column field="code" header="Code" editor={(options) => textEditor(options)} style={{ width: "20%" }}></Column>
            <Column field="name" header="Name" editor={(options) => textEditor(options)} style={{ width: "20%" }}></Column>
            <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} editor={(options) => statusEditor(options)} style={{ width: "20%" }}></Column>
            <Column field="price" header="Price" body={priceBodyTemplate} editor={(options) => priceEditor(options)} style={{ width: "20%" }}></Column> */}
            <Column rowEditor headerStyle={{ width: "10%", minWidth: "8rem" }} bodyStyle={{ textAlign: "center" }}></Column>
         </DataTable>
      </div>
   );
}
