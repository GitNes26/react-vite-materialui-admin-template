import MUIDataTable from "mui-datatables";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import IconEdit from "../icons/IconEdit";
import IconDelete from "../icons/IconDelete";
const muiCache = createCache({
   key: "mui-datatables",
   prepend: true
});

const SchoolTable = () => {
   const [responsive, setResponsive] = useState("vertical");
   const [tableBodyHeight, setTableBodyHeight] = useState("400px");
   const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
   const [searchBtn, setSearchBtn] = useState(true);
   const [downloadBtn, setDownloadBtn] = useState(true);
   const [printBtn, setPrintBtn] = useState(true);
   const [viewColumnBtn, setViewColumnBtn] = useState(true);
   const [filterBtn, setFilterBtn] = useState(true);

   const columns = [{ name: "Name", options: { filterOptions: { fullWidth: true } } }, "Title", "Location", "Acciones"];

   const options = {
      search: searchBtn,
      download: downloadBtn,
      print: printBtn,
      viewColumns: viewColumnBtn,
      filter: filterBtn,
      filterType: "dropdown",
      responsive,
      tableBodyHeight,
      tableBodyMaxHeight,
      onTableChange: (action, state) => {
         console.log("onTableChange-action:", action);
         console.dir("onTableChange-state:", state);
      }
   };

   const handleClickEdit = (e) => {
      console.log("click like ");

      console.log(e);
   };
   const handleClickDelete = (e) => {
      console.log("clickerspseto");
      console.log(e);
   };

   const ButtonsAction = () => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={"Editar Escuela"} placement="top">
               <Button color="info" onClick={(e) => handleClickEdit(e)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={"Eliminar Escuela"} placement="top">
               <Button color="error" onClick={(e) => handleClickDelete(e)}>
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   const data = [
      ["Gabby George", "Business Analyst", "Minneapolis", <ButtonsAction />],
      ["Aiden Lloyd", "Business Consultant for an International Company and CEO of Tony's Burger Palace", "Dallas", <ButtonsAction />],
      ["Jaden Collins", "Attorney", "Santa Ana", <ButtonsAction />],
      ["Franky Rees", "Business Analyst", "St. Petersburg", <ButtonsAction />],
      ["Aaren Rose", null, "Toledo", <ButtonsAction />],
      ["Johnny Jones", "Business Analyst", "St. Petersburg", <ButtonsAction />],
      ["Jimmy Johns", "Business Analyst", "Baltimore", <ButtonsAction />],
      ["Jack Jackson", "Business Analyst", "El Paso", <ButtonsAction />],
      ["Joe Jones", "Computer Programmer", "El Paso", <ButtonsAction />],
      ["Jacky Jackson", "Business Consultant", "Baltimore", <ButtonsAction />],
      ["Jo Jo", "Software Developer", "Washington DC", <ButtonsAction />],
      ["Donna Marie", "Business Manager", "Annapolis", <ButtonsAction />]
   ];

   return (
      <CacheProvider value={muiCache}>
         <ThemeProvider theme={createTheme()}>
            <MUIDataTable title={"ESCUELAS REGISTRADAS"} data={data} columns={columns} options={options} />
         </ThemeProvider>
      </CacheProvider>
   );
};
export default SchoolTable;
