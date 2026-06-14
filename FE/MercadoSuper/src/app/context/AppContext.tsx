import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  authApi,
  productApi,
  categoryApi,
  cartApi,
  checkoutApi,
  orderApi,
  setAuthToken,
  removeAuthToken,
} from '../../lib/api';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CLIENT' | 'ADMIN';
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  unit: 'KG' | 'LITRO' | 'UNIDAD';
  weight?: number;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  active: boolean;
  dateAdded: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderStatus = 'PENDIENTE' | 'CONFIRMADO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
export type PaymentMethod = 'TRANSFERENCIA' | 'TARJETA' | 'EFECTIVO';

export type Order = {
  id: string;
  userId: string;
  userName: string;
  items: { product: Product; quantity: number }[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
};

export type Notification = {
  id: string;
  message: string;
  type: 'order' | 'status' | 'stock' | 'promo';
  read: boolean;
  timestamp: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  active: boolean;
  productCount: number;
};

type AppContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  orders: Order[];
  createOrder: (shippingAddress: Address, paymentMethod: PaymentMethod, paymentReference?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'dateAdded'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize: load user from localStorage and fetch data
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user is already logged in
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }

      // Fetch products and categories
      await Promise.all([loadProducts(), loadCategories()]);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      // Use mock data as fallback
      initializeMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productApi.list({ page: 0, size: 100 });
      const mappedProducts: Product[] = response.content.map((p: any) => ({
        id: String(p.id),
        name: p.nombre,
        description: p.descripcion,
        price: p.precio,
        stock: p.stock,
        unit: p.unidad,
        weight: p.peso,
        imageUrl: p.imagenUrl || 'https://via.placeholder.com/400',
        categoryId: String(p.categoria?.id || ''),
        categoryName: p.categoria?.nombre || '',
        active: p.activo,
        dateAdded: p.fechaCreacion,
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      // Use mock data as fallback
      initializeMockData();
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryApi.list();
      const mappedCategories: Category[] = response.map((c: any) => ({
        id: String(c.id),
        name: c.nombre,
        description: c.descripcion,
        active: c.activo,
        productCount: c.productCount || 0,
      }));
      setCategories(mappedCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Use mock data as fallback
      initializeMockData();
    }
  };

  const loadCart = async () => {
    try {
      const response = await cartApi.get();
      const mappedCart: CartItem[] = response.items.map((item: any) => ({
        product: {
          id: String(item.producto.id),
          name: item.producto.nombre,
          description: item.producto.descripcion,
          price: item.producto.precio,
          stock: item.producto.stock,
          unit: item.producto.unidad,
          weight: item.producto.peso,
          imageUrl: item.producto.imagenUrl || 'https://via.placeholder.com/400',
          categoryId: String(item.producto.categoria?.id || ''),
          categoryName: item.producto.categoria?.nombre || '',
          active: item.producto.activo,
          dateAdded: item.producto.fechaCreacion,
        },
        quantity: item.cantidad,
      }));
      setCart(mappedCart);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await orderApi.getByUser();
      const mappedOrders: Order[] = response.map((o: any) => ({
        id: String(o.id),
        userId: String(o.usuario?.id || ''),
        userName: `${o.usuario?.nombre} ${o.usuario?.apellido}` || '',
        items: o.items.map((item: any) => ({
          product: {
            id: String(item.producto.id),
            name: item.producto.nombre,
            description: item.producto.descripcion,
            price: item.producto.precio,
            stock: item.producto.stock,
            unit: item.producto.unidad,
            weight: item.producto.peso,
            imageUrl: item.producto.imagenUrl || 'https://via.placeholder.com/400',
            categoryId: String(item.producto.categoria?.id || ''),
            categoryName: item.producto.categoria?.nombre || '',
            active: item.producto.activo,
            dateAdded: item.producto.fechaCreacion,
          },
          quantity: item.cantidad,
        })),
        total: o.total,
        status: o.estado as OrderStatus,
        paymentMethod: o.metodoPago as PaymentMethod,
        paymentReference: o.referenciaPago,
        shippingAddress: {
          street: o.direccion?.calle || '',
          city: o.direccion?.ciudad || '',
          state: o.direccion?.estado || '',
          postalCode: o.direccion?.codigoPostal || '',
          country: o.direccion?.pais || '',
          notes: o.direccion?.notas,
        },
        createdAt: o.fechaCreacion,
        updatedAt: o.fechaActualizacion,
      }));
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const initializeMockData = () => {
    // Mock categories
    const mockCategories: Category[] = [
      { id: '1', name: 'Frutas', active: true, productCount: 5 },
      { id: '2', name: 'Verduras', active: true, productCount: 4 },
      { id: '3', name: 'Lácteos', active: true, productCount: 3 },
      { id: '4', name: 'Carnes', active: true, productCount: 3 },
      { id: '5', name: 'Bebidas', active: true, productCount: 2 },
    ];
    setCategories(mockCategories);

    // Mock products
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Manzanas Rojas',
        description: 'Manzanas rojas frescas y jugosas, perfectas para comer o cocinar.',
        price: 3.99,
        stock: 100,
        unit: 'KG',
        weight: 1,
        imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
        categoryId: '1',
        categoryName: 'Frutas',
        active: true,
        dateAdded: '2026-05-01',
      },
      {
        id: '2',
        name: 'Plátanos',
        description: 'Plátanos maduros, dulces y cremosos.',
        price: 2.49,
        stock: 150,
        unit: 'KG',
        weight: 1,
        imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop',
        categoryId: '1',
        categoryName: 'Frutas',
        active: true,
        dateAdded: '2026-05-02',
      },
      {
        id: '3',
        name: 'Naranjas',
        description: 'Naranjas frescas y jugosas, ricas en vitamina C.',
        price: 4.99,
        stock: 80,
        unit: 'KG',
        weight: 1,
        imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=400&fit=crop',
        categoryId: '1',
        categoryName: 'Frutas',
        active: true,
        dateAdded: '2026-05-03',
      },
      {
        id: '4',
        name: 'Fresas',
        description: 'Fresas frescas y dulces, perfectas para postres.',
        price: 5.99,
        stock: 50,
        unit: 'KG',
        weight: 0.5,
        imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop',
        categoryId: '1',
        categoryName: 'Frutas',
        active: true,
        dateAdded: '2026-05-04',
      },
      {
        id: '5',
        name: 'Uvas',
        description: 'Uvas verdes sin semillas, dulces y refrescantes.',
        price: 6.99,
        stock: 60,
        unit: 'KG',
        weight: 1,
        imageUrl: 'https://images.unsplash.com/photo-1599819177406-6859e1d03cae?w=400&h=400&fit=crop',
        categoryId: '1',
        categoryName: 'Frutas',
        active: true,
        dateAdded: '2026-05-05',
      },
      {
        id: '6',
        name: 'Tomates',
        description: 'Tomates maduros y jugosos, perfectos para ensaladas y salsas.',
        price: 3.49,
        stock: 120,
        unit: 'KG',
        weight: 1,
        imageUrl: 'https://images.unsplash.com/photo-1546470427-227a993b51ba?w=400&h=400&fit=crop',
        categoryId: '2',
        categoryName: 'Verduras',
        active: true,
        dateAdded: '2026-05-06',
      },
      {
        id: '7',
        name: 'Lechugas',
        description: 'Lechugas frescas y crujientes, ideales para ensaladas.',
        price: 2.99,
        stock: 90,
        unit: 'UNIDAD',
        imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=400&fit=crop',
        categoryId: '2',
        categoryName: 'Verduras',
        active: true,
        dateAdded: '2026-05-07',
      },
      {
        id: '8',
        name: 'Zanahorias',
        description: 'Zanahorias frescas, dulces y crujientes.',
        price: 2.49,
        stock: 110,
        unit: 'KG',
        weight: 1,
        imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop',
        categoryId: '2',
        categoryName: 'Verduras',
        active: true,
        dateAdded: '2026-05-08',
      },
      {
        id: '9',
        name: 'Brócoli',
        description: 'Brócoli fresco, rico en nutrientes y fibra.',
        price: 3.99,
        stock: 70,
        unit: 'KG',
        weight: 0.5,
        imageUrl: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=400&fit=crop',
        categoryId: '2',
        categoryName: 'Verduras',
        active: true,
        dateAdded: '2026-05-09',
      },
      {
        id: '10',
        name: 'Leche Entera',
        description: 'Leche fresca y entera, rica en calcio.',
        price: 4.49,
        stock: 200,
        unit: 'LITRO',
        imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
        categoryId: '3',
        categoryName: 'Lácteos',
        active: true,
        dateAdded: '2026-05-10',
      },
      {
        id: '11',
        name: 'Yogurt Natural',
        description: 'Yogurt natural sin azúcar, cremoso y saludable.',
        price: 3.99,
        stock: 150,
        unit: 'LITRO',
        imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
        categoryId: '3',
        categoryName: 'Lácteos',
        active: true,
        dateAdded: '2026-05-11',
      },
      {
        id: '12',
        name: 'Queso Fresco',
        description: 'Queso fresco artesanal, suave y delicioso.',
        price: 7.99,
        stock: 80,
        unit: 'KG',
        weight: 0.5,
        imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&h=400&fit=crop',
        categoryId: '3',
        categoryName: 'Lácteos',
        active: true,
        dateAdded: '2026-05-12',
      },
      {
        id: '13',
        name: 'Pollo Entero',
        description: 'Pollo fresco y tierno, ideal para asar o guisar.',
        price: 12.99,
        stock: 50,
        unit: 'KG',
        weight: 2,
        imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop',
        categoryId: '4',
        categoryName: 'Carnes',
        active: true,
        dateAdded: '2026-05-13',
      },
      {
        id: '14',
        name: 'Carne de Res',
        description: 'Carne de res de primera calidad, perfecta para bistecs.',
        price: 18.99,
        stock: 40,
        unit: 'KG',
        weight: 1,
        imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop',
        categoryId: '4',
        categoryName: 'Carnes',
        active: true,
        dateAdded: '2026-05-14',
      },
      {
        id: '15',
        name: 'Carne de Cerdo',
        description: 'Carne de cerdo fresca, jugosa y sabrosa.',
        price: 14.99,
        stock: 45,
        unit: 'KG',
        weight: 1,
        imageUrl: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400&h=400&fit=crop',
        categoryId: '4',
        categoryName: 'Carnes',
        active: true,
        dateAdded: '2026-05-15',
      },
      {
        id: '16',
        name: 'Agua Mineral',
        description: 'Agua mineral natural, pura y refrescante.',
        price: 1.99,
        stock: 300,
        unit: 'LITRO',
        imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop',
        categoryId: '5',
        categoryName: 'Bebidas',
        active: true,
        dateAdded: '2026-05-16',
      },
      {
        id: '17',
        name: 'Jugo de Naranja',
        description: 'Jugo de naranja natural, recién exprimido.',
        price: 5.99,
        stock: 100,
        unit: 'LITRO',
        imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
        categoryId: '5',
        categoryName: 'Bebidas',
        active: true,
        dateAdded: '2026-05-17',
      },
    ];
    setProducts(mockProducts);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      // Save token
      setAuthToken(response.token);
      
      // Map user data
      const userData: User = {
        id: String(response.usuario.id),
        email: response.usuario.email,
        firstName: response.usuario.nombre,
        lastName: response.usuario.apellido,
        role: response.usuario.rol === 'ADMIN' ? 'ADMIN' : 'CLIENT',
      };
      
      setUser(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));

      // Load user's cart and orders
      await Promise.all([loadCart(), loadOrders()]);
    } catch (error) {
      console.error('Login failed:', error);
      // Mock login for demo purposes
      const isAdmin = email.includes('admin');
      const mockUser: User = {
        id: isAdmin ? 'admin-1' : 'user-' + Date.now(),
        email,
        firstName: isAdmin ? 'Admin' : 'Juan',
        lastName: isAdmin ? 'Test' : 'Pérez',
        role: isAdmin ? 'ADMIN' : 'CLIENT',
      };
      setUser(mockUser);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    }
  };

  const register = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      const response = await authApi.register(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );
      
      // Save token
      setAuthToken(response.token);
      
      // Map user data
      const userData: User = {
        id: String(response.usuario.id),
        email: response.usuario.email,
        firstName: response.usuario.nombre,
        lastName: response.usuario.apellido,
        role: response.usuario.rol === 'ADMIN' ? 'ADMIN' : 'CLIENT',
      };
      
      setUser(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));

      // Load user's cart and orders
      await Promise.all([loadCart(), loadOrders()]);
    } catch (error) {
      console.error('Register failed:', error);
      // Mock register for demo purposes
      const mockUser: User = {
        id: 'user-' + Date.now(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'CLIENT',
      };
      setUser(mockUser);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setCart([]);
      removeAuthToken();
      localStorage.removeItem('user_data');
    }
  };

  const addToCart = async (product: Product, quantity: number) => {
    try {
      const response = await cartApi.addItem({
        productoId: Number(product.id),
        cantidad: quantity,
      });

      // Update local cart state
      const mappedCart: CartItem[] = response.items.map((item: any) => ({
        product: {
          id: String(item.producto.id),
          name: item.producto.nombre,
          description: item.producto.descripcion,
          price: item.producto.precio,
          stock: item.producto.stock,
          unit: item.producto.unidad,
          weight: item.producto.peso,
          imageUrl: item.producto.imagenUrl || 'https://via.placeholder.com/400',
          categoryId: String(item.producto.categoria?.id || ''),
          categoryName: item.producto.categoria?.nombre || '',
          active: item.producto.activo,
          dateAdded: item.producto.fechaCreacion,
        },
        quantity: item.cantidad,
      }));
      setCart(mappedCart);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      // Mock add to cart
      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await cartApi.removeItem(Number(productId));

      const mappedCart: CartItem[] = response.items.map((item: any) => ({
        product: {
          id: String(item.producto.id),
          name: item.producto.nombre,
          description: item.producto.descripcion,
          price: item.producto.precio,
          stock: item.producto.stock,
          unit: item.producto.unidad,
          weight: item.producto.peso,
          imageUrl: item.producto.imagenUrl || 'https://via.placeholder.com/400',
          categoryId: String(item.producto.categoria?.id || ''),
          categoryName: item.producto.categoria?.nombre || '',
          active: item.producto.activo,
          dateAdded: item.producto.fechaCreacion,
        },
        quantity: item.cantidad,
      }));
      setCart(mappedCart);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      // Mock remove from cart
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const response = await cartApi.updateItem(Number(productId), { cantidad: quantity });

      const mappedCart: CartItem[] = response.items.map((item: any) => ({
        product: {
          id: String(item.producto.id),
          name: item.producto.nombre,
          description: item.producto.descripcion,
          price: item.producto.precio,
          stock: item.producto.stock,
          unit: item.producto.unidad,
          weight: item.producto.peso,
          imageUrl: item.producto.imagenUrl || 'https://via.placeholder.com/400',
          categoryId: String(item.producto.categoria?.id || ''),
          categoryName: item.producto.categoria?.nombre || '',
          active: item.producto.activo,
          dateAdded: item.producto.fechaCreacion,
        },
        quantity: item.cantidad,
      }));
      setCart(mappedCart);
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      // Mock update quantity
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Mock clear cart
      setCart([]);
    }
  };

  const createOrder = async (
    shippingAddress: Address,
    paymentMethod: PaymentMethod,
    paymentReference?: string
  ): Promise<Order> => {
    try {
      const response = await checkoutApi.confirm({
        direccionEnvio: {
          calle: shippingAddress.street,
          ciudad: shippingAddress.city,
          estado: shippingAddress.state,
          codigoPostal: shippingAddress.postalCode,
          pais: shippingAddress.country,
          notas: shippingAddress.notes,
        },
        metodoPago: paymentMethod,
        referenciaPago: paymentReference,
      });

      const newOrder: Order = {
        id: String(response.id),
        userId: String(response.usuario?.id || ''),
        userName: `${response.usuario?.nombre} ${response.usuario?.apellido}` || '',
        items: response.items.map((item: any) => ({
          product: {
            id: String(item.producto.id),
            name: item.producto.nombre,
            description: item.producto.descripcion,
            price: item.producto.precio,
            stock: item.producto.stock,
            unit: item.producto.unidad,
            weight: item.producto.peso,
            imageUrl: item.producto.imagenUrl || 'https://via.placeholder.com/400',
            categoryId: String(item.producto.categoria?.id || ''),
            categoryName: item.producto.categoria?.nombre || '',
            active: item.producto.activo,
            dateAdded: item.producto.fechaCreacion,
          },
          quantity: item.cantidad,
        })),
        total: response.total,
        status: response.estado as OrderStatus,
        paymentMethod: response.metodoPago as PaymentMethod,
        paymentReference: response.referenciaPago,
        shippingAddress: {
          street: response.direccion?.calle || '',
          city: response.direccion?.ciudad || '',
          state: response.direccion?.estado || '',
          postalCode: response.direccion?.codigoPostal || '',
          country: response.direccion?.pais || '',
          notes: response.direccion?.notas,
        },
        createdAt: response.fechaCreacion,
        updatedAt: response.fechaActualizacion,
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);

      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      // Mock create order
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const mockOrder: Order = {
        id: 'ORD-' + Date.now(),
        userId: user?.id || '',
        userName: user ? `${user.firstName} ${user.lastName}` : '',
        items: cart.map((item) => ({ product: item.product, quantity: item.quantity })),
        total,
        status: 'PENDIENTE',
        paymentMethod,
        paymentReference,
        shippingAddress,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setOrders((prev) => [mockOrder, ...prev]);
      setCart([]);

      return mockOrder;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await orderApi.updateStatus(orderId, { nuevoEstado: status });

      const updatedOrder: Order = {
        id: String(response.id),
        userId: String(response.usuario?.id || ''),
        userName: `${response.usuario?.nombre} ${response.usuario?.apellido}` || '',
        items: response.items.map((item: any) => ({
          product: {
            id: String(item.producto.id),
            name: item.producto.nombre,
            description: item.producto.descripcion,
            price: item.producto.precio,
            stock: item.producto.stock,
            unit: item.producto.unidad,
            weight: item.producto.peso,
            imageUrl: item.producto.imagenUrl || 'https://via.placeholder.com/400',
            categoryId: String(item.producto.categoria?.id || ''),
            categoryName: item.producto.categoria?.nombre || '',
            active: item.producto.activo,
            dateAdded: item.producto.fechaCreacion,
          },
          quantity: item.cantidad,
        })),
        total: response.total,
        status: response.estado as OrderStatus,
        paymentMethod: response.metodoPago as PaymentMethod,
        paymentReference: response.referenciaPago,
        shippingAddress: {
          street: response.direccion?.calle || '',
          city: response.direccion?.ciudad || '',
          state: response.direccion?.estado || '',
          postalCode: response.direccion?.codigoPostal || '',
          country: response.direccion?.pais || '',
          notes: response.direccion?.notas,
        },
        createdAt: response.fechaCreacion,
        updatedAt: response.fechaActualizacion,
      };

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updatedOrder : o))
      );
    } catch (error) {
      console.error('Failed to update order status:', error);
      // Mock update status
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status, updatedAt: new Date().toISOString() }
            : order
        )
      );
    }
  };

  const addNotification = (data: { message: string; type: Notification['type'] }) => {
    const notification: Notification = {
      id: Date.now().toString(),
      message: data.message,
      type: data.type,
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const addProduct = async (product: Omit<Product, 'id' | 'dateAdded'>) => {
    try {
      const formData = new FormData();
      formData.append('producto', JSON.stringify({
        nombre: product.name,
        descripcion: product.description,
        precio: product.price,
        stock: product.stock,
        unidad: product.unit,
        peso: product.weight,
        categoriaId: Number(product.categoryId),
        activo: product.active,
      }));

      const response = await productApi.create(formData);
      const newProduct: Product = {
        id: String(response.id),
        name: response.nombre,
        description: response.descripcion,
        price: response.precio,
        stock: response.stock,
        unit: response.unidad,
        weight: response.peso,
        imageUrl: response.imagenUrl || 'https://via.placeholder.com/400',
        categoryId: String(response.categoria?.id || ''),
        categoryName: response.categoria?.nombre || '',
        active: response.activo,
        dateAdded: response.fechaCreacion,
      };

      setProducts((prev) => [newProduct, ...prev]);

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === String(response.categoria?.id)
            ? { ...cat, productCount: cat.productCount + 1 }
            : cat
        )
      );
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      const formData = new FormData();
      const updateData: any = {};
      if (product.name) updateData.nombre = product.name;
      if (product.description) updateData.descripcion = product.description;
      if (product.price) updateData.precio = product.price;
      if (product.stock !== undefined) updateData.stock = product.stock;
      if (product.unit) updateData.unidad = product.unit;
      if (product.weight !== undefined) updateData.peso = product.weight;
      if (product.categoryId) updateData.categoriaId = Number(product.categoryId);
      if (product.active !== undefined) updateData.activo = product.active;

      formData.append('producto', JSON.stringify(updateData));

      const response = await productApi.update(id, formData);
      const updatedProduct: Product = {
        id: String(response.id),
        name: response.nombre,
        description: response.descripcion,
        price: response.precio,
        stock: response.stock,
        unit: response.unidad,
        weight: response.peso,
        imageUrl: response.imagenUrl || 'https://via.placeholder.com/400',
        categoryId: String(response.categoria?.id || ''),
        categoryName: response.categoria?.nombre || '',
        active: response.activo,
        dateAdded: response.fechaCreacion,
      };

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? updatedProduct : p))
      );
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productApi.delete(id);
      const product = products.find((p) => p.id === id);
      setProducts((prev) => prev.filter((p) => p.id !== id));

      if (product) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === product.categoryId
              ? { ...cat, productCount: Math.max(0, cat.productCount - 1) }
              : cat
          )
        );
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'productCount'>) => {
    try {
      const response = await categoryApi.create({
        nombre: category.name,
        descripcion: category.description,
      });

      const newCategory: Category = {
        id: String(response.id),
        name: response.nombre,
        description: response.descripcion,
        active: response.activo,
        productCount: 0,
      };

      setCategories((prev) => [newCategory, ...prev]);
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const updateData: any = {};
      if (category.name) updateData.nombre = category.name;
      if (category.description) updateData.descripcion = category.description;
      if (category.active !== undefined) updateData.activo = category.active;

      const response = await categoryApi.update(id, updateData);
      const updatedCategory: Category = {
        id: String(response.id),
        name: response.nombre,
        description: response.descripcion,
        active: response.activo,
        productCount: response.productCount || 0,
      };

      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? updatedCategory : cat))
      );

      if (category.name) {
        setProducts((prev) =>
          prev.map((product) =>
            product.categoryId === id
              ? { ...product, categoryName: category.name! }
              : product
          )
        );
      }
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryApi.delete(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));

      setProducts((prev) =>
        prev.map((product) =>
          product.categoryId === id ? { ...product, active: false } : product
        )
      );
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        createOrder,
        updateOrderStatus,
        notifications,
        markNotificationAsRead,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
