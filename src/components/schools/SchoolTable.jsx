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

import SchoolContextProvider, { useSchoolContext } from "../../context/SchoolContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const muiCache = createCache({
   key: "mui-datatables",
   prepend: true
});

const SchoolTable = ({ handleLoading, list, toggleDrawer1, setTextBtn }) => {
   // console.log(list);
   const [responsive, setResponsive] = useState("vertical");
   const [tableBodyHeight, setTableBodyHeight] = useState("61vh");
   const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("58vh");
   const [searchBtn, setSearchBtn] = useState(true);
   const [downloadBtn, setDownloadBtn] = useState(true);
   const [printBtn, setPrintBtn] = useState(true);
   const [viewColumnBtn, setViewColumnBtn] = useState(true);
   const [filterBtn, setFilterBtn] = useState(true);

   const { schools, school, showSchool, deleteSchool, toggleDrawer } = useSchoolContext();

   const mySwal = withReactContent(Swal);
   // console.log("schools en a view", schools);

   const handleClickEdit = async (id) => {
      console.log("click editar");
      console.log(id);
      // setTextBtn("Editar");
      toggleDrawer1(true);
      const axiosResponse = await showSchool(id);
      console.log("axiosResponse", axiosResponse);
      console.log("la eschool", school);
   };
   const handleClickDelete = async (id, name) => {
      mySwal
         .fire({
            icon: "question",
            title: `Estas seguro de eliminar a ${name}`,
            html: "",
            confirmButtonText: "Si, eliminar!",
            confirmButtonColor: "green",
            showCancelButton: true,
            cancelButtonText: "No, cancelar!",
            reverseButtons: true
         })
         .then(async (result) => {
            if (result.isConfirmed) {
               const axiosReponse = await deleteSchool(id);
               mySwal.fire({
                  icon: axiosReponse.alert_icon || "success",
                  title: axiosReponse.alert_text || "Registro eliminado",
                  showConfirmButton: false,
                  timer: 1500
               });
            }
         });
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

   const ButtonsAction = ({ id, name }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={"Editar Escuela"} placement="top">
               {/* <Button onClick={toggleDrawer(true)}>toggle</Button> */}
               <Button color="info" onClick={showSchool(id)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={"Eliminar Escuela"} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   const data = [];
   const chargerData = async () => {
      // console.log("cargar listado", schools);
      await schools.map((obj) => {
         // console.log(obj);
         const register = [];
         register.push(obj.code);
         register.push(obj.school);
         register.push(obj.address);
         register.push(obj.director);
         register.push(obj.tel);
         register.push(<ButtonsAction id={obj.id} name={obj.school} />);
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
               <MUIDataTable title={"Listado de Escuelas"} data={data} columns={columns} options={options} />
            </ThemeProvider>
         </CacheProvider>
      </>
   );
};
export default SchoolTable;
