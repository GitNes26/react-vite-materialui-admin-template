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
   InputLabel,
   MenuItem,
   Radio,
   RadioGroup,
   Select,
   Step,
   StepButton,
   StepLabel,
   Stepper,
   TextField,
   Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Field, Formik } from "formik";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import { useRequestBecaContext } from "../../context/RequestBecaContext";
import { IconInfoCircle } from "@tabler/icons";
import { useStudentContext } from "../../context/StudentContext";
import Toast from "../../utils/Toast";
import { useLoaderData } from "react-router-dom";
import { CorrectRes, ErrorRes } from "../../utils/Response";
import { Axios } from "../../context/AuthContext";
import sAlert from "../../utils/sAlert";
import IconSended from "../../components/icons/IconSended";
import axios from "axios";
import Select2Component from "../../components/Form/Select2Component";
import InputsCommunityComponent from "../../components/Form/InputsCommunityComponent";

const RequestBecaView = () => {
   const { result } = useLoaderData();
   const dataDisabilities = result.disabilities;
   const dataSchools = result.schools;

   const [dataCommunities, setDataCommunities] = useState([]);
   const [folio, setFolio] = useState(null);

   const { setLoading, setLoadingAction } = useGlobalContext();
   // const { createRequestBeca, updateRequestBeca, openDialog, setOpenDialog, toggleDrawer, formData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } =
   //    useRequestBecaContext();
   const { formData, setFormData, formData1, formData2, setFormData2, formData3, resetFormData, createRequestBeca, updateRequestBeca } = useRequestBecaContext();
   const { getStudentByCURP } = useStudentContext();

   const inputRefFullNameTutor = useRef(null);
   const inputRefCurp = useRef(null);
   const inputRefSchoolId = useRef(null);

   useEffect(() => {
      setLoading(false);
      inputRefFullNameTutor.current.focus();
   }, []);

   // #region STEPER
   const steps = ["Datos del Tutor del Alumno", "Datos del Alumno", "Datos Academicos"];

   const [activeStep, setActiveStep] = useState(0);
   const [completed, setCompleted] = useState({});
   const [stepFailed, setStepFailed] = useState(-1);

   const totalSteps = () => {
      return steps.length;
   };

   const completedSteps = () => {
      return Object.keys(completed).length;
   };

   const isLastStep = () => {
      return activeStep === totalSteps() - 1;
   };

   const allStepsCompleted = () => {
      return completedSteps() === totalSteps();
   };

   const handleNext = () => {
      const newActiveStep =
         isLastStep() && !allStepsCompleted()
            ? // It's the last step, but not all steps have been completed,
              // find the first step that has been completed
              steps.findIndex((step, i) => !(i in completed))
            : activeStep + 1;
      setActiveStep(newActiveStep);
   };

   const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
   };

   const handleStep = (step) => () => {
      setActiveStep(step);
   };

   const handleComplete = () => {
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      handleNext();
   };

   const handleReset = () => {
      setActiveStep(0);
      setCompleted({});
      resetFormData();
      setTimeout(() => {
         inputRefFullNameTutor.current.focus();
      }, 1000);
   };

   const ButtonsBeforeOrNext = ({ isSubmitting }) => (
      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
         <Button color="inherit" variant="contained" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Atras
         </Button>
         <Box sx={{ flex: "1 1 auto" }} />
         {/* <Button onClick={handleNext} sx={{ mr: 1 }}>
                                       Adelante
                                    </Button> */}
         {activeStep !== steps.length &&
            (completed[activeStep] ? (
               <>
                  <Button
                     type="submit"
                     disabled={isSubmitting}
                     // loading={isSubmitting}
                     // loadingPosition="start"
                     variant="contained"
                  >
                     {completedSteps() === totalSteps() - 1 ? "Enviar Soilicitud" : "Adelante"}
                  </Button>

                  <Typography variant="caption" sx={{ display: "inline-block" }}>
                     Paso {activeStep + 1} completado
                  </Typography>
               </>
            ) : (
               <Button
                  // onClick={()=>onSubmit1(setValues)}
                  type="submit"
                  disabled={isSubmitting}
                  // loading={isSubmitting}
                  // loadingPosition="start"
                  variant="contained"
               >
                  {completedSteps() === totalSteps() - 1 ? "Enviar Soilicitud" : "Adelante"}
               </Button>
            ))}
      </Box>
   );
   //#endregion
   const showErrorInput = (section, msg, formHelperText = false) => {
      // Toast.Error(`Error en Sección ${section}: ${msg}`);
      setStepFailed(section - 1);
      if (formHelperText) {
         return (
            <FormHelperText error id="ht-disability_id">
               {msg}
            </FormHelperText>
         );
      }
      return msg;
   };

   const handleChangeDisability = (value2) => {
      console.log("value2", value2);
      console.log("formData2", formData2);
      formData2.disability_id = value2.id;
      formData2.disability = value2.label;
      // setValues(formData2);
      console.log("formData2", formData2);
   };

   const onSubmit1 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // console.log("formData", formData);
         formData.folio = values.folio;
         formData.tutor_full_name = values.tutor_full_name;
         formData.tutor_phone = values.tutor_phone;
         await setValues(formData);
         await setFormData(formData);
         // console.log(formData);
         setStepFailed(-1);
         handleComplete();
         setTimeout(() => {
            inputRefCurp.current.focus();
         }, 500);
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

   const handleBlurCURP = async (e, setValues) => {
      try {
         let curp = e.target.value.toUpperCase();
         let axiosReponse = await getStudentByCURP(curp);
         // console.log(axiosReponse);

         if (axiosReponse.result == null)
            return sAlert.Info("El CURP ingresado no está registrado, veritifíca que este correcto para guardarse al finalizar esta solicitud.");

         console.log("CURP - axiosReponse.result", axiosReponse.result);
         console.log("CURP - formData", formData);
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
         // const axiosMyCommunity = await axios.get(`/https://api.gomezpalacio.gob.mx/api/cp/colonia/${zip}`);

         // handleBlurCaptureByZip(formData.community_id);
         // formData.state = axiosReponse.result.state;
         // formData.city = axiosReponse.result.city;
         // formData.colony = axiosReponse.result.colony;
         formData.street = axiosReponse.result.street;
         formData.num_ext = axiosReponse.result.num_ext;
         formData.num_int = axiosReponse.result.num_int;
         setFormData(formData);
         setValues(formData);
         // console.log(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const handleChangeColony = async (values2) => {
      try {
         console.log("values", values2);
         formData2.colony;
         // user.colony = communityValues.community.label;
         // user.community_id = communityValues.community.id;
         // formData.colony = communityValues.community.label;
         // formData.community_id = communityValues.community.id;
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit2 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // console.log("formData en submit2", formData);
         formData.student_data_id = values.id;
         formData.curp = values.curp;
         formData.name = values.name;
         formData.paternal_last_name = values.paternal_last_name;
         formData.maternal_last_name = values.maternal_last_name;
         formData.birthdate = values.birthdate;
         formData.gender = values.gender;
         formData.disability_id = values.disability_id;

         formData.zip = values.zip;
         formData.state = values.state;
         formData.city = values.city;
         formData.colony = values.colony;
         formData.street = values.street;
         formData.num_ext = values.num_ext;
         formData.num_int = values.num_int;
         await setValues(formData);
         await setFormData(formData);
         // console.log(formData);
         setStepFailed(-1);
         handleComplete();
         setTimeout(() => {
            inputRefSchoolId.current.focus();
         }, 500);
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
         // console.log(values);
         // console.log("formData en submit3", formData);
         formData.school_id = values.school_id;
         formData.grade = values.grade;
         formData.average = values.average;
         formData.comments = values.comments;
         await setValues(formData);
         await setFormData(formData);
         // console.log(formData);
         setLoadingAction(true);
         // let axiosResponse;
         // if (values.id == 0)
         const axiosResponse = await createRequestBeca(formData);
         // else axiosResponse = await updateRequestBeca(formData);
         setSubmitting(false);
         setLoadingAction(false);

         if (axiosResponse.code_status != 200) return Toast.Error(axiosResponse.alert_text);
         sAlert.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         console.log("axiosResponse", axiosResponse);
         setFolio(axiosResponse.result);
         setStepFailed(-1);
         resetForm();
         resetFormData();
         handleComplete();
         // if (!checkAdd) setOpenDialog(false);
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

   const onBlurCapture = () => {
      setStepFailed(-1);
   };

   const validationSchema1 = Yup.object().shape({
      // id: 0,
      // folio: Yup.number("solo números").required("Folio requerido"),
      tutor_full_name: Yup.string().trim().required("Nombre completo del tutor requerido"),
      tutor_phone: Yup.string().trim().min(10, "El número telefónico debe ser a 10 digitos").required("Número telefonico del tutor requerido")
   });
   const validationSchema2 = Yup.object().shape({
      // id: 0,
      // student_data_id: 0,
      curp: Yup.string()
         .trim()
         .matches(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{2}[A-Z0-9]{4}[0-9]{1}$/, "Formato de CURP invalido")
         .required("CURP del alumno requerido"),
      name: Yup.string().trim().required("Nombre(s) del alumno requerido(s)"),
      paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
      maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
      birthdate: Yup.date("Fecha inválida").required("Fecha de nacimiento requerida"),
      // gender: Yup.string().trim().required("Género requerido"),
      zip: Yup.number("Solo números").required("Código Postal requerido"),
      // community_id: 0,
      street: Yup.string().trim().required("Dirección requerida"),
      num_ext: Yup.string().trim().required("Número exterior requerido"),
      // num_int: Yup.string().trim().required("Clave de escuela requerida"),
      disability_id: Yup.number().min(1, "Ésta opción no es valida").required("Discapacidad requerida")
   });
   const validationSchema3 = Yup.object().shape({
      // id: 0,
      school_id: Yup.number("Solo números").required("Escuela requerida"),
      grade: Yup.number("Solo números").required("Grado estudiantil requerido"),
      average: Yup.number("Solo números").required("Promedio actual requerido")
      // comments: Yup.string().trim().required("Comentarios requeridos"),
   });

   return (
      <Box sx={{ width: "100%", height: "100%" }}>
         <Typography variant="h1" color={"#364152"} mb={2}>
            Solicitud de Beca
         </Typography>
         <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => {
               const labelProps = {};
               if (stepFailed === index) {
                  labelProps.optional = (
                     <Typography variant="caption" color="error">
                        Hay un campo invalido en esta sección.
                     </Typography>
                  );

                  labelProps.error = true;
               }
               return (
                  <Step key={label} completed={completed[index]}>
                     <StepLabel {...labelProps} color="inherit" /* onClick={handleStep(index)} */>
                        {label}
                     </StepLabel>
                  </Step>
               );
            })}
         </Stepper>
         <Box sx={{ height: "85%", display: "flex", flexDirection: "column", justifyContent: "space-between" }} p={2}>
            {allStepsCompleted() ? (
               <Fragment>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 5 }}>
                     <IconSended />
                     <Typography sx={{ my: 5 }} variant={"h3"} textAlign={"center"}>
                        Toma captura a esta pantalla y guarda el Folio generado:
                        <Typography sx={{ mt: 2, fontWeight: "bolder" }} variant={"h1"} component={"h4"} textAlign={"center"}>
                           {folio}
                        </Typography>
                     </Typography>
                     <Button onClick={handleReset} variant="contained" fullWidth>
                        Nueva Solicitud
                     </Button>
                  </Box>
               </Fragment>
            ) : (
               <Fragment>
                  {/* <Typography sx={{ mt: 2, mb: 1, py: 1 }}>ESTOY EN EL CONTENIDO STEP?? {activeStep + 1}</Typography> */}
                  <Box sx={{ mt: 2, height: "100%" }}>
                     {activeStep + 1 == 1 && (
                        <Formik initialValues={formData1} validationSchema={validationSchema1} onSubmit={onSubmit1}>
                           {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                              <Box
                                 sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                 component={"form"}
                                 onSubmit={handleSubmit}
                                 onBlur={onBlurCapture}
                              >
                                 <Grid container spacing={2}>
                                    {/* Folio */}
                                    {/* <Grid xs={12} md={4} sx={{ mb: 3 }}>
                                    <TextField
                                       id="folio"
                                       name="folio"
                                       label="Folio *"
                                       type="number"
                                       value={values.folio}
                                       placeholder="1505"
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                       fullWidth
                                       inputProps={{ maxLength: 10 }}
                                       inputRef={inputRefFullNameTutor}
                                       // disabled={values.id == 0 ? false : true}
                                       error={errors.folio && touched.folio}
                                       helperText={errors.folio && touched.folio && showErrorInput(1, errors.folio)}
                                    />
                                 </Grid> */}
                                    {/* Nombre Tutor */}
                                    <Grid xs={12} md={9} sx={{ mb: 3 }}>
                                       <TextField
                                          id="tutor_full_name"
                                          name="tutor_full_name"
                                          label="Nombre Tutor *"
                                          type="text"
                                          value={values.tutor_full_name}
                                          placeholder="Escribe tú nombre completo"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          // disabled={values.id == 0 ? false : true}
                                          inputRef={inputRefFullNameTutor}
                                          error={errors.tutor_full_name && touched.tutor_full_name}
                                          helperText={errors.tutor_full_name && touched.tutor_full_name && showErrorInput(1, errors.tutor_full_name)}
                                       />
                                    </Grid>
                                    {/* Tel Tutor */}
                                    <Grid xs={12} md={3} sx={{ mb: 3 }}>
                                       <TextField
                                          id="tutor_phone"
                                          name="tutor_phone"
                                          label="Teléfono Tutor *"
                                          type="text"
                                          value={values.tutor_phone}
                                          placeholder="10 dígitos 📞"
                                          inputProps={{ maxLength: 10 }}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          // disabled={values.id == 0 ? false : true}
                                          error={errors.tutor_phone && touched.tutor_phone}
                                          helperText={errors.tutor_phone && touched.tutor_phone && showErrorInput(1, errors.tutor_phone)}
                                       />
                                    </Grid>
                                 </Grid>
                                 <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                              </Box>
                           )}
                        </Formik>
                     )}
                     {activeStep + 1 == 2 && (
                        <Formik initialValues={formData2} validationSchema={validationSchema2} onSubmit={onSubmit2}>
                           {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                              <Box
                                 sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                 component={"form"}
                                 onSubmit={handleSubmit}
                                 onBlur={onBlurCapture}
                              >
                                 <Grid container spacing={2}>
                                    {/* CURP */}
                                    <Grid xs={12} md={4} sx={{ mb: 3 }}>
                                       <TextField
                                          id="curp"
                                          name="curp"
                                          label="CURP *"
                                          FormHelperTextProps={{ itemScope: <IconInfoCircle /> }}
                                          type="text"
                                          value={values.curp}
                                          placeholder="Ingresa tu CURP"
                                          onChange={handleChange}
                                          onBlur={(e) => {
                                             handleBlur(e);
                                             handleBlurCURP(e, setValues);
                                          }}
                                          inputProps={{ maxLength: 18 }}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          inputRef={inputRefCurp}
                                          error={errors.curp && touched.curp}
                                          helperText={errors.curp && touched.curp && showErrorInput(2, errors.curp)}
                                       />
                                    </Grid>
                                    {/* Nombre del Alumno */}
                                    <Grid xs={12} md={8} sx={{ mb: 3 }}>
                                       <TextField
                                          id="name"
                                          name="name"
                                          label="Nombre del Alumno *"
                                          type="text"
                                          value={values.name}
                                          placeholder="Juan Manuel"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.name && touched.name}
                                          helperText={errors.name && touched.name && showErrorInput(2, errors.name)}
                                       />
                                    </Grid>
                                    {/* Apellido Paterno del Alumno */}
                                    <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                       <TextField
                                          id="paternal_last_name"
                                          name="paternal_last_name"
                                          label="Apellido Paterno *"
                                          type="text"
                                          value={values.paternal_last_name}
                                          placeholder="Perez"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.paternal_last_name && touched.paternal_last_name}
                                          helperText={errors.paternal_last_name && touched.paternal_last_name && showErrorInput(2, errors.paternal_last_name)}
                                       />
                                    </Grid>
                                    {/* Apellido Materno del Alumno */}
                                    <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                       <TextField
                                          id="maternal_last_name"
                                          name="maternal_last_name"
                                          label="Apellido Materno *"
                                          type="text"
                                          value={values.maternal_last_name}
                                          placeholder="López"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.maternal_last_name && touched.maternal_last_name}
                                          helperText={errors.maternal_last_name && touched.maternal_last_name && showErrorInput(2, errors.maternal_last_name)}
                                       />
                                    </Grid>
                                    {/* Fecha de Nacimiento */}
                                    <Grid xs={12} md={4} sx={{ mb: 3 }}>
                                       <FormControl fullWidth sx={{}}>
                                          <FormLabel
                                             id="date-label"
                                             sx={{
                                                fontSize: "0.66rem",
                                                zIndex: 10,
                                                position: "absolute",
                                                top: -10,
                                                left: 15,
                                                px: 0.3,
                                                background:
                                                   "linear-gradient(180deg, rgba(238,242,246,1) 0%, rgba(238,242,246,1) 60%, rgba(248,250,252,1) 60%, rgba(248,250,252,1) 100%)"
                                             }}
                                          >
                                             Fecha de Nacimiento *
                                          </FormLabel>
                                          <TextField
                                             id="birthdate"
                                             // aria-labelledby="date-label"
                                             name="birthdate"
                                             label=""
                                             // focused
                                             type="date"
                                             value={values.birthdate}
                                             placeholder="10 digitos"
                                             inputProps={{ maxLength: 10 }}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             fullWidth
                                             disabled={values.id == 0 ? false : true}
                                             error={errors.birthdate && touched.birthdate}
                                             helperText={errors.birthdate && touched.birthdate && showErrorInput(2, errors.birthdate)}
                                          />
                                       </FormControl>
                                    </Grid>
                                    {/* Genero */}
                                    <Grid xs={12} md={4} sx={{ mb: 1 }}>
                                       <FormControl fullWidth sx={{ alignItems: "center" }}>
                                          <FormLabel id="gender-label">Género</FormLabel>
                                          <RadioGroup
                                             row
                                             aria-labelledby="gender-label"
                                             id="gender"
                                             name="gender"
                                             value={values.gender}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                          >
                                             <FormControlLabel value="MASCULINO" control={<Radio />} label="Masculino" />
                                             <FormControlLabel value="FEMENINO" control={<Radio />} label="Femenino" />
                                          </RadioGroup>
                                          {touched.gender && errors.gender && showErrorInput(2, errors.gender, true)}
                                       </FormControl>
                                    </Grid>
                                    {/* Discapacidad */}
                                    <Grid xs={12} md={4} sx={{ mb: 1 }}>
                                       <Select2Component
                                          idName={"disability_id"}
                                          label={"Discapacidad *"}
                                          valueLabel={values.disability}
                                          formDataProp={formData.disability}
                                          objProp={values.disability_id}
                                          placeholder={"¿Tienes alguna discapacaidad?"}
                                          options={dataDisabilities}
                                          fullWidth={true}
                                          handleChange={handleChange}
                                          handleChangeValueSuccess={handleChangeDisability}
                                          setFieldValue={setFieldValue}
                                          handleBlur={handleBlur}
                                          error={errors.disability_id}
                                          touched={touched.disability_id}
                                          disabled={false}
                                       />
                                    </Grid>

                                    <Grid xs={12}>
                                       <Divider sx={{ flexGrow: 1, mb: 2 }} orientation={"horizontal"} />
                                    </Grid>

                                    <InputsCommunityComponent
                                       formData={formData2}
                                       setFormData={setFormData2}
                                       values={values}
                                       setFieldValue={setFieldValue}
                                       setValues={setValues}
                                       handleChange={handleChange}
                                       handleBlur={handleBlur}
                                       errors={errors}
                                       touched={touched}
                                       changeColonySuccess={handleChangeColony}
                                       columnsByTextField={3}
                                    />

                                    {/* <LoadingButton
                                    type="submit"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    // loadingPosition="start"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                 >
                                    Registrar o Guardar
                                 </LoadingButton> */}
                                 </Grid>
                                 <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                              </Box>
                           )}
                        </Formik>
                     )}
                     {activeStep + 1 == 3 && (
                        <Formik initialValues={formData3} validationSchema={validationSchema3} onSubmit={onSubmit3}>
                           {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                              <Box
                                 sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                                 component={"form"}
                                 onSubmit={handleSubmit}
                              >
                                 <Grid container spacing={2}>
                                    {/* Escuela */}
                                    <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                       <FormControl fullWidth>
                                          <InputLabel id="school_id-label">Escuela *</InputLabel>
                                          <Select
                                             id="school_id"
                                             name="school_id"
                                             label="Escuela *"
                                             labelId="school_id-label"
                                             value={values.school_id}
                                             placeholder="Escuela *"
                                             // readOnly={true}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             inputRef={inputRefSchoolId}
                                             error={errors.school_id && touched.school_id}
                                          >
                                             <MenuItem value={null} disabled>
                                                Selecciona una opción...
                                             </MenuItem>
                                             {dataSchools &&
                                                dataSchools.map((d) => (
                                                   <MenuItem key={d.value} value={d.value}>
                                                      {d.value} - {d.text}
                                                   </MenuItem>
                                                ))}
                                          </Select>
                                          {touched.school_id && errors.school_id && showErrorInput(3, errors.school_id, true)}
                                       </FormControl>
                                    </Grid>
                                    {/* Grado */}
                                    <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                       <TextField
                                          id="grade"
                                          name="grade"
                                          label="Grado de Estudio (año)*"
                                          type="number"
                                          value={values.grade}
                                          placeholder="3"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          inputProps={{ maxLength: 1, min: 1, max: 6 }}
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.grade && touched.grade}
                                          helperText={errors.grade && touched.grade && showErrorInput(3, errors.grade)}
                                       />
                                    </Grid>
                                    {/* Promedio */}
                                    <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                       <TextField
                                          id="average"
                                          name="average"
                                          label="Promedio *"
                                          type="number"
                                          value={values.average}
                                          placeholder="10.00"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          inputProps={{ step: 0.01, min: 0, max: 100 }}
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.average && touched.average}
                                          helperText={errors.average && touched.average && showErrorInput(3, errors.average)}
                                       />
                                    </Grid>
                                    {/* Comentarios */}
                                    <Grid xs={12} md={12} sx={{ mb: 3 }}>
                                       <TextField
                                          id="comments"
                                          name="comments"
                                          label="Comentarios (opcional)"
                                          type="text"
                                          value={values.comments}
                                          placeholder="¿Deseas dejar algún comentario o mensaje?"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          multiline
                                          rows={5}
                                          inputProps={{}}
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.comments && touched.comments}
                                          helperText={errors.comments && touched.comments && showErrorInput(3, errors.comments)}
                                       />
                                    </Grid>
                                 </Grid>
                                 <ButtonsBeforeOrNext isSubmitting={isSubmitting} />
                              </Box>
                           )}
                        </Formik>
                     )}
                  </Box>
               </Fragment>
            )}
         </Box>
      </Box>
   );
};

export const loaderIndexRequestBecasView = async () => {
   try {
      const res = CorrectRes;
      const axiosSchools = await Axios.get("/schools/selectIndex");
      res.result.schools = axiosSchools.data.data.result;
      res.result.schools.unshift({ id: 0, label: "Selecciona una opción..." });

      const axiosDisabilities = await Axios.get("/disabilities/selectIndex");
      res.result.disabilities = axiosDisabilities.data.data.result;
      res.result.disabilities.unshift({ id: 0, label: "Selecciona una opción..." });

      return res;
   } catch (error) {
      const res = ErrorRes;
      console.log(error);
      res.message = error;
      res.alert_text = error;
      sAlert.Error(error);
      return res;
   }
};

export default RequestBecaView;
