import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './cadastro.module.css';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { register } from '../../services/AuthService';

import logo from '../../assets/logo-sem-textura.png';
import imagemFundoCadastro from '../../assets/plantas-soja.jpg';

const opcoesTipoProdutor = [
  { label: 'Pequeno Produtor', value: 'PEQUENO' },
  { label: 'Médio Produtor', value: 'MEDIO' },
];

const opcoesDiaSemana = [
  { label: 'Segunda-feira', value: 'SEG' },
  { label: 'Terça-feira', value: 'TER' },
  { label: 'Quarta-feira', value: 'QUA' },
  { label: 'Quinta-feira', value: 'QUI' },
  { label: 'Sexta-feira', value: 'SEX' },
  { label: 'Sábado', value: 'SAB' },
  { label: 'Domingo', value: 'DOM' },
];

const Cadastro: React.FC = () => {
  const navigate = useNavigate();

  const [dadosCadastro, setDadosCadastro] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    tipoProdutor: '',
    nomeFazenda: '',
    endereco: '',
    tamanhoPropriedade: 0,
    inicioSemana: '',
  });

  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [compartilharLocalizacao, setCompartilharLocalizacao] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [etapa, setEtapa] = useState(1);

  const handleInputChange = (e: any, name: string, value: any) => {
    setDadosCadastro((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev: any) => ({ ...prev, [name]: '' }));
  };

  const handleObterLocalizacao = () => {
    if (!navigator.geolocation) {
      console.error('Geolocalização não é suportada pelo navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (posicao) => {
        const { latitude, longitude } = posicao.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const endereco = data.display_name || 'Endereço não encontrado';
          setDadosCadastro((prev) => ({
            ...prev,
            endereco,
          }));
        } catch (erro) {
          console.error('Erro ao buscar endereço:', erro);
        }
      },
      (erro) => {
        console.error('Erro ao obter localização:', erro);
      }
    );
  };

  const validarEtapa1 = () => {
    const erros: any = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

    if (!dadosCadastro.nomeCompleto.trim())
      erros.nomeCompleto = 'O campo Nome Completo é obrigatório.';

    if (!dadosCadastro.email.trim())
      erros.email = 'O campo Email é obrigatório.';
    else if (!emailRegex.test(dadosCadastro.email))
      erros.email = 'Email inválido.';

    if (!dadosCadastro.senha.trim())
      erros.senha = 'O campo Senha é obrigatório.';
    else if (dadosCadastro.senha.length < 6)
      erros.senha = 'A senha deve ter no mínimo 6 caracteres.';

    if (!dadosCadastro.confirmarSenha.trim())
      erros.confirmarSenha = 'É necessário confirmar a senha.';
    else if (
      dadosCadastro.senha &&
      dadosCadastro.confirmarSenha &&
      dadosCadastro.senha !== dadosCadastro.confirmarSenha
    )
      erros.confirmarSenha = 'As senhas não coincidem.';

    if (!dadosCadastro.telefone.trim())
      erros.telefone = 'O campo Telefone é obrigatório.';
    else if (!telefoneRegex.test(dadosCadastro.telefone))
      erros.telefone = 'Telefone inválido.';

    return erros;
  };

  const validarEtapa2 = () => {
    const erros: any = {};
    if (!dadosCadastro.tipoProdutor)
      erros.tipoProdutor = 'Selecione o tipo de produtor.';
    if (!dadosCadastro.nomeFazenda.trim())
      erros.nomeFazenda = 'O campo Nome da Fazenda é obrigatório.';
    if (!dadosCadastro.tamanhoPropriedade)
      erros.tamanhoPropriedade = 'Informe o tamanho da propriedade.';
    if (!dadosCadastro.inicioSemana)
      erros.inicioSemana = 'Selecione o início da semana.';
    if (!dadosCadastro.endereco.trim())
      erros.endereco = 'O campo Endereço é obrigatório.';
    return erros;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const erros = etapa === 1 ? validarEtapa1() : validarEtapa2();

    if (Object.keys(erros).length > 0) {
      setFieldErrors(erros);
      return;
    }

    if (etapa === 1) {
      setEtapa(2);
      return;
    }

    setLoading(true);
    try {
      const userData = {
        username: dadosCadastro.nomeCompleto.toLowerCase().replace(/\s+/g, ''),
        email: dadosCadastro.email,
        password: dadosCadastro.senha,
        nomeCompleto: dadosCadastro.nomeCompleto,
        telefone: dadosCadastro.telefone,
        tipoProdutor: dadosCadastro.tipoProdutor,
        nomeFazenda: dadosCadastro.nomeFazenda,
        endereco: dadosCadastro.endereco,
        tamanhoPropriedade: dadosCadastro.tamanhoPropriedade,
        inicioSemana: dadosCadastro.inicioSemana,
      };

      console.log('Enviando dados de cadastro:', userData);

      const response = await register(userData);

      console.log('Cadastro realizado com sucesso:', response);

      alert('Cadastro realizado com sucesso! Faça login para continuar.');

      navigate('/login');

    } catch (e: any) {
      console.error('Erro no cadastro:', e);

      let errorMessage = 'Falha no cadastro. Tente novamente.';

      if (e.response) {
        const backendMsg = e.response.data?.message || e.response.data?.error;

        if (
          e.response.status === 409 ||
          (backendMsg && (backendMsg.includes('existe') || backendMsg.includes('exists')))
        ) {
          errorMessage = 'Este e-mail ou usuário já está cadastrado.';
        } else if (backendMsg) {
          errorMessage = backendMsg;
        } else {
          errorMessage = 'Erro ao processar o cadastro.';
        }
      } else if (e.request) {
        errorMessage = 'Erro de conexão com o servidor.';
      }

      setErr(errorMessage);
    } finally {

      setLoading(false);
    }
  };

  return (
    <div className={styles.containerTela} style={{ overflow: 'hidden', height: '100vh' }}>
      <div
        className={styles.colunaImagem}
        style={{ backgroundImage: `url(${imagemFundoCadastro})` }}
      >
        <div className={styles.efeitosGraficos}></div>
      </div>

      <div className={styles.colunaFormulario}>
        <Link to="/login" className={styles.botaoSair}>
          <i className="pi pi-sign-out"></i>
          <span>Voltar</span>
        </Link>

        <Card
          className={`${styles.cardLogin} ${styles.cardCadastro}`}
          style={{
            width: '90%',
            maxWidth: '450px',
            padding: '2rem 2.5rem',
            boxShadow: '0 0 18px rgba(0,0,0,0.1)',
          }}
        >
          <div className={styles.cabecalhoCard}>
            <img src={logo} alt="Logo Germinai" className={styles.logoCard} />
            <h1 className={styles.tituloCard}>
              {etapa === 1 ? 'Dados Pessoais' : 'Dados da Propriedade'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className={styles.formularioCadastro}>
            {etapa === 1 && (
              <>
                <div className={styles.linhaCampos}>
                  <div className={styles.campoMetade}>
                    <label htmlFor="nomeCompleto" className={styles.labelCampo}>
                      Nome Completo *
                    </label>
                    <InputText
                      id="nomeCompleto"
                      value={dadosCadastro.nomeCompleto}
                      onChange={(e) =>
                        handleInputChange(e, 'nomeCompleto', e.target.value)
                      }
                      className={styles.campoInput}
                      placeholder="Seu nome"
                    />
                    {fieldErrors.nomeCompleto && (
                      <small className={styles.mensagemErro}>{fieldErrors.nomeCompleto}</small>
                    )}
                  </div>
                </div>

                <div className={styles.linhaCampos}>
                  <div className={styles.campoMetade}>
                    <label htmlFor="email" className={styles.labelCampo}>
                      Email *
                    </label>
                    <InputText
                      id="email"
                      type="email"
                      value={dadosCadastro.email}
                      onChange={(e) => handleInputChange(e, 'email', e.target.value)}
                      className={styles.campoInput}
                      placeholder="email@exemplo.com"
                    />
                    {fieldErrors.email && (
                      <small className={styles.mensagemErro}>{fieldErrors.email}</small>
                    )}
                  </div>

                  <div className={styles.campoMetade}>
                    <label htmlFor="senha" className={styles.labelCampo}>
                      Senha *
                    </label>
                    <Password
                      id="senha"
                      value={dadosCadastro.senha}
                      onChange={(e) => handleInputChange(e, 'senha', e.target.value)}
                      feedback={false}
                      className={styles.campoInput}
                      placeholder="Senha"
                    />
                    {fieldErrors.senha && (
                      <small className={styles.mensagemErro}>{fieldErrors.senha}</small>
                    )}
                  </div>
                </div>

                <div className={styles.linhaCampos}>
                  <div className={styles.campoMetade}>
                    <label htmlFor="confirmarSenha" className={styles.labelCampo}>
                      Confirmar Senha *
                    </label>
                    <Password
                      id="confirmarSenha"
                      value={dadosCadastro.confirmarSenha}
                      onChange={(e) =>
                        handleInputChange(e, 'confirmarSenha', e.target.value)
                      }
                      feedback={false}
                      className={styles.campoInput}
                      placeholder="Confirme a senha"
                    />
                    {fieldErrors.confirmarSenha && (
                      <small className={styles.mensagemErro}>{fieldErrors.confirmarSenha}</small>
                    )}
                  </div>

                  <div className={styles.campoMetade}>
                    <label htmlFor="telefone" className={styles.labelCampo}>
                      Telefone *
                    </label>
                    <InputText
                      id="telefone"
                      value={dadosCadastro.telefone}
                      onChange={(e) => handleInputChange(e, 'telefone', e.target.value)}
                      className={styles.campoInput}
                      placeholder="(XX) XXXXX-XXXX"
                    />
                    {fieldErrors.telefone && (
                      <small className={styles.mensagemErro}>{fieldErrors.telefone}</small>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  label="Próximo"
                  className={styles.botaoEntrar}
                />
              </>
            )}

            {etapa === 2 && (
              <>
                <div className={styles.linhaCampos}>
                  <div className={styles.campoMetade}>
                    <label htmlFor="tipoProdutor" className={styles.labelCampo}>
                      Tipo de produtor *
                    </label>
                    <Dropdown
                      id="tipoProdutor"
                      value={dadosCadastro.tipoProdutor}
                      options={opcoesTipoProdutor}
                      onChange={(e) => handleInputChange(e, 'tipoProdutor', e.value)}
                      placeholder="Selecione"
                      className={styles.campoInput}
                    />
                    {fieldErrors.tipoProdutor && (
                      <small className={styles.mensagemErro}>{fieldErrors.tipoProdutor}</small>
                    )}
                  </div>

                  <div className={styles.campoMetade}>
                    <label htmlFor="nomeFazenda" className={styles.labelCampo}>
                      Nome da fazenda *
                    </label>
                    <InputText
                      id="nomeFazenda"
                      value={dadosCadastro.nomeFazenda}
                      onChange={(e) => handleInputChange(e, 'nomeFazenda', e.target.value)}
                      className={styles.campoInput}
                      placeholder="Nome da fazenda"
                    />
                    {fieldErrors.nomeFazenda && (
                      <small className={styles.mensagemErro}>{fieldErrors.nomeFazenda}</small>
                    )}
                  </div>
                </div>

                <div className={styles.linhaCampos}>
                  <div className={styles.campoMetade}>
                    <label htmlFor="tamanhoPropriedade" className={styles.labelCampo}>
                      Tamanho (ha) *
                    </label>
                    <InputNumber
                      id="tamanhoPropriedade"
                      value={dadosCadastro.tamanhoPropriedade}
                      onValueChange={(e) => handleInputChange(e, 'tamanhoPropriedade', e.value)}
                      className={styles.campoInput}
                      placeholder="Hectares"
                    />
                    {fieldErrors.tamanhoPropriedade && (
                      <small className={styles.mensagemErro}>{fieldErrors.tamanhoPropriedade}</small>
                    )}
                  </div>

                  <div className={styles.campoMetade}>
                    <label htmlFor="inicioSemana" className={styles.labelCampo}>
                      Início da semana *
                    </label>
                    <Dropdown
                      id="inicioSemana"
                      value={dadosCadastro.inicioSemana}
                      options={opcoesDiaSemana}
                      onChange={(e) => handleInputChange(e, 'inicioSemana', e.value)}
                      className={styles.campoInput}
                      placeholder="Selecione o dia"
                    />
                    {fieldErrors.inicioSemana && (
                      <small className={styles.mensagemErro}>{fieldErrors.inicioSemana}</small>
                    )}
                  </div>
                </div>

                <div className={styles.campo}>
                  <label htmlFor="endereco" className={styles.labelCampo}>
                    Endereço da propriedade *
                  </label>
                  <InputText
                    id="endereco"
                    value={dadosCadastro.endereco}
                    onChange={(e) => handleInputChange(e, 'endereco', e.target.value)}
                    className={styles.campoInput}
                    placeholder="Ex: Fazenda Boa Esperança, Zona Rural"
                  />
                  {fieldErrors.endereco && (
                    <small className={styles.mensagemErro}>{fieldErrors.endereco}</small>
                  )}

                  <div className={styles.opcaoLocalizacao}>
                    <Checkbox
                      inputId="localizacao"
                      checked={compartilharLocalizacao}
                      onChange={(e) => {
                        setCompartilharLocalizacao(e.checked ?? false);
                        if (e.checked) handleObterLocalizacao();
                      }}
                    />
                    <label htmlFor="localizacao">
                      Permitir compartilhamento de localização
                    </label>
                  </div>
                </div>

                {err && <div className={styles.mensagemErro} style={{ marginTop: '1rem' }}>{err}</div>}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <Button
                    label="Voltar"
                    type="button"
                    onClick={() => setEtapa(1)}
                    className={styles.botaoEntrar}
                    outlined
                  />
                  <Button
                    type="submit"
                    label={loading ? 'Cadastrando...' : 'Cadastrar'}
                    className={styles.botaoEntrar}
                    disabled={loading}
                  />
                </div>
              </>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;