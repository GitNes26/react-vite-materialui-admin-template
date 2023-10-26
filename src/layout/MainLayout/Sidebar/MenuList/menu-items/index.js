import dashboard from "./dashboard";
import catalogs from "./catalogs";

import * as tablerIcons from "@tabler/icons";

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
   items: [
      dashboard,
      admin,
      catalogs,
      {
         id: "request",
         title: "Mis Solicitudes",
         caption: "Solicitudes Realizadas",
         type: "group",
         children: [
            {
               id: "request-list",
               title: "Solicitudes",
               type: "item",
               url: "/solicitudes/",
               icon: tablerIcons["IconStack3"]
            },
            {
               id: "my-request",
               title: "Mis Solicitudes",
               type: "item",
               url: "/solicitudes/mis-solicitudes",
               icon: tablerIcons["IconFileStack"],
               breadcrumbs: false
            }
         ]
      }
   ]
};

export default menuItems;
