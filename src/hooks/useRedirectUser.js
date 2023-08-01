import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRedirecteUser = (user, pathRedirect) => { 
   const navigate = useNavigate();
   useEffect(() => {
      if (user) {
         navigate(pathRedirect);
      }
   }, [user]);
 }