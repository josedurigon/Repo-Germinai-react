import { Outlet } from "react-router-dom";
import SidebarMenu from "../../src/components/SideBarMenu";
import { useState } from "react";
import "../../src/styles/layouts/AppLayout.css";

const AppLayout: React.FC = () => {

    const [collapsed, setCollapsed] = useState(false);

    return (
    <div id="app-root">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">GERMINAI</div>
        <SidebarMenu />
        <button
          className={`sidebar-toggle ${collapsed ? "collapsed" : ""}`}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
        </button>
      </aside>

      {/* Conteúdo */}
      <main className={`content ${collapsed ? "expanded" : ""}`}>
        <header className="topbar">Área Logada</header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );

};

export default AppLayout;
