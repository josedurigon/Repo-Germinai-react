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
    {
      label: "Safra",
      icon: "pi pi-sun",
      items:[
        { label: "Listar Safras", icon: "pi pi-list", command: () => {navigate("/application/safras")} },
        { label: "Nova Safra", icon: "pi pi-plus", command: () => {navigate("/application/safra/criar")} }
      ]
    },
    { label: "Atividades", icon: "pi pi-calendar", command: () => {navigate("/application/atividades")} },
    { label: "Custos", icon: "pi pi-dollar", command: () => {navigate("/application/custos")} },
    { label: "Estoque", icon: "pi pi-box", command: () => {navigate("/application/estoque")} },
    { label: "Usuários", icon: "pi pi-users", items:[
      { label: "Listar Usuários", icon: "pi pi-list", command: () => {navigate("/application/users")} },
      { label: "Criar Usuário", icon: "pi pi-plus", command: () => {navigate("/application/user")} }
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
