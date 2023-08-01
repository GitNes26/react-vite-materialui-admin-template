import {
   Button,
   Container,
   CssBaseline,
   ThemeProvider,
   Typography
} from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";

// defaultTheme
import themes from "./themes";
import { useSelector } from "react-redux";

const App = () => {
   const customization = useSelector((state) => state.customization);

   return (
      <ThemeProvider theme={themes(customization)}>
         <CssBaseline />
         {/* <NavigationSroll> */}
         <RouterProvider router={router} />
         {/* </NavigationSroll> */}
      </ThemeProvider>
   );

   // return (
   //    <>
   //       <Container sx={{ border: 5, boxShadow: 3, py: 2 }}>
   //          <h1>App</h1>
   //          <Typography variant="h1" component="h5" textAlign="center">
   //             App h1 con componente
   //          </Typography>
   //          <Button variant="contained">Mi Primer Boton</Button>
   //       </Container>
   //    </>
   // );
};

export default App;
