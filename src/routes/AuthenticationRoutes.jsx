import { lazy } from "react";

// project imports
import Loadable from "../ui-component/Loadable";
import MinimalLayout from "../layout/MinimalLayout";
import NotFound from "../views/pages/NotFound";

// login option 3 routing
const AuthLogin = Loadable(
   lazy(() => import("../views/pages/authentication/authentication/Login"))
);
const AuthRegister = Loadable(
   lazy(() => import("../views/pages/authentication/authentication/Register"))
);

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
   path: "/",
   element: <MinimalLayout />,
   errorElement: <NotFound />,
   children: [
      {
         index: true,
         path: "login",
         element: <AuthLogin />
      },
      {
         path: "register",
         element: <AuthRegister />
      }
   ]
};

export default AuthenticationRoutes;
