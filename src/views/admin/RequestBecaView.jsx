import { Fragment, useEffect, useState } from "react";
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
import { Axios } from "../../context/UserContext";

const RequestBecaView = () => {
   const { result } = useLoaderData();
   const dataDisabilities = result.disabilities;
   const dataSchools = result.schools;

   const { setLoading } = useGlobalContext();
   // const { createRequestBeca, updateRequestBeca, openDialog, setOpenDialog, toggleDrawer, formData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } =
   //    useRequestBecaContext();
   const { formData, setFormData, formData1,setFormData1,formData2,setFormData2,formData3,setFormData3 } = useRequestBecaContext();
   const { getStudentByRFC } = useStudentContext();

   // const [formData1, setFormData1] = useState({
   //    folio: "",
   //    tutor_full_name: "",
   //    tutor_phone: ""
   // })

   useEffect(() => {
      setLoading(false);
   }, []);

   // #region STEPER
   const steps = ["Datos del Tutor del Alumno", "Datos del Alumno", "Datos Academicos"];

   const [activeStep, setActiveStep] = useState(0);
   const [completed, setCompleted] = useState({});

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
      console.log("form1",formData1);
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
   };
   //#endregion

   const onSubmit1 = async (values, { setSubmitting, setErrors, resetForm, setValues }) => {
      try {
         // return console.log(values);
         setValues()
         console.log(formData);
         console.log(formData1);
         
         setFormData({...formData}, values)
         // handleComplete();
         console.log(formData);
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

   const handleBlurCapture = async (e, setValues) => {
      try {
         let rfc = e.target.value.toUpperCase();
         let axiosReponse = await getStudentByRFC(rfc);

         const newFormData = { ...formData };
         newFormData.studen_data_id = axiosReponse.result.id;
         newFormData.rfc = axiosReponse.result.rfc;
         newFormData.name = axiosReponse.result.name;
         newFormData.paternal_last_name = axiosReponse.result.paternal_last_name;
         newFormData.maternal_last_name = axiosReponse.result.maternal_last_name;
         newFormData.birthdate = axiosReponse.result.birthdate;
         newFormData.gender = axiosReponse.result.gender;

         // hacer consulta a la api de Comunidad para sacar la localidad
         newFormData.community_id = axiosReponse.result.community_id;
         newFormData.street = axiosReponse.result.street;
         newFormData.num_ext = axiosReponse.result.num_ext;
         newFormData.num_int = axiosReponse.result.num_int;
         newFormData.disability_id = axiosReponse.result.disability_id;
         setFormData(newFormData);
         setValues(newFormData);
         console.log(formData);
      } catch (error) {
         console.log(error);
         Toast.Error(error);
      }
   };

   const onSubmit2 = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         return console.log(values);
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

   const onSubmit3 = async (values, { setSubmitting, setErrors, resetForm }) => {
      try {
         return console.log(values);
         handleComplete();
         setLoadingAction(true);
         let axiosResponse;
         if (values.id == 0) axiosResponse = await createSchool(values);
         else axiosResponse = await updateSchool(values);
         resetForm();
         setTextBtnSumbit("AGREGAR");
         setFormTitle("REGISTRAR ESCUELA");
         setSubmitting(false);
         setLoadingAction(false);
         Toast.Customizable(axiosResponse.alert_text, axiosResponse.alert_icon);
         if (!checkAdd) setOpenDialog(false);
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

   const validationSchema = Yup.object().shape({
      id: 0,
      folio: Yup.string().trim().required("Folio requerido"),
      tutor_full_name: Yup.string().trim().required("Nombre completo del tutor requerido"),
      tutor_phone: Yup.string().trim().required("Número telefonico del tutor requerido"),

      studen_data_id: 0,
      rfc: Yup.string().trim().required("RFC del alumno requerido"),
      name: Yup.string().trim().required("Nombre(s) del alumno requerido(s)"),
      paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
      maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
      birthdate: Yup.string().trim().required("Fecha de nacimiento requerida"),
      gender: Yup.string().trim().required("Género requerido"),
      community_id: 0,
      street: Yup.string().trim().required("Dirección requerida"),
      num_ext: Yup.string().trim().required("Número exterior requerido"),
      // num_int: Yup.string().trim().required("Clave de escuela requerida"),
      disability_id: Yup.string().trim().required("Discapacidad requerida"),

      school_id: Yup.string().trim().required("Escuela requerida"),
      grade: Yup.string().trim().required("Grado estudiantil requerido"),
      average: Yup.string().trim().required("Promedio actual requerido")
      // comments: Yup.string().trim().required("Comentarios requeridos"),
   });

   const validationSchema1 = Yup.object().shape({
      id: 0,
      folio: Yup.string().trim().required("Folio requerido"),
      tutor_full_name: Yup.string().trim().required("Nombre completo del tutor requerido"),
      tutor_phone: Yup.string().trim().required("Número telefonico del tutor requerido"),
   });
   const validationSchema2 = Yup.object().shape({
      id: 0,
      studen_data_id: 0,
      rfc: Yup.string().trim().required("RFC del alumno requerido"),
      name: Yup.string().trim().required("Nombre(s) del alumno requerido(s)"),
      paternal_last_name: Yup.string().trim().required("Apellido Paterno requerido"),
      maternal_last_name: Yup.string().trim().required("Apellido Materno requerido"),
      birthdate: Yup.string().trim().required("Fecha de nacimiento requerida"),
      gender: Yup.string().trim().required("Género requerido"),
      community_id: 0,
      street: Yup.string().trim().required("Dirección requerida"),
      num_ext: Yup.string().trim().required("Número exterior requerido"),
      // num_int: Yup.string().trim().required("Clave de escuela requerida"),
      disability_id: Yup.string().trim().required("Discapacidad requerida"),
   });
   const validationSchema3 = Yup.object().shape({
      id: 0,
      school_id: Yup.string().trim().required("Escuela requerida"),
      grade: Yup.string().trim().required("Grado estudiantil requerido"),
      average: Yup.string().trim().required("Promedio actual requerido")
      // comments: Yup.string().trim().required("Comentarios requeridos"),
   });

   return (
      <Box sx={{ width: "100%", height: "100%" }}>
         <h1>Solicitud de Beca</h1>
         <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
               <Step key={label} completed={completed[index]}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                     {label}
                  </StepButton>
               </Step>
            ))}
         </Stepper>
         <Box sx={{ height: "88%", display: "flex", flexDirection: "column", justifyContent: "space-between" }} p={2}>
            {allStepsCompleted() ? (
               <Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>ESTE ES EL CONTENIDO DE CUANDO YA SE TERMINO EL FOMRULARIO</Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                     <Box sx={{ flex: "1 1 auto" }} />
                     <Button onClick={handleReset}>Nueva Solicitud</Button>
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
                              >
                                 <Grid container spacing={2}>
                                    {/* Folio */}
                                    <Grid xs={12} md={4} sx={{ mb: 3 }}>
                                       <TextField
                                          id="folio"
                                          name="folio"
                                          label="Folio *"
                                          type="text"
                                          value={values.folio}
                                          placeholder="1505"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.folio && touched.folio}
                                          helperText={errors.folio && touched.folio && errors.folio}
                                       />
                                    </Grid>
                                    {/* Nombre Tutor */}
                                    <Grid xs={12} md={9} sx={{ mb: 3 }}>
                                       <TextField
                                          id="tutor_full_name"
                                          name="tutor_full_name"
                                          label="Nombre Tutor *"
                                          type="text"
                                          value={values.tutor_full_name}
                                          placeholder="1505"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.tutor_full_name && touched.tutor_full_name}
                                          helperText={errors.tutor_full_name && touched.tutor_full_name && errors.tutor_full_name}
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
                                          placeholder="10 digitos"
                                          inputProps={{ maxLength: 10 }}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.tutor_phone && touched.tutor_phone}
                                          helperText={errors.tutor_phone && touched.tutor_phone && errors.tutor_phone}
                                       />
                                    </Grid>
                                 </Grid>
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
                              </Box>
                           )}
                        </Formik>
                     )}
                     {activeStep + 1 == 2 && (
                        <Formik initialValues={formData2} validationSchema={validationSchema2} onSubmit={onSubmit2}>
                           {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                              <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }} component={"form"}>
                                 <Grid container spacing={2}>
                                    {/* RFC */}
                                    <Grid xs={12} md={4} sx={{ mb: 3 }}>
                                       <TextField
                                          id="rfc"
                                          name="rfc"
                                          label="RFC"
                                          FormHelperTextProps={{ itemScope: <IconInfoCircle /> }}
                                          type="text"
                                          value={values.rfc}
                                          placeholder="1505"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          // onKeyUp={handleKeyUpRFC}
                                          onBlurCapture={(e) => handleBlurCapture(e, setValues)}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.rfc && touched.rfc}
                                          helperText={errors.rfc && touched.rfc && errors.rfc}
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
                                          helperText={errors.name && touched.name && errors.name}
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
                                          helperText={errors.paternal_last_name && touched.paternal_last_name && errors.paternal_last_name}
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
                                          helperText={errors.maternal_last_name && touched.maternal_last_name && errors.maternal_last_name}
                                       />
                                    </Grid>
                                    {/* Fecha de Nacimiento */}
                                    <Grid xs={12} md={4} sx={{ mb: 3 }}>
                                       <TextField
                                          id="birthdate"
                                          name="birthdate"
                                          label="Fecha de Nacimiento *"
                                          type="date"
                                          value={values.birthdate}
                                          placeholder="10 digitos"
                                          inputProps={{ maxLength: 10 }}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.birthdate && touched.birthdate}
                                          helperText={errors.birthdate && touched.birthdate && errors.birthdate}
                                       />
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
                                          {touched.gender && errors.gender && (
                                             <FormHelperText error id="ht-gender">
                                                {errors.gender}
                                             </FormHelperText>
                                          )}
                                       </FormControl>
                                    </Grid>
                                    {/* Discapacidad */}
                                    <Grid xs={12} md={4} sx={{ mb: 1 }}>
                                       <FormControl fullWidth>
                                          <InputLabel id="disability_id-label">Discapacidad *</InputLabel>
                                          <Select
                                             id="disability_id"
                                             name="disability_id"
                                             label="Discapacidad"
                                             labelId="disability_id-label"
                                             value={values.disability_id}
                                             placeholder="Discapacidad"
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             error={errors.disability_id && touched.disability_id}
                                          >
                                             <MenuItem value={null} disabled>
                                                Seleccione una opción...
                                             </MenuItem>
                                             {dataDisabilities &&
                                                dataDisabilities.map((d) => (
                                                   <MenuItem key={d.value} value={d.value}>
                                                      {d.value} - {d.text}
                                                   </MenuItem>
                                                ))}
                                          </Select>
                                          {touched.disability_id && errors.disability_id && (
                                             <FormHelperText error id="ht-disability_id">
                                                {errors.disability_id}
                                             </FormHelperText>
                                          )}
                                       </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                       <Divider sx={{ flexGrow: 1, my: 1 }} orientation="horizontal" />
                                    </Grid>

                                    {/* community_id */}
                                    <Field
                                       id="community_id"
                                       name="community_id"
                                       type="hidden"
                                       value={values.community_id}
                                       onChange={handleChange}
                                       onBlur={handleBlur}
                                    />

                                    {/* C.P. */}
                                    <Grid xs={12} md={3} sx={{ mb: 3 }}>
                                       <TextField
                                          id="zip"
                                          name="zip"
                                          label="Código Postal *"
                                          type="text"
                                          value={values.zip}
                                          placeholder="10 digitos"
                                          inputProps={{ maxLength: 5 }}
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.zip && touched.zip}
                                          helperText={errors.zip && touched.zip && errors.zip}
                                       />
                                    </Grid>
                                    {/* Estado */}
                                    <Grid xs={12} md={3} sx={{ mb: 1 }}>
                                       <FormControl fullWidth>
                                          <InputLabel id="state-label">Estado</InputLabel>
                                          <Select
                                             id="state"
                                             name="state"
                                             label="Estado"
                                             labelId="state-label"
                                             value={values.state}
                                             placeholder="Estado"
                                             // readOnly={true}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             error={errors.state && touched.state}
                                          >
                                             <MenuItem value={null} disabled>
                                                Seleccione una opción...
                                             </MenuItem>
                                             <MenuItem value={1}>Coahuila</MenuItem>
                                             {/* {dataCities &&
                                       dataCities.map((d) => (
                                          <MenuItem key={d.value} value={d.value}>
                                             {d.code} - {d.text}
                                          </MenuItem>
                                       ))} */}
                                          </Select>
                                          {touched.state && errors.state && (
                                             <FormHelperText error id="ht-state">
                                                {errors.state}
                                             </FormHelperText>
                                          )}
                                       </FormControl>
                                    </Grid>
                                    {/* Ciduad */}
                                    <Grid xs={12} md={3} sx={{ mb: 1 }}>
                                       <FormControl fullWidth>
                                          <InputLabel id="city-label">Ciudad</InputLabel>
                                          <Select
                                             id="city"
                                             name="city"
                                             label="Ciudad"
                                             labelId="city-label"
                                             value={values.city}
                                             placeholder="Ciudad"
                                             // readOnly={true}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             error={errors.city && touched.city}
                                          >
                                             <MenuItem value={null} disabled>
                                                Seleccione una opción...
                                             </MenuItem>
                                             <MenuItem value={1}>Torreón</MenuItem>
                                             {/* {dataCities &&
                                       dataCities.map((d) => (
                                          <MenuItem key={d.value} value={d.value}>
                                             {d.code} - {d.text}
                                          </MenuItem>
                                       ))} */}
                                          </Select>
                                          {touched.city && errors.city && (
                                             <FormHelperText error id="ht-city">
                                                {errors.city}
                                             </FormHelperText>
                                          )}
                                       </FormControl>
                                    </Grid>
                                    {/* Colonia */}
                                    <Grid xs={12} md={3} sx={{ mb: 1 }}>
                                       <FormControl fullWidth>
                                          <InputLabel id="colony-label">Colonia</InputLabel>
                                          <Select
                                             id="colony"
                                             name="colony"
                                             label="Colonia"
                                             labelId="colony-label"
                                             value={values.colony}
                                             placeholder="Colonia"
                                             // readOnly={true}
                                             onChange={handleChange}
                                             onBlur={handleBlur}
                                             error={errors.colony && touched.colony}
                                          >
                                             <MenuItem value={null} disabled>
                                                Seleccione una opción...
                                             </MenuItem>
                                             <MenuItem value={1}>Alamedas INFONAVIT</MenuItem>
                                             {/* {dataCities &&
                                       dataCities.map((d) => (
                                          <MenuItem key={d.value} value={d.value}>
                                             {d.code} - {d.colony}
                                          </MenuItem>
                                       ))} */}
                                          </Select>
                                          {touched.colony && errors.colony && (
                                             <FormHelperText error id="ht-colony">
                                                {errors.colony}
                                             </FormHelperText>
                                          )}
                                       </FormControl>
                                    </Grid>
                                    {/* Dirección */}
                                    <Grid xs={12} md={8} sx={{ mb: 3 }}>
                                       <TextField
                                          id="street"
                                          name="street"
                                          label="Dirección *"
                                          type="text"
                                          value={values.street}
                                          placeholder="Calle de las Garzas"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.street && touched.street}
                                          helperText={errors.street && touched.street && errors.street}
                                       />
                                    </Grid>
                                    {/* Num Ext */}
                                    <Grid xs={12} md={2} sx={{ mb: 3 }}>
                                       <TextField
                                          id="num_ext"
                                          name="num_ext"
                                          label="Numero Exterior *"
                                          type="text"
                                          value={values.num_ext}
                                          placeholder="S/N"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.num_ext && touched.num_ext}
                                          helperText={errors.num_ext && touched.num_ext && errors.num_ext}
                                       />
                                    </Grid>
                                    {/* Num Int */}
                                    <Grid xs={12} md={2} sx={{ mb: 3 }}>
                                       <TextField
                                          id="num_int"
                                          name="num_int"
                                          label="Numero Interior"
                                          type="text"
                                          value={values.num_int}
                                          placeholder="S/N"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.num_int && touched.num_int}
                                          helperText={errors.num_int && touched.num_int && errors.num_int}
                                       />
                                    </Grid>
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
                                 <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                    <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                       Atras
                                    </Button>
                                    <Box sx={{ flex: "1 1 auto" }} />
                                    {/* <Button onClick={handleNext} sx={{ mr: 1 }}>
                                       Adelante
                                    </Button> */}
                                    {activeStep !== steps.length &&
                                       (completed[activeStep] ? (
                                          <>
                                             <Button onClick={handleComplete}>{completedSteps() === totalSteps() - 1 ? "Enviar Soilicitud" : "Adelante"}</Button>

                                             <Typography variant="caption" sx={{ display: "inline-block" }}>
                                                Paso {activeStep + 1} completado
                                             </Typography>
                                          </>
                                       ) : (
                                          <Button onClick={handleComplete}>{completedSteps() === totalSteps() - 1 ? "Enviar Soilicitud" : "Adelante"}</Button>
                                       ))}
                                 </Box>
                              </Box>
                           )}
                        </Formik>
                     )}
                     {activeStep + 1 == 3 && (
                        <Formik initialValues={formData3} validationSchema={validationSchema3} onSubmit={onSubmit3}>
                           {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm, setFieldValue, setValues }) => (
                              <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }} component={"form"}>
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
                                             error={errors.school_id && touched.school_id}
                                          >
                                             <MenuItem value={null} disabled>
                                                Seleccione una opción...
                                             </MenuItem>
                                             {dataSchools &&
                                                dataSchools.map((d) => (
                                                   <MenuItem key={d.value} value={d.value}>
                                                      {d.value} - {d.text}
                                                   </MenuItem>
                                                ))}
                                          </Select>
                                          {touched.school_id && errors.school_id && (
                                             <FormHelperText error id="ht-school_id">
                                                {errors.school_id}
                                             </FormHelperText>
                                          )}
                                       </FormControl>
                                    </Grid>
                                    {/* Grado */}
                                    <Grid xs={12} md={6} sx={{ mb: 3 }}>
                                       <TextField
                                          id="grade"
                                          name="grade"
                                          label="Grado de Estudio (año)*"
                                          type="int"
                                          value={values.grade}
                                          placeholder="5"
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          fullWidth
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.grade && touched.grade}
                                          helperText={errors.grade && touched.grade && errors.grade}
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
                                          inputProps={{ step: 0.01 }}
                                          disabled={values.id == 0 ? false : true}
                                          error={errors.average && touched.average}
                                          helperText={errors.average && touched.average && errors.average}
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
                                          helperText={errors.comments && touched.comments && errors.comments}
                                       />
                                    </Grid>
                                 </Grid>
                                 <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                    <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                       Atras
                                    </Button>
                                    <Box sx={{ flex: "1 1 auto" }} />
                                    {/* <Button onClick={handleNext} sx={{ mr: 1 }}>
                                       Adelante
                                    </Button> */}
                                    {activeStep !== steps.length &&
                                       (completed[activeStep] ? (
                                          <>
                                             <Button onClick={handleComplete}>{completedSteps() === totalSteps() - 1 ? "Enviar Soilicitud" : "Adelante"}</Button>

                                             <Typography variant="caption" sx={{ display: "inline-block" }}>
                                                Paso {activeStep + 1} completado
                                             </Typography>
                                          </>
                                       ) : (
                                          <Button onClick={handleComplete}>{completedSteps() === totalSteps() - 1 ? "Enviar Soilicitud" : "Adelante"}</Button>
                                       ))}
                                 </Box>
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

      const axiosDisabilities = await Axios.get("/disabilities/selectIndex");
      res.result.disabilities = axiosDisabilities.data.data.result;

      // const axiosCities = await Axios.get("/cities");
      // // console.log(axiosCities);
      // res.result.cities = axiosCities.data.data.result;
      // const axiosColonies = await Axios.get("/colonies");
      // res.result.colonies = axiosColonies.data.data.result;
      // console.log(res);

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
