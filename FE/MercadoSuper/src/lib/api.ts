// API Base Configuration — use VITE_API_BASE_URL if provided, otherwise use relative `/api`
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public data?: unknown,
    message: string = 'API Error'
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Get JWT token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Set JWT token to localStorage
export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

// Remove JWT token from localStorage
export function removeAuthToken(): void {
  localStorage.removeItem('auth_token');
}

// Generic fetch wrapper with JWT support
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(response.status, data, `HTTP ${response.status}`);
  }

  return response;
}

// ==================== AUTH ENDPOINTS ====================
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    return response.json();
  },

  logout: async () => {
    await fetchWithAuth('/auth/logout', {
      method: 'POST',
    });
  },
};

// ==================== PRODUCT ENDPOINTS ====================
export const productApi = {
  list: async (params?: { nombre?: string; categoriaId?: number; page?: number; size?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.nombre) searchParams.append('nombre', params.nombre);
    if (params?.categoriaId) searchParams.append('categoriaId', params.categoriaId.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());

    const query = searchParams.toString();
    const response = await fetchWithAuth(`/productos${query ? '?' + query : ''}`);
    return response.json();
  },

  getById: async (id: string | number) => {
    const response = await fetchWithAuth(`/productos/${id}`);
    return response.json();
  },

  create: async (data: FormData) => {
    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      headers,
      body: data,
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.json(), 'Failed to create product');
    }
    return response.json();
  },

  update: async (id: string | number, data: FormData) => {
    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers,
      body: data,
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.json(), 'Failed to update product');
    }
    return response.json();
  },

  delete: async (id: string | number) => {
    await fetchWithAuth(`/productos/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CATEGORY ENDPOINTS ====================
export const categoryApi = {
  list: async () => {
    const response = await fetchWithAuth('/categorias');
    return response.json();
  },

  getById: async (id: string | number) => {
    const response = await fetchWithAuth(`/categorias/${id}`);
    return response.json();
  },

  create: async (data: { nombre: string; descripcion?: string }) => {
    const response = await fetchWithAuth('/categorias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  update: async (id: string | number, data: Partial<{ nombre: string; descripcion?: string }>) => {
    const response = await fetchWithAuth(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id: string | number) => {
    await fetchWithAuth(`/categorias/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CART ENDPOINTS ====================
export const cartApi = {
  get: async () => {
    const response = await fetchWithAuth('/carrito');
    return response.json();
  },

  addItem: async (data: { productoId: number; cantidad: number }) => {
    const response = await fetchWithAuth('/carrito/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateItem: async (productoId: number, data: { cantidad: number }) => {
    const response = await fetchWithAuth(`/carrito/items/${productoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  removeItem: async (productoId: number) => {
    const response = await fetchWithAuth(`/carrito/items/${productoId}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  clear: async () => {
    await fetchWithAuth('/carrito', {
      method: 'DELETE',
    });
  },
};

// ==================== CHECKOUT ENDPOINTS ====================
export const checkoutApi = {
  confirm: async (data: {
    direccionEnvio: {
      calle: string;
      ciudad: string;
      estado: string;
      codigoPostal: string;
      pais: string;
      notas?: string;
    };
    metodoPago: string;
    referenciaPago?: string;
  }) => {
    const response = await fetchWithAuth('/checkout/confirmar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// ==================== ORDER ENDPOINTS ====================
export const orderApi = {
  list: async (params?: { estado?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.estado) searchParams.append('estado', params.estado);

    const query = searchParams.toString();
    const response = await fetchWithAuth(`/pedidos${query ? '?' + query : ''}`);
    return response.json();
  },

  getByUser: async () => {
    const response = await fetchWithAuth('/pedidos/mis-pedidos');
    return response.json();
  },

  getById: async (id: string | number) => {
    const response = await fetchWithAuth(`/pedidos/${id}`);
    return response.json();
  },

  updateStatus: async (id: string | number, data: { nuevoEstado: string }) => {
    const response = await fetchWithAuth(`/pedidos/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// ==================== NOTIFICATION ENDPOINTS ====================
export const notificationApi = {
  list: async () => {
    const response = await fetchWithAuth('/notificaciones');
    return response.json();
  },

  markAsRead: async (id: string | number) => {
    const response = await fetchWithAuth(`/notificaciones/${id}/leido`, {
      method: 'PUT',
    });
    return response.json();
  },
};
