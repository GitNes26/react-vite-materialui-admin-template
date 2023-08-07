// material-ui
// import Grid from "@mui/material/Grid"; // Grid version 1
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import { Autocomplete, Divider, InputAdornment, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
// import Grid from '@mui/material/Unstable_Grid2';

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import SchoolTable from "../../components/Schools/SchoolTable";

import { Formik } from "formik";
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { FormControl } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

const top100Films = [
   { label: "", year: 0 },
   { label: "The Shawshank Redemption", year: 1994 },
   { label: "The Godfather", year: 1972 },
   { label: "The Godfather: Part II", year: 1974 },
   { label: "The Dark Knight", year: 2008 },
   { label: "12 Angry Men", year: 1957 },
   { label: "Schindler's List", year: 1993 },
   { label: "Pulp Fiction", year: 1994 },
   {
      label: "The Lord of the Rings: The Return of the King",
      year: 2003
   },
   { label: "The Good, the Bad and the Ugly", year: 1966 },
   { label: "Fight Club", year: 1999 },
   {
      label: "The Lord of the Rings: The Fellowship of the Ring",
      year: 2001
   },
   {
      label: "Star Wars: Episode V - The Empire Strikes Back",
      year: 1980
   },
   { label: "Forrest Gump", year: 1994 },
   { label: "Inception", year: 2010 },
   {
      label: "The Lord of the Rings: The Two Towers",
      year: 2002
   },
   { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
   { label: "Goodfellas", year: 1990 },
   { label: "The Matrix", year: 1999 },
   { label: "Seven Samurai", year: 1954 },
   {
      label: "Star Wars: Episode IV - A New Hope",
      year: 1977
   },
   { label: "City of God", year: 2002 },
   { label: "Se7en", year: 1995 },
   { label: "The Silence of the Lambs", year: 1991 },
   { label: "It's a Wonderful Life", year: 1946 },
   { label: "Life Is Beautiful", year: 1997 },
   { label: "The Usual Suspects", year: 1995 },
   { label: "Léon: The Professional", year: 1994 },
   { label: "Spirited Away", year: 2001 },
   { label: "Saving Private Ryan", year: 1998 },
   { label: "Once Upon a Time in the West", year: 1968 },
   { label: "American History X", year: 1998 },
   { label: "Interstellar", year: 2014 },
   { label: "Casablanca", year: 1942 },
   { label: "City Lights", year: 1931 },
   { label: "Psycho", year: 1960 },
   { label: "The Green Mile", year: 1999 },
   { label: "The Intouchables", year: 2011 },
   { label: "Modern Times", year: 1936 },
   { label: "Raiders of the Lost Ark", year: 1981 },
   { label: "Rear Window", year: 1954 },
   { label: "The Pianist", year: 2002 },
   { label: "The Departed", year: 2006 },
   { label: "Terminator 2: Judgment Day", year: 1991 },
   { label: "Back to the Future", year: 1985 },
   { label: "Whiplash", year: 2014 },
   { label: "Gladiator", year: 2000 },
   { label: "Memento", year: 2000 },
   { label: "The Prestige", year: 2006 },
   { label: "The Lion King", year: 1994 },
   { label: "Apocalypse Now", year: 1979 },
   { label: "Alien", year: 1979 },
   { label: "Sunset Boulevard", year: 1950 },
   {
      label: "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
      year: 1964
   },
   { label: "The Great Dictator", year: 1940 },
   { label: "Cinema Paradiso", year: 1988 },
   { label: "The Lives of Others", year: 2006 },
   { label: "Grave of the Fireflies", year: 1988 },
   { label: "Paths of Glory", year: 1957 },
   { label: "Django Unchained", year: 2012 },
   { label: "The Shining", year: 1980 },
   { label: "WALL·E", year: 2008 },
   { label: "American Beauty", year: 1999 },
   { label: "The Dark Knight Rises", year: 2012 },
   { label: "Princess Mononoke", year: 1997 },
   { label: "Aliens", year: 1986 },
   { label: "Oldboy", year: 2003 },
   { label: "Once Upon a Time in America", year: 1984 },
   { label: "Witness for the Prosecution", year: 1957 },
   { label: "Das Boot", year: 1981 },
   { label: "Citizen Kane", year: 1941 },
   { label: "North by Northwest", year: 1959 },
   { label: "Vertigo", year: 1958 },
   {
      label: "Star Wars: Episode VI - Return of the Jedi",
      year: 1983
   },
   { label: "Reservoir Dogs", year: 1992 },
   { label: "Braveheart", year: 1995 },
   { label: "M", year: 1931 },
   { label: "Requiem for a Dream", year: 2000 },
   { label: "Amélie", year: 2001 },
   { label: "A Clockwork Orange", year: 1971 },
   { label: "Like Stars on Earth", year: 2007 },
   { label: "Taxi Driver", year: 1976 },
   { label: "Lawrence of Arabia", year: 1962 },
   { label: "Double Indemnity", year: 1944 },
   {
      label: "Eternal Sunshine of the Spotless Mind",
      year: 2004
   },
   { label: "Amadeus", year: 1984 },
   { label: "To Kill a Mockingbird", year: 1962 },
   { label: "Toy Story 3", year: 2010 },
   { label: "Logan", year: 2017 },
   { label: "Full Metal Jacket", year: 1987 },
   { label: "Dangal", year: 2016 },
   { label: "The Sting", year: 1973 },
   { label: "2001: A Space Odyssey", year: 1968 },
   { label: "Singin' in the Rain", year: 1952 },
   { label: "Toy Story", year: 1995 },
   { label: "Bicycle Thieves", year: 1948 },
   { label: "The Kid", year: 1921 },
   { label: "Inglourious Basterds", year: 2009 },
   { label: "Snatch", year: 2000 },
   { label: "3 Idiots", year: 2009 },
   { label: "Monty Python and the Holy Grail", year: 1975 }
];

const SchoolView = () => {
   const [value, setValue] = useState(top100Films[1]);

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
      schoolCity: Yup.string().trim().required("Municipio requerido")
   });

   return (
      <>
         <MainCard title="FORMULARIO ">
            <h1>el value: {value.label}</h1>
            <Formik
               initialValues={{
                  schoolName: "",
                  schoolDirector: "",
                  schoolState: "",
                  schoolCity: ""
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
                     <Grid sm={12} md={4}>
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
                     <Grid sm={12} md={3}>
                        <FormControl
                           fullWidth
                           error={Boolean(touched.schoolState && errors.schoolState)}
                           // sx={{ ...theme.typography.customInput }}
                        >
                           <Autocomplete
                              disablePortal
                              id="schoolState"
                              name="schoolState"
                              label="Estado"
                              value={value}
                              defaultValue={{ label: values.schoolState }}
                              isOptionEqualToValue={(option, value) => option.id == value.id}
                              onChange={(e, newValue) => {
                                 console.log(newValue);
                                 setValue(newValue);
                                 // setValue([...newValue.filter((option) => top100Films.indexOf(option) == -1)]);
                              }}
                              onBlur={handleBlur}
                              fullWidth
                              options={top100Films}
                              renderInput={(params) => <TextField {...params} />}
                           />
                           {touched.schoolState && errors.schoolState && (
                              <FormHelperText error id="ht-schoolState">
                                 {errors.schoolState}
                              </FormHelperText>
                           )}
                        </FormControl>
                     </Grid>
                     <Grid sm={12} md={3}>
                        <FormControl
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
         </MainCard>

         <MainCard title="Escuelas" sx={{ mt: 2 }}>
            <SchoolTable />
         </MainCard>
      </>
   );
};

export default SchoolView;
