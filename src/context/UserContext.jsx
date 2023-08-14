import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useRedirectTo } from "../hooks/useRedirectTo";

export const UserContext = createContext();

export const Axios = axios;
Axios.defaults.baseURL = import.meta.env.VITE_API;

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

   const login = async ({ email, password }) => {
      setWait(true);
      setUser(null);
      try {
         const res = await Axios.post(`/login`, {
            email,
            password
         });
         console.log("AxiosRes", res);

         if (res.data.data.status_code != 200 && !res.data.data.result.token) return alert("algo paso");
         localStorage.setItem("token", res.token);
         setUser(res.data.data.result.user_id);
         setWait(false);
         return res.data.data;
      } catch (error) {
         setWait(false);
         console.log(error);
      }
   };

   const loggedInCheck = async () => {
      const token = localStorage.getItem("token") || null;
      Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("token", token);
      if (token == null || token == undefined) {
         const res = await Axios.get(`users/${user}`); //es el id
         if (res.data.data.status_code != 200) return setUser(null);
         setUser(res.data.data.result);
      }
   };

   useEffect(() => {
      const asyncCall = async () => await loggedInCheck();
      asyncCall();
      // let redirectTo = "/";
      // if (user) redirectTo = "/admin";
      // useRedirectTo(user, redirectTo);
   }, [user]);

   const logout = () => {
      localStorage.removeItem("token");
      setUser(null);
   };

   // if (user === null) return;

   return <UserContext.Provider value={{ register, login, wait, user, loggedInCheck, logout }}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
