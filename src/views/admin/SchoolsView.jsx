// material-ui
// import Grid from "@mui/material/Grid"; // Grid version 1

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
// import Grid from '@mui/material/Unstable_Grid2';

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import SchoolTable from "../../components/Schools/SchoolTable";

import SchoolForm from "../../components/schools/SchoolForm";
import { CorrectRes, ErrorRes } from "../utilities/Responese";
import { useLoaderData } from "react-router-dom";
import { Axios } from "../../context/UserContext";
// import Backdrop from "../../components/BackDrop";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

// requestFetch();
const SchoolView = () => {
   const { data } = useLoaderData();
   console.log(data);

   const [textBtnSubmit, setTextBtnSumbit] = useState("Registrar");
   console.log("holaaa", textBtnSubmit);

   const handleChangeTextBtnSubmit = (text) => {
      console.log("handleChangeTextBtnSubmit", textBtnSubmit);
      // setTextBtnSumbit(text);
   };

   return (
      <>
         <MainCard title="Info Escuela ">
            <SchoolForm textBtnSubmit={"textBtnSubmit"} dataCities={data.cities} dataColonies={data.colonies} />
         </MainCard>

         <MainCard title="Listado Escuelas" sx={{ mt: 2 }}>
            <SchoolTable list={data.schools} setTextBtn={handleChangeTextBtnSubmit} />
         </MainCard>
      </>
   );
};

export const loaderIndex = async () => {
   try {
      <Backdrop open={true} />;
      const res = CorrectRes;
      const axiosData = await Axios.get("/schools");
      res.data.schools = axiosData.data.data.result;

      const axiosCities = await Axios.get("/cities");
      res.data.cities = axiosCities.data.data.result;
      const axiosColonies = await Axios.get("/colonies");
      res.data.colonies = axiosColonies.data.data.result;
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
