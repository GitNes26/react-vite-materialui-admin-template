import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
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

import { useSchoolContext } from "../../context/SchoolContext";

const muiCache = createCache({
   key: "mui-datatables",
   prepend: true
});

// const openStateInitial = true;

const SchoolTable = ({ handleLoading, list, setTextBtn }) => {
   // console.log(list);
   const [responsive, setResponsive] = useState("vertical");
   const [tableBodyHeight, setTableBodyHeight] = useState("400px");
   const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
   const [searchBtn, setSearchBtn] = useState(true);
   const [downloadBtn, setDownloadBtn] = useState(true);
   const [printBtn, setPrintBtn] = useState(true);
   const [viewColumnBtn, setViewColumnBtn] = useState(true);
   const [filterBtn, setFilterBtn] = useState(true);

   // const [open, setOpen] = useState(openStateInitial);
   const { schools, school, showSchool } = useSchoolContext();
   // console.log("schools en a view", schools);

   const handleClickEdit = async (id) => {
      console.log("click editar");
      console.log(id);
      // setTextBtn("Editar");
      await showSchool(id);
      console.log("la eschool", school);
   };
   const handleClickDelete = (id) => {
      console.log("click eliminar");
      console.log(id);
   };

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

   // const columns = [{ name: "Clave", options: { filterOptions: { fullWidth: true } } }, "Title", "Location", "Acciones"];
   const columns = ["Clave", "Escuela", "Dirección", "Director", "Tel", "Acciones"];

   const ButtonsAction = ({ id }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={"Editar Escuela"} placement="top">
               <Button color="info" onClick={(e) => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={"Eliminar Escuela"} placement="top">
               <Button color="error" onClick={(e) => handleClickDelete(id)}>
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   const data = [];
   const chargerData = async () => {
      console.log("cargar listado", schools);
      await schools.map((obj) => {
         // console.log(obj);
         const register = [];
         register.push(obj.code);
         register.push(obj.school);
         register.push(obj.address);
         register.push(obj.director);
         register.push(obj.tel);
         register.push(<ButtonsAction id={obj.id} />);
         data.push(register);
      });
      // setOpen(false);
      handleLoading(false);
      // console.log("data", data);
   };
   // useEffect(() => {
   chargerData();
   // }, [list]);

   return (
      <>
         <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
               <MUIDataTable title={"ESCUELAS REGISTRADAS"} data={data} columns={columns} options={options} />
            </ThemeProvider>
         </CacheProvider>
      </>
   );
};
export default SchoolTable;
