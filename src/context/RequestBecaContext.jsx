import { createContext, useContext, useEffect, useState } from "react";
import { Axios } from "./UserContext";
import { CorrectRes, ErrorRes } from "../utils/Response";

const RequestBecaContext = createContext();

const formDataInitialState = {
   id: 0,
   code: "",
   requestBeca: "",
   city_id: "1",
   colony_id: "",
   address: "",
   tel: "",
   director: "",
   loc_for: "1",
   zone: "U"
};

export default function RequestBecaContextProvider({ children }) {
   const [formTitle, setFormTitle] = useState("REGISTRAR BECA");
   const [textBtnSubmit, setTextBtnSumbit] = useState("AGREGAR");
   const [loading, setLoading] = useState(true);
   const [loadingAction, setLoadingAction] = useState(false);

   const [requestBecas, setRequestBecas] = useState([]);
   const [requestBeca, setRequestBeca] = useState(null);
   const [formData, setFormData] = useState(formDataInitialState);
   const [openDialog, setOpenDialog] = useState(false);

   const toggleDrawer = (open) => (event) => {
      try {
         if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
         }
         setOpenDialog(open);
      } catch (error) {
         console.log("Error en toggleDrawer:", error);
      }
   };

   const resetFormData = () => {
      try {
         setFormData(formDataInitialState);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const fillFormData = (values) => {
      try {
         const newData = { ...formData };
         newData.id = values.id;
         newData.code = values.code;
         newData.requestBeca = values.requestBeca;
         newData.city_id = values.city_id;
         newData.colony_id = values.colony_id;
         newData.address = values.address;
         newData.tel = values.tel;
         newData.director = values.director;
         newData.loc_for = values.loc_for;
         newData.zone = values.zone;
         setFormData(newData);
      } catch (error) {
         console.log("Error en fillFormData:", error);
      }
   };

   const getRequestBecas = async () => {
      try {
         const res = CorrectRes;
         const axiosData = await Axios.get(`/requestBecas`);
         res.result.requestBecas = axiosData.data.data.result;
         setRequestBecas(axiosData.data.data.result);
         // console.log("requestBecas", requestBecas);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const showRequestBeca = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.get(`/requestBecas/${id}`);
         setOpenDialog(true);
         res = axiosData.data.data;
         // await setRequestBeca(res.result);
         // setFormData(res.result);
         fillFormData(res.result);

         return res;
      } catch (error) {
         const res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
   };

   const createRequestBeca = async (requestBeca) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.post("/requestBecas", requestBeca);
         res = axiosData.data.data;
         getRequestBecas();
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const updateRequestBeca = async (requestBeca) => {
      let res = CorrectRes;
      try {
         const axiosData = await Axios.put("/requestBecas", requestBeca);
         res = axiosData.data.data;
         getRequestBecas();
         // return res;
      } catch (error) {
         res = ErrorRes;
         console.log(error);
         res.message = error;
         res.alert_text = error;
      }
      return res;
   };

   const deleteRequestBeca = async (id) => {
      try {
         let res = CorrectRes;
         const axiosData = await Axios.delete(`/requestBecas/${id}`);
         // console.log("deleteRequestBeca() axiosData", axiosData.data);
         getRequestBecas();
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
   //    console.log("el useEffect de RequestBecaContext");
   //    getRequestBecas();
   // });

   return (
      <RequestBecaContext.Provider
         value={{
            requestBecas,
            requestBeca,
            formData,
            resetFormData,
            getRequestBecas,
            showRequestBeca,
            createRequestBeca,
            updateRequestBeca,
            deleteRequestBeca,
            loading,
            setLoading,
            loadingAction,
            setLoadingAction,
            openDialog,
            setOpenDialog,
            toggleDrawer,
            textBtnSubmit,
            setTextBtnSumbit,
            formTitle,
            setFormTitle
         }}
      >
         {children}
      </RequestBecaContext.Provider>
   );
}
export const useRequestBecaContext = () => useContext(RequestBecaContext);
