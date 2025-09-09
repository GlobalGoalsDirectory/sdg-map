const stripAccents = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const normalizeStringForSearch = (s: string) =>
  stripAccents(s).toLowerCase().trim();
