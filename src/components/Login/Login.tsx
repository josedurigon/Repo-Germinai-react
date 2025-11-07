import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from './Login.module.css';
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { login } from "../../services/AuthService";
import logo from '../../assets/logo-sem-textura.png';
import imagemFundo from '../../assets/imagem-fundo-login.jpg';

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [fieldErrors, setFieldErrors] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        let hasError = false;
        const newFieldErrors = { email: "", password: "" };
        

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            newFieldErrors.email = "O campo de e-mail é obrigatório.";
            hasError = true;
        } else if (!emailRegex.test(email)) {
            newFieldErrors.email = "E-mail inválido.";
            hasError = true;
        }

        if (!password.trim()) {
            newFieldErrors.password = "O campo de senha é obrigatório.";
            hasError = true;
        }

        setFieldErrors(newFieldErrors);
        if (hasError) return; 

        setLoading(true);
        try {
            const response = await login(email, password);
            await new Promise(r => setTimeout(r, 600));
            if (remember) localStorage.setItem("rememberEmail", email);
            navigate("/application/home", { replace: true });
        } catch (e: any) {
            setErr(e?.response?.data?.message ?? "Falha no login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.containerTela}>
            <div className={styles.colunaImagem} style={{ backgroundImage: `url(${imagemFundo})` }}>
                <div className={styles.efeitosGraficos}></div>
            </div>

            <div className={styles.colunaFormulario}>
                <Link to="/" className={styles.botaoSair}>
                    <i className="pi pi-sign-out"></i>
                    <span>Sair</span>
                </Link>

                <Card className={styles.cardLogin}>
                    <div className={styles.cabecalhoCard}>
                        <img src={logo} alt="Logo Germinai" className={styles.logoCard} />
                        <h1 className={styles.tituloCard}>Login</h1>
                        <p className={styles.subtituloCard}>Por favor, insira seus dados para fazer login.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.formulario}>
                        <div className={styles.campo}>
                            <label htmlFor="email" className={styles.labelCampo}>E-mail</label>
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`${styles.campoInput} ${fieldErrors.email ? "p-invalid" : ""}`}
                                placeholder="exemplo@email.com"
                                autoComplete="username"
                            />
                            {fieldErrors.email && (
                                <small className={styles.mensagemErro}>{fieldErrors.email}</small>
                            )}
                        </div>

                        <div className={styles.campo}>
                            <label htmlFor="password" className={styles.labelCampo}>Senha</label>
                            <Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.campoInput}
                                inputClassName={styles.inputInner}
                                feedback={false}
                                toggleMask
                                placeholder="Password@123"
                                autoComplete="current-password"
                            />
                            {fieldErrors.password && (
                                <small className={styles.mensagemErro}>{fieldErrors.password}</small>
                            )}
                        </div>

                        <div className={styles.opcoesAdicionais}>
                            <div className={styles.lembrarWrapper}>
                                <Checkbox
                                    inputId="remember"
                                    checked={remember}
                                    onChange={(e) => setRemember(!!e.checked)}
                                />
                                <label htmlFor="remember">Lembrar-me</label>
                            </div>
                            <Link to="/esqueci-senha" className={styles.linkEsqueciSenha}>
                                Esqueci a senha?
                            </Link>
                        </div>

                        {err && <div className={styles.mensagemErro}>{err}</div>}

                        <Button
                            type="submit"
                            label={loading ? "Entrando..." : "Entrar"}
                            className={styles.botaoEntrar}
                            disabled={loading}
                        />

                        <p className={styles.linkCadastroWrapper}>
                            Não possui conta?
                            <Link to="/cadastro" className={styles.linkCadastro}>
                                Realizar cadastro
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
