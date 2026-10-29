/** Client HTTP générique pour l'API générée (voir .env.example : VITE_API_URL). */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TOKEN_KEY = 'token';

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  logout: () => localStorage.removeItem(TOKEN_KEY),
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = auth.getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      // For a file (FormData) the browser sets the Content-Type itself
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) {
    // Token absent/expiré sur une route protégée : retour à la page de connexion
    if (res.status === 401 && !path.startsWith('/auth/')) {
      auth.logout();
      window.location.href = '/login';
    }
    const text = await res.text().catch(() => '');
    let message = text;
    try {
      const body = JSON.parse(text);
      message = Array.isArray(body.message) ? body.message.join(', ') : body.message ?? text;
    } catch {
      // le corps n'est pas du JSON : on garde le texte brut
    }
    throw new Error(message || `Erreur API (${res.status})`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const apiClient = {
  list: <T>(resource: string) => request<T[]>(`/${resource}`),
  get: <T>(resource: string, id: string | number) => request<T>(`/${resource}/${id}`),
  create: <T>(resource: string, body: unknown) =>
    request<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(body) }),
  update: <T>(resource: string, id: string | number, body: unknown) =>
    request<T>(`/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  upload: <T>(path: string, file: File) => {
    const form = new FormData();
    form.append('file', file); // 'file' = the name expected by FileInterceptor('file')
    return request<T>(`/${path}`, { method: 'POST', body: form });
  },
  remove: (resource: string, id: string | number) =>
    request<void>(`/${resource}/${id}`, { method: 'DELETE' }),
};
