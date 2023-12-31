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

   const handleBlurCURP = async (e, setValues, setFieldValue) => {
      try {
         let curp = e.target.value.toUpperCase();
         if (curp.length < 1) return Toast.Info("El campo CURP esta vacío");
         let axiosReponse = await getStudentByCURP(curp);
         // console.log(axiosReponse);

         if (axiosReponse.result == null)
            return sAlert.Info("El CURP ingresado no está registrado, veritifíca que este correcto para guardarse al finalizar esta solicitud.");

         // console.log("CURP - axiosReponse.result", axiosReponse.result);
         // console.log("CURP - formData", formData);
         // const newFormData = { ...formData };
         formData.student_data_id = axiosReponse.result.id;
         formData.curp = axiosReponse.result.curp;
         formData.name = axiosReponse.result.name;
         formData.paternal_last_name = axiosReponse.result.paternal_last_name;
         formData.maternal_last_name = axiosReponse.result.maternal_last_name;
         formData.birthdate = axiosReponse.result.birthdate;
         formData.gender = axiosReponse.result.gender;
         formData.disability = axiosReponse.result.disability;
         formData.disability_id = axiosReponse.result.disability_id;

         // hacer consulta a la api de Comunidad para sacar la localidad
         formData.community_id = axiosReponse.result.community_id;
         if (formData.community_id > 0) {
            getCommunity(
               formData.zip,
               setFieldValue,
               formData.community_id,
               formData,
               setFormData,
               setDisabledState,
               setDisabledCity,
               setDisabledColony,
               setShowLoading,
               setDataStates,
               setDataCities,
               setDataColonies,
               setDataColoniesComplete
            );
         }
         formData.street = axiosReponse.result.street;
         formData.num_ext = axiosReponse.result.num_ext;
         formData.num_int = axiosReponse.result.num_int;

         await setFormData(formData);
         await setValues(formData);
         // console.log(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit1 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         await setFormData(values);
         // console.log("formData", formData);
         await setValues(formData);
         // console.log(formData);
         setStepFailed(-1);
         handleComplete();
         // setTimeout(() => {
         //    inputRefCurp.current.focus();
         // }, 500);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
         // if (error.code === "auth/user-not-found") setErrors({ email: "Usuario no registrado" });
         // if (error.code === "auth/wrong-password") setErrors({ password: "Contraseña incorrecta" });
      } finally {
         setSubmitting(false);
      }
   };

   const onSubmit3 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // console.log("formData en submit3", formData);
         formData.school_id = values.school_id;
         formData.grade = values.grade;
         formData.average = values.average;
         formData.comments = values.comments;
         await setFormData(values);
         await setValues(formData);
         // console.log(formData);
         setLoadingAction(true);
         // let axiosResponse;
         // if (values.id == 0)
         const axiosResponse = await createRequestBeca(formData);
         // else axiosResponse = await updateRequestBeca(formData);
         setSubmitting(false);
         setLoadingAction(false);

         if (axiosResponse.status_code != 200) return Toast.Error(axiosResponse.alert_text);
         sAlert.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         // console.log("axiosResponse", axiosResponse);
         setStepFailed(-1);
         resetForm();
         resetFormData();
         handleComplete();
         // if (!checkAdd) setOpenDialog(false);
      } catch (error) {
         console.error(error);
         setErrors({ submit: error.message });
         setSubmitting(false);
      } finally {
         setSubmitting(false);
      }
   };

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
         {/* <div className="container">
            <div className="header">WebSocket Chat</div>
            <div className="message-container" id="messageList"></div>
            <div className="input-container">
               <input type="text" id="messageInput" placeholder="Escribe un mensaje" />
               <button onClick={sendMessage}>Enviar</button>
            </div>
         </div> */}
         {/* <Typography variant="h1" color={"#364152"} mb={2} textAlign={"center"}>
            {"LISTADO DE SOLICITUDES".toUpperCase()}
         </Typography>
         <TableComponent columns={columns} data={data} singularName={singularName} /> */}
      </Box>
   );
};

export default RequestListView;
