import MUIDataTable from "mui-datatables";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import IconEdit from "./icons/IconEdit";
import IconDelete from "./icons/IconDelete";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { QuestionAlertConfig } from "../utils/sAlert";
import Toast from "../utils/Toast";
import { useGlobalContext } from "../context/GlobalContext";

const muiCache = createCache({
   key: "mui-datatables",
   prepend: true
});

// /**
//  * Descripción de la funcion
//  * @param {*} title string
//  * @returns void
//  */
const TableComponent = ({ title, objName, columns, showContext, deleteContext, convertDataContextToArray }) => {
   const [responsive, setResponsive] = useState("vertical");
   const [tableBodyHeight, setTableBodyHeight] = useState("61vh");
   const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("58vh");
   const [searchBtn, setSearchBtn] = useState(true);
   const [downloadBtn, setDownloadBtn] = useState(true);
   const [printBtn, setPrintBtn] = useState(true);
   const [viewColumnBtn, setViewColumnBtn] = useState(true);
   const [filterBtn, setFilterBtn] = useState(true);

   const { setLoading, setLoadingAction, setTextBtnSumbit, setFormTitle } = useGlobalContext();

   const mySwal = withReactContent(Swal);

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${objName.toUpperCase()}`);
         await showContext(id);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a ${name}`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteContext(id);
               setLoadingAction(false);
               Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
            }
         });
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
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
         // console.log("onTableChange-action:", action);
         // console.dir("onTableChange-state:", state);
      }
   };

   // const columns = [{ name: "Clave", options: { filterOptions: { fullWidth: true } } }, "Title", "Location", "Acciones"];

   const ButtonsAction = ({ id, name }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Editar ${objName}`} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={`Eliminar ${objName}`} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   let data = [];
   const chargerData = async () => {
      try {
         data = await convertDataContextToArray(ButtonsAction);
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   chargerData();
   return (
      <>
         <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
               <MUIDataTable title={title} data={data} columns={columns} options={options} />
            </ThemeProvider>
         </CacheProvider>
      </>
   );
};
export default TableComponent;
