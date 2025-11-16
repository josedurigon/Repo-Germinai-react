import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../components/Login/Login';
import Homepage from '../pages/auth/Homepage';
import UserRegister from '../pages/user/CreateUser';
import UserList from '../pages/user/ListUsers';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import AboutUs from '../components/AboutUs/AboutUs';
import ResetPasswordWithCode from '../components/Login/ResetPasswordWithCode';
import Cadastro from '../components/TelaCadastro/cadastro';
import PrevisaoPreco from '../pages/gestorInteligente/PrevisaoPreco';
import Atividades from '../pages/atividades/Atividades';
import GestaoSafras from '../components/GestaoSafra/GestaoSafras'; // ← CORRIJA AQUI
import Custos from '../pages/gestao-financeira/Gestao-financeira';
import RegistroVendas from '../pages/RegistroVendas/RegistroVendas';
import CadastroItensSistema from '../pages/cadastro/CadastroItensSistema';
import ContasAPagarReceber from '../pages/ContasAPagarReceber/ContasAPagarReceber';
import Estoque from '../pages/estoque/Estoque';
import Notificacoes from '../pages/notificacoes/Notificacoes';
import Inicio from '../pages/inicio/Inicio';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="home" element={<Homepage />} />
      <Route path="/sobre-nos" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<ResetPasswordWithCode />} /> {/* ← CORRIJA AQUI */}
      
      <Route element={<ProtectedRoute />}>
        <Route path="/application" element={<AppLayout />}>
          <Route path="Inicio" element={<Inicio />} />
          <Route path="user" element={<UserRegister />} />
          <Route path="users" element={<UserList />} />
          <Route path="reports" element={<h1>Reports</h1>} />
          <Route path="cadastro" element={<Cadastro />} />
          <Route path="atividades" element={<Atividades />} />
          <Route path="gestao-safras" element={<GestaoSafras />} /> {/* ✅ OK */}
          {/* <Route path="custos" element={<Custos />} /> */}
          <Route path="estoque" element={<Estoque />} />
          <Route path="previsao-preco" element={<PrevisaoPreco />} />
          <Route path="notificacoes" element={<Notificacoes />} />
        </Route>
      </Route>
      
      <Route path="*" element={<h1>Página Não Encontrada (404)</h1>} />
    </Routes>
  );
};

export default AppRoutes;