import { Link } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthWrapper from "./AuthWrapper";
import AuthCardWrapper from "./AuthCardWrapper";
import AuthLogin from "./auth-forms/AuthLogin";
import Logo from "../../ui-component/Logo";
import AuthFooter from "../../ui-component/cards/AuthFooter";
// import { useUserContext } from "../../../../context/UserContextFirebase";
import { useRedirectTo } from "../../hooks/useRedirectTo";
import { useUserContext } from "../../context/UserContext";
import { useEffect } from "react";
import { useGlobalContext } from "../../context/GlobalContext";

// assets

// ================================|| AUTH3 - LOGIN ||================================ //
const Login = () => {
   const { user } = useUserContext();
   const { setLoading } = useGlobalContext();
   useRedirectTo(user, "/admin");

   useEffect(()=>{
      setLoading(false);
   },[])

   const theme = useTheme();
   const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

   return (
      <AuthWrapper>
         <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: "100vh" }}>
            <Grid item xs={12}>
               <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "calc(100vh - 68px)" }}>
                  <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                     <AuthCardWrapper>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                           <Grid item sx={{ mb: 3 }}>
                              {/* <Link to="#"> */}
                              <Logo />
                              {/* </Link> */}
                           </Grid>
                           <Grid item xs={12}>
                              <Grid container direction={matchDownSM ? "column-reverse" : "row"} alignItems="center" justifyContent="center">
                                 <Grid item>
                                    <Stack alignItems="center" justifyContent="center" spacing={1}>
                                       <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? "h3" : "h2"}>
                                          Hola, bienvenido
                                       </Typography>
                                       <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? "center" : "inherit"}>
                                          Ingrese sus credenciales para continuar
                                       </Typography>
                                    </Stack>
                                 </Grid>
                              </Grid>
                           </Grid>
                           <Grid item xs={12}>
                              <AuthLogin />
                           </Grid>
                           <Grid item xs={12}>
                              <Divider />
                           </Grid>
                           <Grid item xs={12}>
                              <Grid item container direction="column" alignItems="center" xs={12}>
                                 <Typography component={Link} to="/register" variant="subtitle1" sx={{ textDecoration: "none" }}>
                                    ¿No tienes una cuenta?
                                 </Typography>
                              </Grid>
                           </Grid>
                        </Grid>
                     </AuthCardWrapper>
                  </Grid>
               </Grid>
            </Grid>
            <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
               <AuthFooter />
            </Grid>
         </Grid>
      </AuthWrapper>
   );
};

export default Login;