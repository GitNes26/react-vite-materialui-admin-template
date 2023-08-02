import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import SchoolView from "../views/admin/SchoolsView";
import LevelsView from "../views/admin/LevelsView";

// dashboard routing
const DashboardDefault = Loadable(
   lazy(() => import("../views/dashboard/Default"))
);

// utilities routing
const UtilsTypography = Loadable(
   lazy(() => import("../views/utilities/Typography"))
);
const UtilsColor = Loadable(lazy(() => import("../views/utilities/Color")));
const UtilsShadow = Loadable(lazy(() => import("../views/utilities/Shadow")));
const UtilsMaterialIcons = Loadable(
   lazy(() => import("../views/utilities/MaterialIcons"))
);
const UtilsTablerIcons = Loadable(
   lazy(() => import("../views/utilities/TablerIcons"))
);

// sample page routing
const SamplePage = Loadable(lazy(() => import("../views/sample-page")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
   path: "/admin",
   element: <MainLayout />,
   children: [
      {
         index: true,
         element: <DashboardDefault />
      },
      {
         path: "dashboard",
         element: <DashboardDefault />
      },
      {
         path: "catalogos",
         children: [
            {
               path: "escuelas",
               element: <SchoolView />
            },
            {
               path: "niveles",
               element: <LevelsView />
            }
         ]
      },

      {
         path: "utils",
         children: [
            {
               path: "util-typography",
               element: <UtilsTypography />
            },
            {
               path: "util-color",
               element: <UtilsColor />
            },
            {
               path: "util-shadow",
               element: <UtilsShadow />
            }
         ]
      },
      {
         path: "icons",
         children: [
            {
               path: "tabler-icons",
               element: <UtilsTablerIcons />
            },
            {
               path: "material-icons",
               element: <UtilsMaterialIcons />
            }
         ]
      },
      {
         path: "sample-page",
         element: <SamplePage />
      }
   ]
};

export default MainRoutes;
