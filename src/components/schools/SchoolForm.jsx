import { Field, Formik } from "formik";
import * as Yup from "yup";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Autocomplete, Button, Divider, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";

const SchoolForm = ({ dataCities, dataColonies, textBtnSubmit }) => {
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

   const handleReset = (resetForm) => {
      resetForm();
   };

   const validationSchema = Yup.object().shape({
      school: Yup.string().trim().required("Nombre de escuela requerida"),
      address: Yup.string().trim().required("Dirección de escuela requerida"),
      city: Yup.string().trim().required("Ciudad requerido"),
      colony: Yup.string().trim().required("Colonia requerida"),
      address: Yup.string().trim().required("Dirección requerida"),
      tel: Yup.string().trim().matches("[0-9]{10}", "Formato invalido - teléfono a 10 digitos").required("Número telefónico requerido"),
      director: Yup.string().trim().required("Nombre del director requerido"),
      loc_for: Yup.string().required("Indica si la esculea esá dentro o fuera del municipio de Gomez Palacio"),
      zone: Yup.string().trim().required("Zona requerida")
   });

   return (
      <Formik
         initialValues={{
            id: "",
            code: "",
            school: "",
            city: "1",
            colony: "1",
            address: "",
            tel: "",
            director: "",
            loc_for: "",
            zone: ""
         }}
         validationSchema={validationSchema}
         onSubmit={onSubmit}
      >
         {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm }) => (
            <Grid container spacing={2} component={"form"} onSubmit={handleSubmit}>
               {/* <Field id="id" name="id" type="hidden" value={values.id} onChange={handleChange} onBlur={handleBlur} /> */}
               {/* Codigo */}
               <Grid sm={12} md={4} sx={{ mb: 3 }}>
                  <TextField
                     id="code"
                     name="code"
                     label="Código de la Escuela *"
                     type="text"
                     value={values.code}
                     placeholder="AS5D16"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     focused
                     fullWidth
                     error={errors.code && touched.code}
                     helperText={errors.code && touched.code && errors.code}
                  />
               </Grid>
               {/* Escuela */}
               <Grid sm={12} md={8} sx={{ mb: 3 }}>
                  <TextField
                     id="school"
                     name="school"
                     label="Nombre de la Escuela *"
                     type="text"
                     value={values.school}
                     placeholder="Lazaro Cardenas del Rio"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     fullWidth
                     error={errors.school && touched.school}
                     helperText={errors.school && touched.school && errors.school}
                  />
               </Grid>
               {/* Ciduad */}
               <Grid sm={12} md={6} sx={{ mb: 1 }}>
                  <FormControl fullWidth>
                     <InputLabel id="city-label">Ciudad *</InputLabel>
                     <Select
                        id="city"
                        name="city"
                        label="Ciudad"
                        labelId="city-label"
                        value={values.city}
                        placeholder="Ciudad"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.city && touched.city}
                     >
                        <MenuItem value={null} disabled>
                           Seleccione una opción...
                        </MenuItem>
                        {dataCities.map((d) => (
                           <MenuItem key={d.id} value={d.id}>
                              {d.code} - {d.city}
                           </MenuItem>
                        ))}
                     </Select>
                     {touched.city && errors.city && (
                        <FormHelperText error id="ht-city">
                           {errors.city}
                        </FormHelperText>
                     )}
                  </FormControl>
               </Grid>
               {/* Colonia */}
               <Grid sm={12} md={6} sx={{ mb: 1 }}>
                  <FormControl fullWidth>
                     <InputLabel id="colony-label">Colonia *</InputLabel>
                     <Select
                        id="colony"
                        name="colony"
                        label="Colonia"
                        labelId="colony-label"
                        value={values.colony}
                        placeholder="Colonia"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.colony && touched.colony}
                     >
                        <MenuItem value={null} disabled>
                           Seleccione una opción...
                        </MenuItem>
                        {dataColonies.map((d) => (
                           <MenuItem key={d.id} value={d.id}>
                              {d.code} - {d.colony}
                           </MenuItem>
                        ))}
                     </Select>
                     {touched.colony && errors.colony && (
                        <FormHelperText error id="ht-colony">
                           {errors.colony}
                        </FormHelperText>
                     )}
                  </FormControl>
                  {/* <FormControl
               fullWidth
               error={Boolean(touched.tel && errors.tel)}
               sx={{ height: "auto" }}
               // sx={{ ...theme.typography.customInput }}
            >
               <Autocomplete
                  disablePortal
                  id="tel"
                  name="tel"
                  label="Colonia / Localidad"
                  defaultValue={{ label: values.tel }}
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
               {touched.tel && errors.tel && (
                  <FormHelperText error id="ht-tel">
                     {errors.tel}
                  </FormHelperText>
               )}
            </FormControl> */}
               </Grid>
               {/* Direccion */}
               <Grid sm={12} md={12} sx={{ mb: 1 }}>
                  <TextField
                     id="address"
                     name="address"
                     label="Director de la escuela *"
                     type="text"
                     value={values.address}
                     placeholder="Lazaro Cardenas del Rio"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     fullWidth
                     error={errors.address && touched.address}
                     helperText={errors.address && touched.address && errors.address}
                  />
               </Grid>
               {/* Telefono */}
               <Grid sm={12} md={4} sx={{ mb: 1 }}>
                  <TextField
                     id="tel"
                     name="tel"
                     label="Número Telefónico *"
                     type="tel"
                     value={values.tel}
                     placeholder="10 dígitos"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     fullWidth
                     error={errors.tel && touched.tel}
                     helperText={errors.tel && touched.tel && errors.tel}
                  />
               </Grid>
               {/* Director */}
               <Grid sm={12} md={8} sx={{ mb: 1 }}>
                  {/* <ReactInputMask mask={"(999)-999-99-99"} value={values.director} disabled={false} maskChar=" "> */}
                  <TextField
                     id="director"
                     name="director"
                     label="Nombre del director"
                     type="text"
                     value={values.director}
                     placeholder="Lic. Nombre Completo"
                     onChange={handleChange}
                     onBlur={handleBlur}
                     fullWidth
                     error={errors.director && touched.director}
                     helperText={errors.director && touched.director && errors.director}
                  />
               </Grid>
               {/* Local o Foraneo */}
               <Grid sm={12} md={4} mdOffset={3} sx={{ mb: 1 }}>
                  <FormControl fullWidth>
                     <FormLabel id="loc_for-label">Ubicacion de escuela</FormLabel>
                     <RadioGroup row aria-labelledby="loc_for-label" name="row-radio-buttons-group">
                        <FormControlLabel value="1" control={<Radio />} label="Local" />
                        <FormControlLabel value="0" control={<Radio />} label="Foranea" />
                     </RadioGroup>
                     {touched.loc_for && errors.loc_for && (
                        <FormHelperText error id="ht-loc_for">
                           {errors.loc_for}
                        </FormHelperText>
                     )}
                  </FormControl>
               </Grid>
               {/* Zona */}
               <Grid sm={12} md={4} sx={{ mb: 1 }}>
                  <FormControl fullWidth>
                     <FormLabel id="zone-label">Zona</FormLabel>
                     <RadioGroup row aria-labelledby="zone-label" name="row-radio-buttons-group">
                        <FormControlLabel value="U" control={<Radio />} label="Urbana" />
                        <FormControlLabel value="R" control={<Radio />} label="Rural" />
                     </RadioGroup>
                     {touched.zone && errors.zone && (
                        <FormHelperText error id="ht-zone">
                           {errors.zone}
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
                  {textBtnSubmit}
               </LoadingButton>
               <Button type="reset" variant="outlined" color="secondary" fullWidth size="large" sx={{ mt: 1 }} onClick={() => handleReset(resetForm)}>
                  CANCELAR
               </Button>
            </Grid>
         )}
      </Formik>
   );
};
export default SchoolForm;
