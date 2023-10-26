import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import SchoolsView from "../views/admin/SchoolsView";
import LevelsView from "../views/admin/LevelsView";
import SchoolContextProvider from "../context/SchoolContext";
import LevelContextProvider from "../context/LevelContext";
import PerimetersView from "../views/admin/PerimetersView";
import PerimeterContextProvider from "../context/PerimeterContext";
import RequestBecaView from "../views/admin/RequestBecaView";
import DisabilitiesView from "../views/admin/DisabilitiesView";
import DisabilityContextProvider from "../context/DisabilityContext";
import RequestBecaContextProvider from "../context/RequestBecaContext";
import StudentContextProvider from "../context/StudentContext";
import UserContextProvider from "../context/UserContext";
import UsersView from "../views/admin/UsersView";
import RelationshipContextProvider from "../context/RelationshipContext";

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard/Default")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
   path: "/admin",
   element: <MainLayout />,
   children: [
      {
         index: true,
         element: <DashboardDefault />
      },
      // {
      //    path: "dashboard",
      //    element: <DashboardDefault />
      // },
      {
         path: "solicitud-beca",
         element: (
            <RequestBecaContextProvider>
               <StudentContextProvider>
                  <DisabilityContextProvider>
                     <SchoolContextProvider>
                        <RelationshipContextProvider>
                           <RequestBecaView />
                        </RelationshipContextProvider>
                     </SchoolContextProvider>
                  </DisabilityContextProvider>
               </StudentContextProvider>
            </RequestBecaContextProvider>
         )
      },
      {
         path: "usuarios",
         element: (
            <UserContextProvider>
               <UsersView />
            </UserContextProvider>
         )
         // loader: loaderIndexUsersView
      },
      {
         path: "catalogos",
         children: [
            {
               path: "escuelas",
               element: (
                  <SchoolContextProvider>
                     <SchoolsView />
                  </SchoolContextProvider>
               )
            },
            {
               path: "niveles",
               element: (
                  <LevelContextProvider>
                     <LevelsView />
                  </LevelContextProvider>
               )
            },
            {
               path: "perimetros",
               element: (
                  <PerimeterContextProvider>
                     <PerimetersView />
                  </PerimeterContextProvider>
               )
            },
            {
               path: "discapacidades",
               element: (
                  <DisabilityContextProvider>
                     <DisabilitiesView />
                  </DisabilityContextProvider>
               )
            }
         ]
      }
   ]
};

export default MainRoutes;
