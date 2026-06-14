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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
 
  // Merge existing headers
  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }
 
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
 
  register: async (data: { 
    nombre: string; 
    apellido: string; 
    email: string; 
    password: string;
    direccionEnvio: string;
    telefono: string;
  }) => {
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
 
  logout: () => {
    // Logout is handled client-side by removing the token
    removeAuthToken();
    localStorage.removeItem('user_data');
  },
};
 
// ==================== PRODUCT ENDPOINTS ====================
export const productApi = {
  // Public endpoint - get all active products
  list: async () => {
    const response = await fetchWithAuth('/catalogo/productos');
    return response.json();
  },
 
  // Public endpoint - get product by id
  getById: async (id: string | number) => {
    const response = await fetchWithAuth(`/catalogo/productos/${id}`);
    return response.json();
  },
 
  // Public endpoint - search products by name
  search: async (nombre: string) => {
    const response = await fetchWithAuth(`/catalogo/productos/buscar?nombre=${encodeURIComponent(nombre)}`);
    return response.json();
  },
 
  // Public endpoint - get products by category
  getByCategory: async (categoriaId: number) => {
    const response = await fetchWithAuth(`/catalogo/productos/categoria/${categoriaId}`);
    return response.json();
  },
 
  // Admin endpoint - create product
  create: async (data: {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    unidad: string;
    imagenUrl: string;
    categoriaId: number;
  }) => {
    const response = await fetchWithAuth('/admin/productos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
 
  // Admin endpoint - update product
  update: async (id: string | number, data: {
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    unidad: string;
    imagenUrl: string;
    categoriaId: number;
  }) => {
    const response = await fetchWithAuth(`/admin/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
 
  // Admin endpoint - delete product (soft delete)
  delete: async (id: string | number) => {
    await fetchWithAuth(`/admin/productos/${id}`, {
      method: 'DELETE',
    });
  },
 
  // Admin endpoint - list all products (including inactive)
  listAll: async () => {
    const response = await fetchWithAuth('/admin/productos');
    return response.json();
  },
 
  // Admin endpoint - update stock
  updateStock: async (id: string | number, stock: number) => {
    const response = await fetchWithAuth(`/admin/productos/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stock }),
    });
    return response.json();
  },
};
 
// ==================== CATEGORY ENDPOINTS ====================
export const categoryApi = {
  // Public endpoint - list all categories
  list: async () => {
    const response = await fetchWithAuth('/catalogo/categorias');
    return response.json();
  },
 
  // Admin endpoint - list all categories (same as public for now)
  listAll: async () => {
    const response = await fetchWithAuth('/admin/categorias');
    return response.json();
  },
 
  // Admin endpoint - create category
  create: async (data: { nombre: string; descripcion?: string }) => {
    const response = await fetchWithAuth('/admin/categorias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
 
  // Admin endpoint - update category
  update: async (id: string | number, data: { nombre: string; descripcion?: string }) => {
    const response = await fetchWithAuth(`/admin/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
 
// ==================== CART ENDPOINTS ====================
export const cartApi = {
  // Get current user's cart
  get: async () => {
    const response = await fetchWithAuth('/carrito');
    return response.json();
  },
 
  // Add item to cart
  addItem: async (data: { productoId: number; cantidad: number }) => {
    const response = await fetchWithAuth('/carrito/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
 
  // Update item quantity in cart
  updateItem: async (productoId: number, cantidad: number) => {
    const response = await fetchWithAuth(`/carrito/items/${productoId}`, {
      method: 'PUT',
      body: JSON.stringify({ cantidad }),
    });
    return response.json();
  },
 
  // Remove item from cart
  removeItem: async (productoId: number) => {
    const response = await fetchWithAuth(`/carrito/items/${productoId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
 
  // Clear cart
  clear: async () => {
    await fetchWithAuth('/carrito', {
      method: 'DELETE',
    });
  },
 
  // Get cart total
  getTotal: async () => {
    const response = await fetchWithAuth('/carrito/total');
    return response.json();
  },
};
 
// ==================== CHECKOUT ENDPOINTS ====================
export const checkoutApi = {
  // Confirm purchase and create order
  confirm: async (data: {
    metodoPago: string;
    direccionEnvio: string;
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
  // Get current user's orders
  getByUser: async () => {
    const response = await fetchWithAuth('/pedidos/mis-pedidos');
    return response.json();
  },
 
  // Get order by id
  getById: async (id: string | number) => {
    const response = await fetchWithAuth(`/pedidos/${id}`);
    return response.json();
  },
 
  // Admin endpoint - list all orders
  listAll: async () => {
    const response = await fetchWithAuth('/admin/pedidos');
    return response.json();
  },
 
  // Admin endpoint - update order status
  updateStatus: async (id: string | number, nuevoEstado: string) => {
    const response = await fetchWithAuth(`/admin/pedidos/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ nuevoEstado }),
    });
    return response.json();
  },
};
 
// ==================== USER PROFILE ENDPOINTS ====================
export const userApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await fetchWithAuth('/usuarios/perfil');
    return response.json();
  },
 
  // Update current user profile
  updateProfile: async (data: {
    nombre?: string;
    apellido?: string;
    direccionEnvio?: string;
    telefono?: string;
  }) => {
    const response = await fetchWithAuth('/usuarios/perfil', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};