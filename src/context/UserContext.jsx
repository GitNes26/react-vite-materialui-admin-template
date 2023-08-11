import axios from "axios";
import { createContext, useState } from "react";

export const UserContext = createContext();

export const Axios = (axios.defaults.baseURL = import.meta.env.VITE_API);

const UserContextProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [wait, setWait] = useState(false);

   const register = async ({ username, email, password, role }) => {
      setWait(true);
      try {
         const res = await Axios.post(`/register`, {
            username,
            email,
            password,
            role
         });
         setWait(false);
         return res;
      } catch (error) {
         setWait(false);
         console.log(error);
         return alert("trono");
      }
   };

   const login = async ({ username, password }) => {
      setWait(true);
      try {
         const res = await Axios.post(`/login`, {
            username,
            password
         });
         console.log("AxiosRes", res);

         if (res.status_code != 200 && !res.token) return alert("algo paso");
         localStorage.setItem("token", res.token);
         setWait(false);
      } catch (error) {
         setWait(false);
         console.log(error);
         return alert("trono");
      }
   };

   const loggedInCheck = async () => {
      const token = localStorage.getItem("token") || null;
      Axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      if (token){
         const res = await Axios.
      }
   };
};
