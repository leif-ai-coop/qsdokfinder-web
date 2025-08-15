const apiBase = "/api";

async function fetchJson(path) {
  const res = await fetch(`${apiBase}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function getStand() {
  return fetchJson(`/stand`);
}

export async function getYears() {
  return fetchJson(`/filters/years`);
}

export async function getQsv() {
  return fetchJson(`/filters/qsv`);
}

export async function getInhaltstypen() {
  return fetchJson(`/filters/inhaltstypen`);
}

export async function getModules(qsv) {
  const q = qsv ? `?qsv=${encodeURIComponent(qsv)}` : "";
  return fetchJson(`/filters/modules${q}`);
}

export async function getDocuments(params) {
  const usp = new URLSearchParams();
  if (params.year) usp.set("year", params.year);
  if (params.qsv) usp.set("qsv", params.qsv);
  if (params.inhaltstyp) usp.set("inhaltstyp", params.inhaltstyp);
  if (params.modul) usp.set("modul", params.modul);
  if (params.recent) usp.set("recent", params.recent);
  if (params.jahr_typ) usp.set("jahr_typ", params.jahr_typ);
  const qs = usp.toString();
  const query = qs ? `?${qs}` : "";
  return fetchJson(`/documents${query}`);
}



