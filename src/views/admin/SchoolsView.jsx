// material-ui
// import Grid from "@mui/material/Grid"; // Grid version 1

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
// import Grid from '@mui/material/Unstable_Grid2';

// project imports
import MainCard from "../../ui-component/cards/MainCard";
import SchoolTable from "../../components/Schools/SchoolTable";

import SchoolForm from "../../components/schools/SchoolForm";

const Item = styled(Paper)(({ theme }) => ({
   backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f1f1f1",
   ...theme.typography.body2,
   padding: theme.spacing(1),
   textAlign: "center",
   color: theme.palette.text.secondary
}));

const SchoolView = () => {
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

export default SchoolView;
