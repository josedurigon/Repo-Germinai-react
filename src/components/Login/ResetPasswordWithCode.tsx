import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from './Login.module.css';
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { requestPasswordReset, resetPassword, validateResetToken } from "../../services/AuthService";
import logo from '../../assets/logo-sem-textura.png';
import imagemFundo from '../../assets/imagem-fundo-login.jpg';

type Step = 'email' | 'code' | 'password';

const ResetPasswordWithCode: React.FC = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    // Passo 1: Solicitar código
    async function handleRequestCode(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setMessage(null);
        setLoading(true);

        try {
            await requestPasswordReset(email);
            setMessage("Código enviado! Verifique o console do backend.");
            setStep('code');
        } catch (e: any) {
            setErr(e?.response?.data?.message ?? "Erro ao solicitar código. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    // Passo 2: Validar código
    async function handleValidateCode(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setMessage(null);

        if (code.length !== 6) {
            setErr("O código deve ter 6 dígitos");
            return;
        }

        setLoading(true);

        try {
            const isValid = await validateResetToken(code);
            if (isValid) {
                setMessage("Código válido! Agora defina sua nova senha.");
                setStep('password');
            } else {
                setErr("Código inválido ou expirado. Tente novamente.");
            }
        } catch (e: any) {
            setErr("Erro ao validar código. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    // Passo 3: Redefinir senha
    async function handleResetPassword(e: React.FormEvent) {
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
            await resetPassword(code, newPassword);
            setMessage("Senha redefinida com sucesso! Redirecionando...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (e: any) {
            setErr(e?.response?.data?.message ?? e.message ?? "Erro ao redefinir senha. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    function handleBackToEmail() {
        setStep('email');
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
        setErr(null);
        setMessage(null);
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

                        {step === 'email' && (
                            <>
                                <h1 className={styles.tituloCard}>Esqueci a Senha</h1>
                                <p className={styles.subtituloCard}>
                                    Insira seu e-mail para receber o código de verificação.
                                </p>
                            </>
                        )}

                        {step === 'code' && (
                            <>
                                <h1 className={styles.tituloCard}>Digite o Código</h1>
                                <p className={styles.subtituloCard}>
                                    Um código de 6 dígitos foi enviado. Verifique o console do backend.
                                </p>
                            </>
                        )}

                        {step === 'password' && (
                            <>
                                <h1 className={styles.tituloCard}>Nova Senha</h1>
                                <p className={styles.subtituloCard}>
                                    Código validado! Agora escolha sua nova senha.
                                </p>
                            </>
                        )}
                    </div>

                    {/* PASSO 1: EMAIL */}
                    {step === 'email' && (
                        <form onSubmit={handleRequestCode} className={styles.formulario}>
                            <div className={styles.campo}>
                                <label htmlFor="email" className={styles.labelCampo}>E-mail</label>
                                <InputText
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.campoInput}
                                    placeholder="voce@empresa.com"
                                    required
                                    autoFocus
                                />
                            </div>

                            {err && <div className={styles.mensagemErro}>{err}</div>}
                            {message && <div className={styles.mensagemSucesso}>{message}</div>}

                            <Button
                                type="submit"
                                label={loading ? "Enviando..." : "Enviar Código"}
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
                    )}

                    {/* PASSO 2: CÓDIGO */}
                    {step === 'code' && (
                        <form onSubmit={handleValidateCode} className={styles.formulario}>
                            <div className={styles.campo}>
                                <label htmlFor="code" className={styles.labelCampo}>Código de Verificação</label>
                                <InputText
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className={styles.campoInput}
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                    autoFocus
                                    style={{ fontSize: '24px', textAlign: 'center', letterSpacing: '8px' }}
                                />
                                <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                                    Digite os 6 dígitos que aparecem no console do backend
                                </small>
                            </div>

                            {err && <div className={styles.mensagemErro}>{err}</div>}
                            {message && <div className={styles.mensagemSucesso}>{message}</div>}

                            <Button
                                type="submit"
                                label={loading ? "Validando..." : "Validar Código"}
                                className={styles.botaoEntrar}
                                disabled={loading || code.length !== 6}
                            />

                            <Button
                                type="button"
                                label="Solicitar Novo Código"
                                className={styles.botaoEntrar}
                                onClick={handleBackToEmail}
                                outlined
                                style={{ marginTop: '10px' }}
                            />

                            <p className={styles.linkCadastroWrapper}>
                                <Link to="/login" className={styles.linkCadastro}>
                                    Voltar ao Login
                                </Link>
                            </p>
                        </form>
                    )}

                    {/* PASSO 3: NOVA SENHA */}
                    {step === 'password' && (
                        <form onSubmit={handleResetPassword} className={styles.formulario}>
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
                                    autoFocus
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
                                <Link to="/login" className={styles.linkCadastro}>
                                    Voltar ao Login
                                </Link>
                            </p>
                        </form>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ResetPasswordWithCode;
