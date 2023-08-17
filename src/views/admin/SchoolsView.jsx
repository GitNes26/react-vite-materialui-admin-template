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
   // console.log(data);

   return (
      <>
         

         <MainCard title="Info Escuela ">
            <SchoolForm />
         </MainCard>

         <MainCard title="Escuelas" sx={{ mt: 2 }}>
            <SchoolTable list={data.result} />
         </MainCard>
      </>
   );
};

export const loaderIndex = async () => {
   try {
      <Backdrop open={true} />;
      const res = CorrectRes;
      // console.log(res);
      const { data } = await Axios.get("/schools");
      // console.log("la data...", data);

      return data;
   } catch (error) {
      const res = ErrorRes;
      console.log(error);
      res.message = error;
      res.alert_text = error;
      return res;
   }
};

export default SchoolView;
