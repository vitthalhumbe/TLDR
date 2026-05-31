import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({ baseURL: BASE_URL });

export async function ingestPDF(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post("/ingest/pdf", form);
  return res.data;
}

export async function ingestYouTube(url) {
  const res = await api.post("/ingest/youtube", { url });
  return res.data;
}

export async function ingestURL(url) {
  const res = await api.post("/ingest/url", { url });
  return res.data;
}

export async function getMaterial(id) {
  const res = await api.get(`/material/${id}`);
  return res.data;
}

export async function saveQuizResult(payload) {
  const res = await api.post("/quiz/result", payload);
  return res.data;
}

export async function startMockSession(material_id) {
  const res = await api.post("/mock/start", { material_id });
  return res.data;
}

export async function submitMockAnswer(payload) {
  const res = await api.post("/mock/answer", payload);
  return res.data;
}

export const TUTOR_STREAM_URL = (material_id) =>
  `${BASE_URL}/tutor/chat`;