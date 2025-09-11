import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { registerUser } from "../../services/UserService";
import { Card } from "primereact/card";
import { Message } from "primereact/message";

const roleOptions = [
  { label: "USER", value: "USER" },
  { label: "ADMIN", value: "ADMIN" },
];

const UserRegister: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await registerUser({ username, email, password, roles });
      setSuccess("Usuário cadastrado com sucesso!");
      setUsername("");
      setEmail("");
      setPassword("");
      setRoles([]);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <Card title="Cadastrar Usuário">
        <form onSubmit={handleSubmit} className="p-fluid">
          <div className="field">
            <label htmlFor="username">Username</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Senha</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              feedback={false}
              toggleMask
              required
            />
          </div>

          <div className="field">
            <label htmlFor="roles">Perfis</label>
            <MultiSelect
              id="roles"
              value={roles}
              options={roleOptions}
              onChange={(e) => setRoles(e.value)}
              placeholder="Selecione os perfis"
              display="chip"
            />
          </div>

          {success && <Message severity="success" text={success} />}
          {error && <Message severity="error" text={error} />}

          <Button
            type="submit"
            label={loading ? "Salvando..." : "Cadastrar"}
            className="mt-3"
            disabled={loading}
          />
        </form>
      </Card>
    </div>
  );
};

export default UserRegister;
