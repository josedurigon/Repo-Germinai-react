import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { listarUsuarios } from "../../services/UserService";
import type { UserResponse } from "../../services/UserService";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";

const UserList: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await listarUsuarios();
        setUsuarios(data);
      } catch (err: any) {
        setError("Erro ao carregar usuários");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return <Message severity="error" text={error} />;
  }

  return (
    <Card title="Usuários Cadastrados">
      <DataTable value={usuarios} paginator rows={10} responsiveLayout="scroll">
        <Column field="id" header="ID" style={{ width: "80px" }} />
        <Column field="username" header="Username" />
        <Column field="email" header="Email" />
        <Column
          field="roles"
          header="Perfis"
          body={(row: UserResponse) =>
            row.roles.map((r, i) => <Tag key={i} value={r} severity="info" className="mr-2" />)
          }
        />
        <Column
          field="enabled"
          header="Status"
          body={(row: UserResponse) =>
            row.enabled ? <Tag value="Ativo" severity="success" /> : <Tag value="Inativo" severity="danger" />
          }
        />
        <Column
          field="createdAt"
          header="Criado em"
          body={(row: UserResponse) =>
            new Date(row.createdAt).toLocaleString("pt-BR")
          }
        />
      </DataTable>
    </Card>
  );
};

export default UserList;
