import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("access_token");
  const location = useLocation();
  {/** configuração correta do token de acesso do login que estava antes:
    const ok = token && isTokenValid(token);*/}
    const ok = true; // ⚠️ só pra teste

  return ok ? <Outlet/> : <Navigate to="/login" replace state={{ from: location }} />;
}

function isTokenValid(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = parts[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    if (!json.exp) return false;
    return Date.now() < json.exp * 1000;
  } catch {
    return false;
  }
}
