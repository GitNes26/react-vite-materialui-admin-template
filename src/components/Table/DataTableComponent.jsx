import React, { useEffect, useRef, useState } from "react";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";

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
import { Card } from "@material-ui/core";
// import { ProductService } from "./service/ProductService";
let cont = 1;

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

   // FILTROS
   const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS }
   });
   const [loading, setLoading] = useState(true);
   const [globalFilterValue, setGlobalFilterValue] = useState("");
   // FILTROS

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
      console.log(e);
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
      { field: "code", header: "Code", sortable: true, functionEdit: textEditor, body: null },
      { field: "name", header: "Name", sortable: true, functionEdit: textEditor, body: null },
      { field: "inventoryStatus", header: "Status", sortable: true, functionEdit: statusEditor, body: statusBodyTemplate },
      { field: "price", header: "Price", sortable: true, functionEdit: priceEditor, body: priceBodyTemplate }
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
   //#endregion EXPORTAR

   const onGlobalFilterChange = (e) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters["global"].value = value;

      setFilters(_filters);
      setGlobalFilterValue(value);
   };
   const addRow = () => {
      console.log(products);
      const newProducts = {
         id: cont++,
         code: "hj46k5guy",
         name: "Nuevo Registro",
         description: "ASDAsd aslkd",
         image: "bamboo-watch.jpg",
         price: 65,
         category: "Accessories",
         quantity: 24,
         inventoryStatus: "INSTOCK",
         rating: 5
      };

      let _products = [...products];
      console.log("_products", _products);
      // let { newData, index } = e;

      // _products[index] = newData;
      _products.push(newProducts);

      setProducts(_products);

      // setProducts(newProducts);
      console.log(products);
   };

   const header = (
      // <div className="flex align-items-center justify-content-end gap-2">
      <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between", alignItems: "center" }}>
         <Tooltip title="Exportar a Excel" placement="top">
            <Button type="button" variant="text" color="success" sx={{ borderRadius: "12px", mr: 1 }} onClick={exportExcel}>
               <IconFileSpreadsheet />
            </Button>
         </Tooltip>
         <Button icon="pi pi-refresh" rounded raised>
            <i className="pi pi-refresh"></i>
         </Button>

         <Tooltip title="Exportar a PDF" placement="top">
            <Button type="button" variant="text" color="error" sx={{ borderRadius: "12px", mr: 1 }} onClick={exportPdf}>
               <PictureAsPdfIcon />
            </Button>
         </Tooltip>
         {/* <span className="p-input-icon-left">
            <IconSearch />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscador general..." />
         </span> */}
         <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
         </span>
         <Button variant="contained" onClick={() => addRow()}>
            AGREGAR
         </Button>
      </Box>
   );

   return (
      <div className="card p-fluid">
         {/* <Tooltip target=".export-buttons>button" position="bottom" /> */}
         <Card>
            <DataTable
               style={{ borderRadius: "20px" }}
               stripedRows
               removableSort
               size="small"
               value={products}
               editMode="row"
               header={header}
               dataKey="id"
               // loading
               paginator
               rowsPerPageOptions={[5, 10, 50, 100]}
               rows={10}
               // rowsPerPageOptions={[10, 25, 50]}
               loading={false}
               filters={filters}
               filterDisplay="row"
               // globalFilter={globalFilter}
               globalFilterFields={["name", "country.name", "representative.name", "status"]}
               onRowEditComplete={onRowEditComplete}
               tableStyle={{ minWidth: "50rem" }}
               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
               emptyMessage="No se encontraron registros."
               currentPageReportTemplate="Mostrando del {first} al {last} de {totalRecords} registros"
            >
               {columns.map((col, index) => (
                  <Column
                     key={index}
                     field={col.field}
                     header={col.header}
                     editor={(options) => col.functionEdit(options)}
                     sortable={col.sortable}
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
         </Card>
      </div>
   );
}
