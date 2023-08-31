import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./UserContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const SchoolContext = createContext();

export default function SchoolContextProvider({ children }) {
   const [schools, setSchools] = useState([]);
   const [school, setSchool] = useState(null);

   const getSchools = async () => {
      // setSchools(null);
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
      // setSchools(null);
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/schools/${id}`);
         res.result = axiosData.data.data.result;
         console.log("showSchool() axiosData", axiosData);
         setSchool(axiosData.data.data.result);
         // console.log("schools", schools);

         // return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createSchool = async (school) => {
      // setSchools(null);
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/schools", school);
         console.log("createSchool() axiosData", axiosData);
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
         console.log("updateSchool() axiosData", axiosData);
         getSchools();
         // return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   useEffect(() => {
      console.log("el useEffect de SchoolContext");
      getSchools();
   }, []);

   return <SchoolContext.Provider value={{ schools, school, getSchools, showSchool, createSchool, updateSchool }}>{children}</SchoolContext.Provider>;
}
export const useSchoolContext = () => useContext(SchoolContext);
