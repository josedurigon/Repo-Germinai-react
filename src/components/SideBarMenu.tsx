// src/components/SidebarMenu.tsx
import React, { useRef } from "react";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { useNavigate } from "react-router-dom";
import '../../src/styles/components/SideBarMenu.css';


const SidebarMenu: React.FC = () => {
    const menuRef = useRef<Menu>(null);
    const navigate = useNavigate();
    colapsed: Boolean;


  const items: MenuItem[] = [
    
    { label: "Home", icon: "pi pi-home", command: () => {navigate("/application/home")} },
    { label: "Usuários", icon: "pi pi-users", items:[
      { label: "Listar Usuários", icon: "pi pi-list" },
      { label: "Criar Usuário", icon: "pi pi-plus" }
    ] },
    { label: "Relatórios", icon: "pi pi-chart-bar", items:[
      { label: "Relatório de Eventos", icon: "pi pi-file" },
      ] 
    },
    
  ];

  return (
     <div className="sidebar">
      <Menu model={items} ref={menuRef} />
    </div>
   );
};

export default SidebarMenu;
