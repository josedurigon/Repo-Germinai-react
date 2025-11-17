import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import styles from './Login.module.css';
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { resetPassword, validateResetToken } from "../../services/AuthService";
import logo from '../../assets/logo-sem-textura.png';
import imagemFundo from '../../assets/imagem-fundo-login.jpg';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [validatingToken, setValidatingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setErr("Token inválido ou ausente");
            setValidatingToken(false);
            return;
        }

        validateToken();
    }, [token]);

    async function validateToken() {
        try {
            const isValid = await validateResetToken(token!);
            setTokenValid(isValid);
            if (!isValid) {
                setErr("Token inválido ou expirado. Solicite um novo link de redefinição.");
            }
        } catch (e) {
            setErr("Erro ao validar token. Tente novamente.");
            setTokenValid(false);
        } finally {
            setValidatingToken(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setMessage(null);

        if (newPassword.length < 6) {
            setErr("A senha deve ter no mínimo 6 caracteres");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErr("As senhas não coincidem");
            return;
        }

        setLoading(true);

        try {
            await resetPassword(token!, newPassword);
            setMessage("Senha redefinida com sucesso! Redirecionando para o login...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (e: any) {
            setErr(e?.response?.data?.message ?? e.message ?? "Erro ao redefinir senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    if (validatingToken) {
        return (
            <div className={styles.containerTela}>
                <div className={styles.colunaImagem} style={{ backgroundImage: `url(${imagemFundo})` }}></div>
                <div className={styles.colunaFormulario}>
                    <Card className={styles.cardLogin}>
                        <div className={styles.cabecalhoCard}>
                            <img src={logo} alt="Logo Germinai" className={styles.logoCard} />
                            <h1 className={styles.tituloCard}>Validando...</h1>
                            <p className={styles.subtituloCard}>Aguarde enquanto validamos seu token.</p>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className={styles.containerTela}>
                <div className={styles.colunaImagem} style={{ backgroundImage: `url(${imagemFundo})` }}></div>
                <div className={styles.colunaFormulario}>
                    <Card className={styles.cardLogin}>
                        <div className={styles.cabecalhoCard}>
                            <img src={logo} alt="Logo Germinai" className={styles.logoCard} />
                            <h1 className={styles.tituloCard}>Link Inválido</h1>
                            <p className={styles.subtituloCard}>{err}</p>
                        </div>
                        <div className={styles.formulario}>
                            <Link to="/esqueci-senha">
                                <Button label="Solicitar novo link" className={styles.botaoEntrar} />
                            </Link>
                            <p className={styles.linkCadastroWrapper}>
                                <Link to="/login" className={styles.linkCadastro}>
                                    Voltar ao Login
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.containerTela}>
            <div className={styles.colunaImagem} style={{ backgroundImage: `url(${imagemFundo})` }}></div>

            <div className={styles.colunaFormulario}>
                <Link to="/login" className={styles.botaoSair}>
                    <i className="pi pi-sign-out"></i>
                    <span>Voltar ao Login</span>
                </Link>

                <Card className={styles.cardLogin}>
                    <div className={styles.cabecalhoCard}>
                        <img src={logo} alt="Logo Germinai" className={styles.logoCard} />
                        <h1 className={styles.tituloCard}>Redefinir Senha</h1>
                        <p className={styles.subtituloCard}>Insira sua nova senha abaixo.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.formulario}>
                        <div className={styles.campo}>
                            <label htmlFor="newPassword" className={styles.labelCampo}>Nova Senha</label>
                            <Password
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className={styles.campoInput}
                                inputClassName={styles.inputInner}
                                toggleMask
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="confirmPassword" className={styles.labelCampo}>Confirmar Senha</label>
                            <Password
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.campoInput}
                                inputClassName={styles.inputInner}
                                feedback={false}
                                toggleMask
                                placeholder="Digite a senha novamente"
                                required
                            />
                        </div>

                        {err && <div className={styles.mensagemErro}>{err}</div>}
                        {message && <div className={styles.mensagemSucesso}>{message}</div>}

                        <Button
                            type="submit"
                            label={loading ? "Redefinindo..." : "Redefinir Senha"}
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

export default ResetPassword;
