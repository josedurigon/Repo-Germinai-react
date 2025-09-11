import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../../styles/pages/Login.module.css';
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { login } from "../../services/AuthService";

const Login: React.FC = () => {

  
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

 async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // TODO: chamar seu service (loginBasic/loginJwt)
      // const { token } = await loginJwt(email, password);
      // localStorage.setItem("token", token);

      const response = await login(email, password);
      
      navigate("/application", { replace: true });

      await new Promise(r => setTimeout(r, 600)); // simulação
      if (remember) localStorage.setItem("rememberEmail", email);
      navigate("/application/home", { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Opcional: logo */}

      <Card className={styles.card}>
        <h1 className={styles.title}>Acesse sua conta</h1>
        <p className={styles.subtitle}>Use suas credenciais para continuar.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="voce@empresa.com"
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Senha</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              inputClassName={styles.inputInner}
              feedback={false}
              toggleMask
              placeholder="Sua senha"
              autoComplete="current-password"
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.remember}>
              <Checkbox
                inputId="remember"
                checked={remember}
                onChange={(e) => setRemember(!!e.checked)}
              />
              <label htmlFor="remember">Lembrar e-mail</label>
            </div>
            <a className={styles.link} href="#">Esqueci a senha</a>
          </div>

          {err && <div className={styles.error}>{err}</div>}

          <Button
            type="submit"
            label={loading ? "Entrando..." : "Entrar"}
            className={styles.submit}
            disabled={loading}
          />
        </form>
      </Card>

      <p className={styles.footerText}>
        Ainda não tem conta? <a href="#" className={styles.link}>Fale com o administrador</a>
      </p>
    </div>
  );
};

export default Login;
