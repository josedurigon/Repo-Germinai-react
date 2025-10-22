// src/services/SafraService.ts
import api from "../api/axios";

export interface TalhaoSafraRequest {
  talhaoId: number;
  areaUtilizadaHa: number;
}

export interface MetaSafraRequest {
  produtividadeAlvo: number;
  custoEstimadoTotal: number;
}

export interface SafraCreateRequest {
  nome: string;
  culturaId: number;
  responsavelId: number;
  dataInicio: string; // formato: YYYY-MM-DD
  dataFim?: string;
  areaTotalHa: number;
  talhoes?: TalhaoSafraRequest[];
  meta?: MetaSafraRequest;
  receitaEstimada?: number;
  lucroPrevisto?: number;
}

export interface SafraResponse {
  id: number;
  nome: string;
  cultura: {
    id: number;
    nome: string;
    cicloDias: number;
  };
  responsavel: {
    id: number;
    nome: string;
  };
  dataInicio: string;
  dataFim: string;
  status: string;
  areaTotalHa: number;
  progresso: number;
  diasAteColheita: number;
  talhoes: Array<{
    id: number;
    talhaoId: number;
    areaUtilizadaHa: number;
  }>;
  meta?: {
    id: number;
    produtividadeAlvo: number;
    custoEstimadoTotal: number;
  };
  receitaEstimada?: number;
  lucroPrevisto?: number;
}

export async function criarSafra(request: SafraCreateRequest): Promise<SafraResponse> {
  const { data } = await api.post<SafraResponse>("/safra", request);
  return data;
}

export async function listarSafras(): Promise<SafraResponse[]> {
  const { data } = await api.get<SafraResponse[]>("/safra");
  return data;
}

export async function listarSafrasAtivas(): Promise<SafraResponse[]> {
  const { data } = await api.get<SafraResponse[]>("/safra/ativas");
  return data;
}

export async function buscarSafraPorId(id: number): Promise<SafraResponse> {
  const { data } = await api.get<SafraResponse>(`/safra/${id}`);
  return data;
}

export async function atualizarSafra(id: number, request: SafraCreateRequest): Promise<SafraResponse> {
  const { data } = await api.put<SafraResponse>(`/safra/${id}`, request);
  return data;
}

export async function deletarSafra(id: number): Promise<void> {
  await api.delete(`/safra/${id}`);
}
