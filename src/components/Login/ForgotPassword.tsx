import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from './Login.module.css';
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { requestPasswordReset } from "../../services/AuthService";
import logo from '../../assets/logo-sem-textura.png';
import imagemFundo from '../../assets/imagem-fundo-login.jpg';


const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setMessage(null);
        setLoading(true);

        //aguardar integração com o back
        try {
            await requestPasswordReset(email);

            setMessage("Se um usuário com este e-mail for encontrado, um link de redefinição de senha foi enviado. Verifique sua caixa de entrada e spam.");
            setEmail("");

        } catch (e: any) {
            setErr(e?.response?.data?.message ?? "Falha ao solicitar redefinição. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.containerTela}>

            <div className={styles.colunaImagem} style={{ backgroundImage: `url(${imagemFundo})` }}>
            </div>

            <div className={styles.colunaFormulario}>

                <Link to="/login" className={styles.botaoSair}>
                    <i className="pi pi-sign-out"></i>
                    <span>Voltar ao Login</span>
                </Link>

                <Card className={styles.cardLogin}>
                    <div className={styles.cabecalhoCard}>
                        <img src={logo} alt="Logo Germinai" className={styles.logoCard} />
                        <h1 className={styles.tituloCard}>Esqueci a Senha</h1>
                        <p className={styles.subtituloCard}>Insira seu e-mail para receber o link de redefinição.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.formulario}>

                        <div className={styles.campo}>
                            <label htmlFor="email" className={styles.labelCampo}>E-mail</label>
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.campoInput}
                                placeholder="voce@empresa.com"
                                required
                            />
                        </div>

                        {err && <div className={styles.mensagemErro}>{err}</div>}
                        {message && <div className={styles.mensagemSucesso}>{message}</div>}

                        <Button
                            type="submit"
                            label={loading ? "Enviando..." : "Enviar Link"}
                            className={styles.botaoEntrar}
                            disabled={loading}
                        />

                        <p className={styles.linkCadastroWrapper}>
                            Lembrou da senha?
                            <Link to="/login" className={styles.linkCadastro}>
                                Voltar ao Login
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;