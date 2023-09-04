import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./UserContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const SchoolContext = createContext();

export default function SchoolContextProvider({ children }) {
   console.log("SchoolContextProvider");
   const [schools, setSchools] = useState([]);
   const [school, setSchool] = useState(null);
   const [formData, setFormData] = useState({
      id: "",
      code: "",
      school: "",
      city_id: "1",
      colony_id: "",
      address: "",
      tel: "",
      director: "",
      loc_for: "1",
      zone: "U"
   });
   const [openDialog, setOpenDialog] = useState(false);

   const toggleDrawer = (open) => (event) => {
      console.log("hola toggle");
      if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
         return;
      }
      console.log("el open:", open);
      setOpenDialog(open);
      console.log(openDialog);
   };

   const getSchools = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/schools`);
         res.result.schools = axiosData.data.data.result;
         setSchools(axiosData.data.data.result);
         // console.log("schools", schools);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showSchool = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/schools/${id}`);
         res = axiosData.data.data;
         console.log("showSchool() axiosData");
         toggleDrawer(true);
         console.log("abri el toggle");
         // setSchool(axiosData.data.data.result);
         // console.log("schools", schools);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createSchool = async (school) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/schools", school);
         // console.log("createSchool() axiosData", axiosData);
         res = axiosData.data.data;
         getSchools();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateSchool = async (school) => {
      // setSchools(null);
      try {
         const res = CorrectRes;
         const axiosData = await Axios.put("/schools", school);
         // setSchool(axiosData.data.data.result);
         // console.log("updateSchool() axiosData", axiosData);
         getSchools();
         // return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const deleteSchool = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/schools/${id}`);
         // console.log("deleteSchool() axiosData", axiosData.data);
         getSchools();
         res = axiosData.data.data;
         // console.log("res", res);
         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   // useEffect(() => {
   //    console.log("el useEffect de SchoolContext");
   //    getSchools();
   // });

   return (
      <SchoolContext.Provider value={{ schools, school, formData, getSchools, showSchool, createSchool, updateSchool, deleteSchool, openDialog, toggleDrawer }}>
         {children}
      </SchoolContext.Provider>
   );
}
export const useSchoolContext = () => useContext(SchoolContext);
