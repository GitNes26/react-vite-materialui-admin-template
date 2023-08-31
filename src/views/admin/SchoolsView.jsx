// material-ui
// import Grid from "@mui/material/Grid"; // Grid version 1

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
// import Grid from '@mui/material/Unstable_Grid2';

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import SchoolTable from "../../components/Schools/SchoolTable";

import SchoolForm from "../../components/schools/SchoolForm";
import { CorrectRes, ErrorRes } from "../../utils/Response";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../context/UserContext";
// import Backdrop from "../../components/BackDrop";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

import { useState } from "react";
import { useSnackbar } from "notistack";
import SchoolContextProvider, { useSchoolContext } from "../../context/SchoolContext";

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

const SchoolView = () => {
   const [loading, setLoading] = useState(true);
   const { result } = useLoaderData();
   // console.log(result);
   const { schools } = useSchoolContext();
   // console.log("schools en a view", schools);

   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");
   // console.log("holaaa", textBtnSubmit);

   const handleChangeTextBtnSubmit = (text) => {
      setTextBtnSumbit(text);
      const { result } = useLoaderData();
      console.log("result click", result);
      console.log("handleChangeTextBtnSubmit", textBtnSubmit);
   };

   const handleLoading = (open) => setLoading(open);

   return (
      <SchoolContextProvider>
         <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <Typography variant="h1" sx={{ color: "#fff" }}>
               CARGANDO... <CircularProgress color="inherit" />
            </Typography>
         </Backdrop>

         <MainCard title="Info Escuela ">
            <SchoolForm handleLoading={handleLoading} textBtnSubmit={textBtnSubmit} dataCities={result.cities} dataColonies={result.colonies} />
         </MainCard>

         <MainCard title="Listado Escuelas" sx={{ mt: 2 }}>
            <SchoolTable handleLoading={handleLoading} list={schools} setTextBtn={handleChangeTextBtnSubmit} />
         </MainCard>
      </SchoolContextProvider>
   );
};

export const loaderIndex = async () => {
   try {
      const res = CorrectRes;
      // const axiosData = await Axios.get("/schools");
      // res.result.schools = axiosData.data.data.result;

      const axiosCities = await Axios.get("/cities");
      // console.log(axiosCities);
      res.result.cities = axiosCities.data.data.result;
      const axiosColonies = await Axios.get("/colonies");
      res.result.colonies = axiosColonies.data.data.result;
      // console.log(res);

      return res;
   } catch (error) {
      const res = ErrorRes;
      console.log(error);
      res.message = error;
      res.alert_text = error;
      return res;
   }
};

export default SchoolView;
