import { Fragment, useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { Box } from "@mui/system";
import {
   Button,
   ButtonGroup,
   Divider,
   FormControl,
   FormControlLabel,
   FormHelperText,
   FormLabel,
   Radio,
   RadioGroup,
   Step,
   StepLabel,
   Stepper,
   TextField,
   Tooltip,
   Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Formik } from "formik";
import * as Yup from "yup";

import { useRequestBecaContext } from "../../context/RequestBecaContext";
import { IconEdit, IconEye, IconInfoCircle } from "@tabler/icons";
import { useStudentContext } from "../../context/StudentContext";
import Toast from "../../utils/Toast";
import sAlert from "../../utils/sAlert";
import IconSended from "../../components/icons/IconSended";
import Select2Component from "../../components/Form/Select2Component";
import InputsCommunityComponent, { getCommunity } from "../../components/Form/InputsCommunityComponent";
import { formatDatetime, handleInputFormik } from "../../utils/Formats";

import DatePickerComponent from "../../components/Form/DatePickerComponent";
import { useDisabilityContext } from "../../context/DisabilityContext";
import { useSchoolContext } from "../../context/SchoolContext";
import { TableComponent } from "../../components/Table/TableComponent";
import { any } from "prop-types";
import IconDelete from "../../components/icons/IconDelete";
import RowEditingDemo from "../../components/Table/DataTableComponent";

const columns = [
   { title: "Folio", field: "folio" },
   { title: "Escuela", field: "school" },
   { title: "Alumno", field: "student" },
   { title: "Promedio", field: "average", type: "numeric" },
   { title: "Fecha de Solicitud", field: "requestDate" },
   { title: "Acciones", field: "actions" }
];

const RequestListView = () => {
   const {
      setLoading,
      setLoadingAction,
      setDisabledState,
      setDisabledCity,
      setDisabledColony,
      setShowLoading,
      setDataStates,
      setDataCities,
      setDataColonies,
      setDataColoniesComplete
   } = useGlobalContext();

   const { singularName, formData, setFormData, requestBecas, getRequestBecas, getRequestBecasByuser, resetFormData, createRequestBeca, updateRequestBeca } =
      useRequestBecaContext();
   const [data, setData] = useState([]);
   const [dataUpload, setDataUpload] = useState(false);

   const ButtonsAction = ({ id, folio }) => {
      return (
         <ButtonGroup variant="outlined">
            <Tooltip title={`Ver solicitud ${folio}`} placement="top">
               <Button color="primary">
                  <IconEye />
               </Button>
            </Tooltip>
            <Tooltip title={`Editar ${singularName}`} placement="top">
               <Button color="info">
                  <IconEdit />
               </Button>
            </Tooltip>
            <Tooltip title={`Eliminar ${singularName}`} placement="top">
               <Button color="error">
                  <IconDelete />
               </Button>
            </Tooltip>
         </ButtonGroup>
      );
   };

   const createRow = async () => {
      const rows = [];
      await requestBecas.map((obj) => {
         const row = { id: 0, folio: 0, school: "", student: "", average: 0, requestDate: "", actions: any };
         row.id = obj.id;
         row.folio = <Typography variant="h4">{obj.folio}</Typography>;
         row.school = (
            <Typography variant="">
               <span className="bolder">{obj.code}</span> - {obj.school}
            </Typography>
         );
         row.student = (
            <Typography variant="">
               <span className="bolder">{obj.curp}</span> - {obj.paternal_last_name} {obj.maternal_last_name} {obj.name}
            </Typography>
         );
         row.average = <Typography variant="h4">{obj.average}</Typography>;
         row.requestDate = <Typography variant="">{formatDatetime(obj.created_at, true)}</Typography>;
         row.actions = <ButtonsAction id={obj.id} folio={obj.folio} />;
         rows.push(row);
      });
      setData(rows);
      setDataUpload(true);
      // return { id, folio, school, student, average };
   };

   useEffect(() => {
      createRow();
      getRequestBecas();
      setLoading(false);
      // console.log("useEffect - formData", formData);
   }, [dataUpload]);

   return (
      <Box sx={{ width: "100%", height: "100%" }}>
         <Typography variant="h1" color={"#364152"} mb={2} textAlign={"center"}>
            {"LISTADO DE SOLICITUDES".toUpperCase()}
         </Typography>
         <RowEditingDemo />
         {/* <TableComponent columns={columns} data={data} singularName={singularName} /> */}
      </Box>
   );
};

export default RequestListView;
