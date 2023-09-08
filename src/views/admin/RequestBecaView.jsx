import { Fragment, useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { Box } from "@mui/system";
import {
   Button,
   ButtonGroup,
   FormControl,
   FormControlLabel,
   FormHelperText,
   FormLabel,
   InputLabel,
   MenuItem,
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
import { LoadingButton } from "@mui/lab";
import { useRequestBecaContext } from "../../context/RequestBecaContext";

const RequestBecaView = () => {
   const { setLoading } = useGlobalContext();
   // const { createRequestBeca, updateRequestBeca, openDialog, setOpenDialog, toggleDrawer, formData, textBtnSubmit, setTextBtnSumbit, formTitle, setFormTitle } =
   //    useRequestBecaContext();
   // const { formData } = useRequestBecaContext();

   const steps = ["Datos del Tutor del Alumno", "Datos del Alumno", "Datos Academicos"];

   useEffect(() => {
      setLoading(false);
   }, []);

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
                  {activeStep + 1 == 1 && (
                     <Formik>
                        <Grid container spacing={2} component={"form"}>
                           {/* Folio */}
                           <Grid xs={12} md={4} sx={{ mb: 3 }}>
                              <TextField
                                 id="folio"
                                 name="folio"
                                 label="Folio *"
                                 type="text"
                                 // value={values.folio}
                                 placeholder="1505"
                                 // onChange={handleChange}
                                 // onBlur={handleBlur}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 // error={errors.folio && touched.folio}
                                 // helperText={errors.folio && touched.folio && errors.folio}
                              />
                           </Grid>
                           {/* Nombre Tutor */}
                           <Grid xs={12} md={9} sx={{ mb: 3 }}>
                              <TextField
                                 id="tutor_full_name"
                                 name="tutor_full_name"
                                 label="Nombre Tutor *"
                                 type="text"
                                 // value={values.tutor_full_name}
                                 placeholder="1505"
                                 // onChange={handleChange}
                                 // onBlur={handleBlur}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 // error={errors.tutor_full_name && touched.tutor_full_name}
                                 // helperText={errors.tutor_full_name && touched.tutor_full_name && errors.tutor_full_name}
                              />
                           </Grid>
                           {/* Tel Tutor */}
                           <Grid xs={12} md={3} sx={{ mb: 3 }}>
                              <TextField
                                 id="tutor_tel"
                                 name="tutor_tel"
                                 label="Teléfono Tutor *"
                                 type="text"
                                 // value={values.tutor_tel}
                                 placeholder="10 digitos"
                                 inputProps={{ maxLength: 10 }}
                                 // onChange={handleChange}
                                 // onBlur={handleBlur}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 // error={errors.tutor_tel && touched.tutor_tel}
                                 // helperText={errors.tutor_tel && touched.tutor_tel && errors.tutor_tel}
                              />
                           </Grid>
                        </Grid>
                     </Formik>
                  )}
                  {activeStep + 1 == 2 && (
                     <Formik>
                        <Grid container spacing={2} component={"form"}>
                           {/* RFC */}
                           <Grid xs={12} md={4} sx={{ mb: 3 }}>
                              <TextField
                                 id="rfc"
                                 name="rfc"
                                 label="RFC *"
                                 type="text"
                                 // value={values.rfc}
                                 placeholder="1505"
                                 // onChange={handleChange}
                                 // onBlur={handleBlur}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 // error={errors.rfc && touched.rfc}
                                 // helperText={errors.rfc && touched.rfc && errors.rfc}
                              />
                           </Grid>
                           {/* Nombre del Alumno */}
                           <Grid xs={12} md={8} sx={{ mb: 3 }}>
                              <TextField
                                 id="name"
                                 name="name"
                                 label="Nombre del Alumno *"
                                 type="text"
                                 // value={values.name}
                                 placeholder="Juan Manuel"
                                 // onChange={handleChange}
                                 // onBlur={handleBlur}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 // error={errors.name && touched.name}
                                 // helperText={errors.name && touched.name && errors.name}
                              />
                           </Grid>
                           {/* Apellido Paterno del Alumno */}
                           <Grid xs={12} md={6} sx={{ mb: 3 }}>
                              <TextField
                                 id="paternal_last_name"
                                 name="paternal_last_name"
                                 label="Apellido Paterno *"
                                 type="text"
                                 // value={values.paternal_last_name}
                                 placeholder="Perez"
                                 // onChange={handleChange}
                                 // onBlur={handleBlur}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 // error={errors.paternal_last_name && touched.paternal_last_name}
                                 // helperText={errors.paternal_last_name && touched.paternal_last_name && errors.paternal_last_name}
                              />
                           </Grid>
                           {/* Apellido Materno del Alumno */}
                           <Grid xs={12} md={6} sx={{ mb: 3 }}>
                              <TextField
                                 id="maternal_last_name"
                                 name="maternal_last_name"
                                 label="Apellido Materno *"
                                 type="text"
                                 // value={values.maternal_last_name}
                                 placeholder="López"
                                 // onChange={handleChange}
                                 // onBlur={handleBlur}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 // error={errors.maternal_last_name && touched.maternal_last_name}
                                 // helperText={errors.maternal_last_name && touched.maternal_last_name && errors.maternal_last_name}
                              />
                           </Grid>
                           {/* Fecha de Nacimiento */}
                           <Grid xs={12} md={3} sx={{ mb: 3 }}>
                              <FormControl fullWidth>
                                 <InputLabel id="colony_id-label">Fecha de Nacimineto *</InputLabel>
                                 {/* <TextField
                                    id="tutor_tel"
                                    name="tutor_tel"
                                    label="Teléfono Tutor *"
                                    type="date"
                                    // value={values.tutor_tel}
                                    placeholder="10 digitos"
                                    inputProps={{ maxLength: 10 }}
                                    // onChange={handleChange}
                                    // onBlur={handleBlur}
                                    fullWidth
                                    // disabled={values.id == 0 ? false : true}
                                    // error={errors.tutor_tel && touched.tutor_tel}
                                    // helperText={errors.tutor_tel && touched.tutor_tel && errors.tutor_tel}
                                 /> */}
                                 {touched.colony_id && errors.colony_id && (
                                    <FormHelperText error id="ht-colony_id">
                                       {errors.colony_id}
                                    </FormHelperText>
                                 )}
                              </FormControl>
                           </Grid>
                           {/* Tel Tutor */}
                           <Grid xs={12} md={3} sx={{ mb: 3 }}>
                              <TextField
                                 id="tutor_tel"
                                 name="tutor_tel"
                                 label="Teléfono Tutor *"
                                 type="text"
                                 // value={values.tutor_tel}
                                 placeholder="10 digitos"
                                 inputProps={{ maxLength: 10 }}
                                 // onChange={handleChange}
                                 // onBlur={handleBlur}
                                 fullWidth
                                 // disabled={values.id == 0 ? false : true}
                                 // error={errors.tutor_tel && touched.tutor_tel}
                                 // helperText={errors.tutor_tel && touched.tutor_tel && errors.tutor_tel}
                              />
                           </Grid>
                        </Grid>
                     </Formik>
                  )}

                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                     <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                        Atras
                     </Button>
                     <Box sx={{ flex: "1 1 auto" }} />
                     <Button onClick={handleNext} sx={{ mr: 1 }}>
                        Adelante
                     </Button>
                     {activeStep !== steps.length &&
                        (completed[activeStep] ? (
                           <Typography variant="caption" sx={{ display: "inline-block" }}>
                              Paso {activeStep + 1} completado
                           </Typography>
                        ) : (
                           <Button onClick={handleComplete}>{completedSteps() === totalSteps() - 1 ? "Finalizado" : "Paso Completo"}</Button>
                        ))}
                  </Box>
               </Fragment>
            )}
         </Box>
      </Box>
   );
};
export default RequestBecaView;
