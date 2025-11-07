import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from '../../components/Navegation/Sidebar';
import NavigationGerminai from '../../components/Navegation/NavegationGermini';
import './PrevisaoPreco.css';

const PrevisaoPreco = () => {
  return (
   <div className="pagina-previsao-container-pai"> 
      <Sidebar />

      {/* 2. Adicionando o conteúdo da página */}
      <main className="conteudo-previsao">

        <NavigationGerminai/>

        <div className="conteudo-principal-wrapper">
          <h1>Página de Previsão de Preço</h1>
      

        </div>
      </main>

    </div>
  )
    
}

export default PrevisaoPreco;