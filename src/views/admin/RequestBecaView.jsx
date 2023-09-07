import { Fragment, useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalContext";
import { Box } from "@mui/system";
import { Button, Step, StepButton, Stepper, Typography } from "@mui/material";

const RequestBecaView = () => {
   const { setLoading } = useGlobalContext();

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
      <Box sx={{ width: "100%", height: "100%", backgroundColor: "#ccc" }}>
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
         <Box sx={{ height: "88%", backgroundColor: "#eee", display:"flex" ,flexDirection:"column", justifyContent:"space-between" }} p={2}>
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
                  <Typography sx={{ mt: 2, mb: 1, py: 1 }}>ESTOY EN EL CONTENIDO STEP?? {activeStep + 1}</Typography>
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
                           <Button onClick={handleComplete}>{completedSteps() === totalSteps() - 1 ? "Finish" : "Complete Step"}</Button>
                        ))}
                  </Box>
               </Fragment>
            )}
         </Box>
      </Box>
   );
};
export default RequestBecaView;
