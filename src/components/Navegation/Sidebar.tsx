import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getMe } from '../../services/AuthService';

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

// Componente do perfil do usuário (aceita props para manter compatibilidade)
type PerfilUsuarioProps = {
  username?: string;
  email?: string;
};

const PerfilUsuario: React.FC<PerfilUsuarioProps> = ({
  username = 'Brooklyn Simmons',
  email = 'brooklyn@simmons.com',
}) => (
  <div className="perfil-usuario">
    <div className="avatar-usuario">
      <HiUser />
    </div>
    <div className="info-usuario">
      <p className="nome-usuario">{username}</p>
      <p className="email-usuario">{email}</p>
    </div>
  </div>
);


// Componente principal da barra lateral
const BarraLateral: React.FC = () => {
  const [linkAtivo, setLinkAtivo] = useState<string>("Gestor Inteligente IA");
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await getMe();
        if (!mounted) return;
        // Username: keep as-is (may be display name or login)
        if (u.username) setUsername(u.username);

        // Email resolution priority:
        // 1) explicit u.email from API
        // 2) if u.username looks like an email (contains '@'), use it
        // 3) fallback to token-based inference (handled below)
        if (u.email) {
          setEmail(u.email);
        } else if (u.username && String(u.username).includes("@")) {
          setEmail(u.username);
        } else {
          // try token fallback below (reuse the same logic as in catch)
          const token = localStorage.getItem('access_token');
          if (token) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const possibleEmail = payload.email || payload.user_email || payload.preferred_username || (payload.sub && String(payload.sub).includes('@') ? payload.sub : undefined);
              if (possibleEmail) setEmail(possibleEmail);
            } catch {
              // ignore token parse errors
            }
          }
        }
      } catch {
        // If getMe fails, try to infer from the token payload
        try {
          const token = localStorage.getItem('access_token');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (!mounted) return;
            setUsername(payload.sub || payload.username || undefined);
            const possibleEmail = payload.email || payload.user_email || payload.preferred_username || (payload.sub && String(payload.sub).includes('@') ? payload.sub : undefined);
            if (possibleEmail) setEmail(possibleEmail);
          }
        } catch {
          // ignore
        }
      }
    })();
    return () => { mounted = false; };
  }, []);
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
            navigate("/application/cadastro-itens-sistema");
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
          texto="Custos e Gestão Financeira"
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
            aoClicar={() => {
              // Limpa dados de autenticação
              localStorage.removeItem("access_token");
              sessionStorage.clear();
              
              navigate("/home", { replace: true });
          }}
          />
        </nav>
        <PerfilUsuario username={username} email={email} />
      </div>
    </aside>
    </>
  );
};


export default BarraLateral;
