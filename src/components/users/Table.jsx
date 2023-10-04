import MUIDataTable from "mui-datatables";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import IconEdit from "../icons/IconEdit";
import IconDelete from "../icons/IconDelete";

import { useUserContext } from "../../context/UserContext";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import sAlert, { QuestionAlertConfig } from "../../utils/sAlert";
import Toast from "../../utils/Toast";
import { useGlobalContext } from "../../context/GlobalContext";
import { formatDatetime, formatPhone } from "../../utils/Formats";
import { Typography } from "@mui/material";
import { Fragment } from "react";

const muiCache = createCache({
   key: "mui-datatables",
   prepend: true
});

const UserTable = () => {
   const [responsive, setResponsive] = useState("vertical");
   const [tableBodyHeight, setTableBodyHeight] = useState("61vh");
   const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("58vh");
   const [searchBtn, setSearchBtn] = useState(true);
   const [downloadBtn, setDownloadBtn] = useState(true);
   const [printBtn, setPrintBtn] = useState(true);
   const [viewColumnBtn, setViewColumnBtn] = useState(true);
   const [filterBtn, setFilterBtn] = useState(true);

   const { setLoading, setLoadingAction, setOpenDialog } = useGlobalContext();
   const { singularName, pluralName, users, showUser, deleteUser, setTextBtnSumbit, setFormTitle } = useUserContext();

   const mySwal = withReactContent(Swal);

   const handleClickEdit = async (id) => {
      try {
         setLoadingAction(true);
         setTextBtnSumbit("GUARDAR");
         setFormTitle(`EDITAR ${singularName.toUpperCase()}`);
         await showUser(id);
         setOpenDialog(true);
         setLoadingAction(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleClickDelete = async (id, name) => {
      try {
         mySwal.fire(QuestionAlertConfig(`Estas seguro de eliminar a "${name}"`)).then(async (result) => {
            if (result.isConfirmed) {
               setLoadingAction(true);
               const axiosResponse = await deleteUser(id);
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
      // header: {textAlign: "center"},
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

   const ButtonsAction = ({ id, name }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Editar ${singularName}`} placement="top">
               <Button color="info" onClick={() => handleClickEdit(id)}>
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={`Eliminar ${singularName}`} placement="top">
               <Button color="error" onClick={() => handleClickDelete(id, name)}>
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   // const columns = [{ name: "Clave", options: { filterOptions: { fullWidth: true } } }, "Title", "Location", "Acciones"];
   const columns = ["Usuario", "Role", "Información personal", "Dirección", "Otra Info", "Acciones"];
   const data = [];
   const chargerData = async () => {
      try {
         // console.log("cargar listado", users);
         await users.map((obj) => {
            // console.log(obj);
            const register = [];
            register.push(
               <Typography textAlign={"center"}>
                  {obj.username} <br /> {obj.email}
               </Typography>
            );
            register.push(<Typography textAlign={"center"}>{obj.role}</Typography>);
            register.push(
               <Fragment>
                  {obj["paternal_last_name"] == "No Aplica" ? (
                     <Typography textAlign={"center"}>No Aplica</Typography>
                  ) : (
                     <Typography textAlign={"center"}>
                        {obj.name} {obj.paternal_last_name} {obj.maternal_last_name} <br /> {formatPhone(obj.phone)}
                     </Typography>
                  )}
               </Fragment>
            );
            register.push(
               <Fragment>
                  {obj.street == "No Aplica" ? (
                     <Typography textAlign={"center"}>No Aplica</Typography>
                  ) : (
                     <Fragment>
                        {obj.street} {obj.num_ext == "S/N" ? obj.num_ext : `# ${obj.num_ext}`}
                     </Fragment>
                  )}
               </Fragment>
            );
            register.push(
               <Fragment>
                  {obj.license_number == "No Aplica" ? (
                     <Typography>No Aplica</Typography>
                  ) : (
                     <Typography>
                        No. Licencia: <b>{obj.license_number}</b> <br />
                        vence: <b>{formatDatetime(obj.license_due_date, false)}</b>
                     </Typography>
                  )}
               </Fragment>
            );
            register.push(<ButtonsAction id={obj.id} name={obj.username} />);
            data.push(register);
         });
         setLoading(false);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };
   // useEffect(() => {
   chargerData();
   // }, [users]);

   return (
      <>
         <CacheProvider value={muiCache}>
            <ThemeProvider theme={createTheme()}>
               <MUIDataTable title={`Listado de ${pluralName}`} data={data} columns={columns} options={options} />
            </ThemeProvider>
         </CacheProvider>
      </>
   );
};
export default UserTable;
