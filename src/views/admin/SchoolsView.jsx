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

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

const requestFetch = async () => {
   const req = await fetch(`${import.meta.env.VITE_API}/schools`);
   const response = await req.json();
   console.log(response);
};

// requestFetch();
const SchoolView = () => {
   const data = useLoaderData();
   console.log(data);
   console.log(`${import.meta.env.VITE_API}/schools`);

   return (
      <>
         <MainCard title="Info Escuela ">
            <SchoolForm />
         </MainCard>

         <MainCard title="Escuelas" sx={{ mt: 2 }}>
            <SchoolTable />
         </MainCard>
      </>
   );
};

export const loaderIndex = async () => {
   try {
      const res = CorrectRes;
      console.log(res);
      const req = await fetch(`${import.meta.env.VITE_API_TEST}/posts`);
      const data = await req.json();

      console.log(data);
      return { data };
   } catch (error) {
      const res = ErrorRes;
      console.log(error);
      res.message = error;
      res.alert_text = error;
      return res;
   }
};

export default SchoolView;
