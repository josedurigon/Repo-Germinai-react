import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

import {
  HiOutlineBars3,
  HiOutlineHome,
  HiOutlinePencil,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar,
  HiOutlineArchiveBox,
  HiOutlineCpuChip,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineBell,
  HiUser,
} from "react-icons/hi2";
import "./Sidebar.css";

// Tipagem do botão de navegação
type BotaoNavegacaoProps = {
  icone: React.ElementType;
  texto: string;
  ativo?: boolean;
  contador?: number;
  aoClicar?: () => void;
};

// Componente de cada botão da barra lateral
const BotaoNavegacao: React.FC<BotaoNavegacaoProps> = ({
  icone: Icone,
  texto,
  ativo,
  contador,
  aoClicar,
}) => {
  return (
    <button
      onClick={aoClicar}
      className={`botao-navegacao ${ativo ? "ativo" : ""}`}
    >
      <span className="icone-botao">
        <Icone className="icone" />
      </span>
      <span className="texto-botao">{texto}</span>
      {contador && <span className="contador-botao">{contador}</span>}
    </button>
  );
};

// Componente do perfil do usuário
const PerfilUsuario: React.FC = () => (
  <div className="perfil-usuario">
    <div className="avatar-usuario">
      <HiUser />
    </div>
    <div className="info-usuario">
      <p className="nome-usuario">Brooklyn Simmons</p>
      <p className="email-usuario">brooklyn@simmons.com</p>
    </div>
  </div>
);

// Componente principal da barra lateral
const BarraLateral: React.FC = () => {
  const [linkAtivo, setLinkAtivo] = useState<string>("Gestor Inteligente IA");
  const navigate = useNavigate();

  return (
    <> 
    <aside className="barra-lateral">
      <div className="cabecalho-barra">
        <h2>GERMINAI</h2>
      </div>
    
      <nav className="navegacao-barra">
        <BotaoNavegacao
          icone={HiOutlineHome}
          texto="Início"
          ativo={linkAtivo === "Início"}
          aoClicar={() => {
            setLinkAtivo("Início");
            navigate("/application/Inicio");
          }}
        />
        <BotaoNavegacao
          icone={HiOutlinePencil}
          texto="Cadastro"
          ativo={linkAtivo === "Cadastro"}
          aoClicar={() => {
            setLinkAtivo("Cadastro");
            navigate("/application/Cadastro");
          }}
        />
        <BotaoNavegacao
          icone={HiOutlineCalendar}
          texto="Atividades"
          ativo={linkAtivo === "Atividades"}
          aoClicar={() => {
            setLinkAtivo("Atividades");
            navigate("/application/atividades");
          }}
        />
        <BotaoNavegacao
          icone={HiOutlineDocumentText}
          texto="Gestão de safras"
          ativo={linkAtivo === "Gestão de safras"}
          aoClicar={() => {
            setLinkAtivo("Gestão de safras");
            navigate("/application/gestao-safras");
          }}
        />
        <BotaoNavegacao
          icone={HiOutlineCurrencyDollar}
          texto="Custos"
          ativo={linkAtivo === "Custos"}
          aoClicar={() => {
            setLinkAtivo("Custos");
            navigate("/application/custos");
          }}
        />
        <BotaoNavegacao
          icone={HiOutlineArchiveBox}
          texto="Estoque"
          ativo={linkAtivo === "Estoque"}
          aoClicar={() => {
            setLinkAtivo("Estoque");
            navigate("/application/estoque");
          }}
        />
        <BotaoNavegacao
          icone={HiOutlineCpuChip}
          texto="Gestor Inteligente IA"
          ativo={linkAtivo === "Gestor Inteligente IA"}
          aoClicar={() => {
            setLinkAtivo("Gestor Inteligente IA");
            navigate("/application/Previsao-preco");
          }}
        />
      </nav>

      <div className="rodape-barra">
        <nav>
          <BotaoNavegacao
            icone={HiOutlineBell}
            texto="Notificações"
            contador={10}
            ativo={linkAtivo === "Notificações"}
            aoClicar={() => {
              setLinkAtivo("Notificações");
              navigate("/application/notificacoes");
            }}
          />
          <BotaoNavegacao
            icone={HiOutlineArrowLeftOnRectangle}
            texto="Sair"
            aoClicar={() => alert("Saindo...")}
          />
        </nav>
        <PerfilUsuario />
      </div>
    </aside>
    </>
  );
};


export default BarraLateral;
