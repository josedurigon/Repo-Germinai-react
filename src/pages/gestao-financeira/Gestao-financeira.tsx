import React from 'react';
import BoxShadowPadrao from '../../components/box-shadow/BoxShadowPadrao';
import CardFinanceiro from '../../components/CardFinanceiro/CardFinanceiro';
import { Card } from 'primereact/card';
import './Gestao-financeira.css';

const Custos = () => {
  return (
    <div className="pagina-container-pai">
      <main className="conteudo-previsao">
        <h1 className="titulo-pagina-gestao">Custos e Gestão Financeira</h1>

        <BoxShadowPadrao>
          <div className="gestao-financeira">

            <div className="cards-grid">

              <CardFinanceiro >  
                  <h3 className='title-card-finan'>Gestão de Pedidos de Compra</h3>
              
                  <p>
                  Registre e acompanhe solicitações de compra de insumos e
                  materiais.
                </p>
                <button className="btn-acessar">Gerenciar Pedidos</button>
              </CardFinanceiro>
              

              <CardFinanceiro>
                <h3 className='title-card-finan'>Registro de Vendas</h3>
                <p>
                  Registre vendas com detalhes de cliente, produto, valor e status do
                  pagamento.
                </p>
                <button className="btn-acessar">Registrar Venda</button>
              </CardFinanceiro>

              <CardFinanceiro>
                <h3 className='title-card-finan'>Contas a Pagar e a Receber</h3>
                <p>
                  Cadastre e acompanhe suas contas, visualize vencimentos e receba
                  alertas de pagamentos e recebimentos.
                </p>
                <button className="btn-acessar">Ver Contas</button>
              </CardFinanceiro>

            </div>
          </div>
        </BoxShadowPadrao>
      </main>
    </div>
  );
};

export default Custos;
