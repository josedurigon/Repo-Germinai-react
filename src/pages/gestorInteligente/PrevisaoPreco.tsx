import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BoxShadowPadrao from '../../components/box-shadow/BoxShadowPadrao';
import Sidebar from '../../components/Navegation/Sidebar';
import NavigationGerminai from '../../components/Navegation/NavegationGermini';
import './PrevisaoPreco.css';

const PrevisaoPreco = () => {
  return (
   <div className="pagina-container-pai"> 
   
      <main className="conteudo-previsao">

          <h1>Página de Previsão de Preço</h1>
          
          <BoxShadowPadrao>
         
            <h2>Cálculo de Previsão</h2>
          </BoxShadowPadrao>
   
      </main>

    </div>
  )
    
}

export default PrevisaoPreco;