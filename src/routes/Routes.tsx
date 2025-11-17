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
import GestaoSafras from '../components/GestaoSafra/GestaoSafras'; 
import Custos from '../pages/gestao-financeira/Gestao-financeira';
import RegistroVendas from '../pages/RegistroVendas/RegistroVendas';
import CadastroItensSistema from '../pages/cadastro/CadastroItensSistema';
import ContasAPagarReceber from '../pages/ContasAPagarReceber/ContasAPagarReceber';
import Estoque from '../pages/estoque/Estoque';
import Notificacoes from '../pages/notificacoes/Notificacoes';
import Inicio from '../pages/inicio/Inicio';
import GestaoCompras from '../pages/Compras/GestaoCompras';
import Culturas from '../pages/culturas/Culturas';
import CulturaForm from '../pages/culturas/CulturaForm';
import Talhoes from '../pages/talhoes/Talhoes';
import TalhaoForm from '../pages/talhoes/TalhaoForm';
import Recursos from '../pages/recursos/Recursos';
import RecursoForm from '../pages/recursos/RecursoForm';
import Funcionarios from '../pages/funcionarios/Funcionarios';
import FuncionarioForm from '../pages/funcionarios/FuncionarioForm';
import Safras from '../pages/safra/Safras';
import SafraForm from '../pages/safra/SafraForm';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="home" element={<Homepage />} />
      <Route path="/sobre-nos" element={<AboutUs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueci-senha" element={<ResetPasswordWithCode />} /> 
      
      <Route element={<ProtectedRoute />}>
        <Route path="/application" element={<AppLayout />}>
          <Route path="Inicio" element={<Inicio />} />
          <Route path="user" element={<UserRegister />} />
          <Route path="users" element={<UserList />} />
          <Route path="reports" element={<h1>Reports</h1>} />
          <Route path="atividades" element={<Atividades />} />
          <Route path="gestao-safras" element={<GestaoSafras />} /> 
          <Route path="custos" element={<Custos />} /> 
          <Route path="estoque" element={<Estoque />} />
          <Route path="previsao-preco" element={<PrevisaoPreco />} />
          <Route path="notificacoes" element={<Notificacoes />} />
          <Route path="gestao-compras" element={<GestaoCompras />} />
          <Route path="registro-vendas" element={<RegistroVendas />} />
          <Route path="cadastro-itens-sistema" element={<CadastroItensSistema />} />
          <Route path="contas-pagar-receber" element={<ContasAPagarReceber />} />
          
          {/* Rotas de Culturas */}
          <Route path="culturas" element={<Culturas />} />
          <Route path="culturas/novo" element={<CulturaForm />} />
          <Route path="culturas/editar/:id" element={<CulturaForm />} />
          
          {/* Rotas de Talhões */}
          <Route path="talhoes" element={<Talhoes />} />
          <Route path="talhoes/novo" element={<TalhaoForm />} />
          <Route path="talhoes/editar/:id" element={<TalhaoForm />} />
          
          {/* Rotas de Recursos */}
          <Route path="recursos" element={<Recursos />} />
          <Route path="recursos/novo" element={<RecursoForm />} />
          <Route path="recursos/editar/:id" element={<RecursoForm />} />
          
          {/* Rotas de Funcionários */}
          <Route path="funcionarios" element={<Funcionarios />} />
          <Route path="funcionarios/novo" element={<FuncionarioForm />} />
          <Route path="funcionarios/editar/:id" element={<FuncionarioForm />} />
          
          {/* Rotas de Safras */}
          <Route path="safras" element={<Safras />} />
          <Route path="safras/novo" element={<SafraForm />} />
          <Route path="safras/editar/:id" element={<SafraForm />} />
        </Route>
      </Route>
      
      <Route path="*" element={<h1>Página Não Encontrada (404)</h1>} />
    </Routes>
  );
};

export default AppRoutes;