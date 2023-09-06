// assets
import { IconBrandChrome, IconHelp, IconBuildingSkyscraper, IconNumber, IconAspectRatio } from "@tabler/icons";

// constant
const icons = { IconBrandChrome, IconHelp, IconBuildingSkyscraper, IconNumber, IconAspectRatio };

// ==============================|| PAGINAS DISPONIBLES PARA UN ADMIN ||============================== //

const catalogs = {
   id: "catalogs",
   title: "Catalogos",
   caption: "Gestion de catalogos",
   type: "group",
   children: [
      {
         id: "admin-school",
         title: "Escuelas",
         type: "item",
         url: "/admin/catalogos/escuelas",
         icon: icons.IconBuildingSkyscraper,
         breadcrumbs: false
      },
      {
         id: "admin-levels",
         title: "Niveles",
         type: "item",
         url: "/admin/catalogos/niveles",
         icon: icons.IconNumber
      },
      {
         id: "admin-perimeters",
         title: "Perímetros",
         type: "item",
         url: "/admin/catalogos/perimetros",
         icon: icons.IconAspectRatio
      }
   ]
};

export default catalogs;
