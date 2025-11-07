import { Outlet } from "react-router-dom";
import Sidebar from "../components/Navegation/Sidebar";
import Navigation from "../components/Navegation/NavegationGermini";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Sidebar />
      </aside>

      <div className="main-content">
        <header className="navigation">
          <Navigation />
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
