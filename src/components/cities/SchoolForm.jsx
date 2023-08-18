import { Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {
   Autocomplete,
   Divider,
   FormControlLabel,
   FormLabel,
   InputAdornment,
   InputLabel,
   MenuItem,
   Radio,
   RadioGroup,
   Select,
   TextField,
   Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";

const SchoolForm = () => {
   const onSubmit = async ({ email, password }, { setSubmitting, setErrors, resetForm }) => {
      try {
         const credentialUser = await login({ email, password });
         console.log(credentialUser);
         resetForm();
         if (scriptedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
         }
      } catch (error) {
         console.error(error);
         if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: error.message });
            setSubmitting(false);
         }
         // if (error.code === "auth/user-not-found") setErrors({ email: "Usuario no registrado" });
         // if (error.code === "auth/wrong-password") setErrors({ password: "Contraseña incorrecta" });
      } finally {
         setSubmitting(false);
      }
   };

   const validationSchema = Yup.object().shape({
      schoolName: Yup.string().trim().required("Nombre de escuela requerida"),
      schoolDirector: Yup.string().trim().required("Director de escuela requerida"),
      schoolState: Yup.string().trim().required("Ciudad requerida"),
      schoolCity: Yup.string().trim().required("Municipio requerido"),
      schoolRadio: Yup.string().trim().required("Radio requerido")
   });

   return (
      <Formik
         initialValues={{
            schoolName: "",
            schoolDirector: "",
            schoolState: "",
            schoolCity: "",
            schoolRadio: ""
         }}
         validationSchema={validationSchema}
         onSubmit={onSubmit}
      >
         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
               <Grid sm={12} md={8} sx={{ mb: 3 }}>
                  <TextField
                     id="schoolName"
                     name="schoolName"
                     label="Nombre de la Escuela"
                     type="text"
                     value={values.schoolName}
                     placeholder="Lazaro Cardenas del Rio"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     fullWidth
                     error={errors.schoolName && touched.schoolName}
                     helperText={errors.schoolName && touched.schoolName && errors.schoolName}
                  />
               </Grid>
               <Grid sm={12} md={4} sx={{ mb: 3 }}>
                  <TextField
                     id="schoolDirector"
                     name="schoolDirector"
                     label="Director de la escuela"
                     type="text"
                     value={values.schoolDirector}
                     placeholder="Lazaro Cardenas del Rio"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     fullWidth
                     error={errors.schoolDirector && touched.schoolDirector}
                     helperText={errors.schoolDirector && touched.schoolDirector && errors.schoolDirector}
                  />
               </Grid>
               <Grid sm={12} md={6} sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                     <InputLabel id="schoolState-label">Estado</InputLabel>
                     <Select
                        id="schoolState"
                        name="schoolState"
                        label="Estado"
                        labelId="schoolState-label"
                        value={values.schoolState}
                        placeholder="Estado"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.schoolState && touched.schoolState}
                     >
                        <MenuItem value={null} disabled>
                           Seleccione una opción...
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                     </Select>
                     {touched.schoolCity && errors.schoolCity && (
                        <FormHelperText error id="ht-schoolCity">
                           {errors.schoolCity}
                        </FormHelperText>
                     )}
                  </FormControl>
               </Grid>
               <Grid sm={12} md={6} sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                     <InputLabel id="schoolCity-label">Municipio</InputLabel>
                     <Select
                        id="schoolCity"
                        name="schoolCity"
                        label="Municipio"
                        labelId="schoolCity-label"
                        value={values.schoolCity}
                        placeholder="Municipio"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.schoolCity && touched.schoolCity}
                     >
                        <MenuItem value={null} disabled>
                           Seleccione una opción...
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                     </Select>
                     {touched.schoolCity && errors.schoolCity && (
                        <FormHelperText error id="ht-schoolCity">
                           {errors.schoolCity}
                        </FormHelperText>
                     )}
                  </FormControl>
                  {/* <FormControl
               fullWidth
               error={Boolean(touched.schoolCity && errors.schoolCity)}
               sx={{ height: "auto" }}
               // sx={{ ...theme.typography.customInput }}
            >
               <Autocomplete
                  disablePortal
                  id="schoolCity"
                  name="schoolCity"
                  label="Municipio"
                  defaultValue={{ label: values.schoolCity }}
                  isOptionEqualToValue={(option, value) => option.id == value.id}
                  // onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  options={top100Films}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, value) => onChange(value)}
                  onInputChange={(event, value) => {
                     if (value && value.length >= 3) {
                        search(value).finally();
                     }
                  }}
               />
               {touched.schoolCity && errors.schoolCity && (
                  <FormHelperText error id="ht-schoolCity">
                     {errors.schoolCity}
                  </FormHelperText>
               )}
            </FormControl> */}
               </Grid>
               <Grid sm={12} md={3} sx={{ mb: 3 }}>
                  <FormControl fullWidth>
                     <FormLabel id="schoolRadio-label">Gender</FormLabel>
                     <RadioGroup row aria-labelledby="schoolRadio-label" name="row-radio-buttons-group">
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                        <FormControlLabel value="disabled" disabled control={<Radio />} label="other" />
                     </RadioGroup>
                     {touched.schoolRadio && errors.schoolRadio && (
                        <FormHelperText error id="ht-schoolRadio">
                           {errors.schoolRadio}
                        </FormHelperText>
                     )}
                  </FormControl>
               </Grid>

               <LoadingButton
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  // loadingPosition="start"
                  variant="contained"
                  fullWidth
                  size="large"
               >
                  Iniciar Sesión
               </LoadingButton>
            </Grid>
         )}
      </Formik>
   );
};
export default SchoolForm;
