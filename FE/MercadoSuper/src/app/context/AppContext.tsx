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
  unit: 'UNIDAD' | 'KG' | 'LT' | 'GR';
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
 
export type OrderStatus = 'PENDIENTE' | 'PAGADO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';
export type PaymentMethod = 'TARJETA_CREDITO' | 'MERCADO_PAGO' | 'TRANSFERENCIA';
 
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
 
  useEffect(() => {
    initializeApp();
  }, []);
 
  const initializeApp = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
 
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        await Promise.all([loadProducts(), loadCategories(), loadCart(), loadOrders(parsedUser.role)]);
      } else {
        await Promise.all([loadProducts(), loadCategories()]);
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      initializeMockData();
    } finally {
      setLoading(false);
    }
  };
 
  const loadProducts = async () => {
    try {
      const response = await productApi.list();
      const mappedProducts: Product[] = response.map((p: any) => ({
        id: String(p.id),
        name: p.nombre,
        description: p.descripcion,
        price: p.precio,
        stock: p.stock,
        unit: p.unidad,
        weight: p.peso,
        imageUrl: p.imagenUrl || 'https://via.placeholder.com/400',
        categoryId: String(p.categoriaId || ''),
        categoryName: p.categoriaNombre || '',
        active: p.activo ?? true, 
        dateAdded: p.fechaCreacion || new Date().toISOString(),
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      initializeMockData();
    }
  };
 
  const loadCategories = async () => {
  try {
    const response = await categoryApi.list();
    console.log('📥 [loadCategories] raw response:', response);

    // Función para aplanar categorías anidadas
    const flattenCategories = (cats: any[]): Category[] => {
      const result: Category[] = [];
      for (const c of cats) {
        result.push({
          id: String(c.id),
          name: c.nombre,
          description: c.descripcion,
          parentId: c.categoriaPadreId ? String(c.categoriaPadreId) : undefined, // ← era c.padreId
          active: true,
          productCount: c.cantidadProductos || 0, // ← era c.productCount
        });
        if (c.subcategorias?.length > 0) {
          result.push(...flattenCategories(c.subcategorias)); // ← recursivo
        }
      }
      return result;
    };

    const mappedCategories = flattenCategories(response);
    console.log('✅ [loadCategories] mapeadas:', mappedCategories);
    setCategories(mappedCategories);
  } catch (error) {
    console.error('Failed to load categories:', error);
    initializeMockData();
  }
};
 
  const loadCart = async () => {
    try {
      const response = await cartApi.get();
      const mappedCart: CartItem[] = response.items.map((item: any) => ({
        product: {
          id: String(item.productoId),
          name: item.productoNombre,
          description: '',
          price: item.precioUnitario,
          stock: 0,
          unit: 'UNIDAD',
          imageUrl: item.imagenUrl || 'https://via.placeholder.com/400',
          categoryId: '',
          categoryName: '',
          active: true,
          dateAdded: new Date().toISOString(),
        },
        quantity: item.cantidad,
      }));
      setCart(mappedCart);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };
 
  const loadOrders = async (role?: string) => {
    try {
      const response = role === 'ADMIN'
        ? await orderApi.listAll()
        : await orderApi.getByUser();
      const mappedOrders: Order[] = response.map((o: any) => ({
        id: String(o.id),
        userId: String(o.clienteId || ''),
        userName: o.clienteNombre || '',
        items: o.items.map((item: any) => ({
          product: {
            id: String(item.productoId),
            name: item.productoNombre,
            description: '',
            price: item.precioUnitario,
            stock: 0,
            unit: 'UNIDAD',
            imageUrl: '',
            categoryId: '',
            categoryName: '',
            active: true,
            dateAdded: new Date().toISOString(),
          },
          quantity: item.cantidad,
        })),
        total: o.total,
        status: o.estado as OrderStatus,
        paymentMethod: o.metodoPago as PaymentMethod,
        paymentReference: o.referenciaPago,
        shippingAddress: {
          street: o.direccionEnvio || '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
        createdAt: o.fechaPedido,
        updatedAt: o.fechaPedido,
      }));
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };
 
  const initializeMockData = () => {
    setCategories([]);
    setProducts([]);
  };
 
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      setAuthToken(response.token);
      const userData: User = {
        id: String(response.usuario.id),
        email: response.usuario.email,
        firstName: response.usuario.nombre,
        lastName: response.usuario.apellido,
        role: response.usuario.rol === 'ADMINISTRADOR' ? 'ADMIN' : 'CLIENT',
      };
      setUser(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
 
      await Promise.all([loadCart(), loadOrders(userData.role)]);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
 
  const register = async (data: { email: string; password: string; firstName: string; lastName: string; direccionEnvio?: string; telefono?: string }) => {
    try {
      const response = await authApi.register({
        nombre: data.firstName,
        apellido: data.lastName,
        email: data.email,
        password: data.password,
        direccionEnvio: data.direccionEnvio || 'Sin dirección',
        telefono: data.telefono || '',
      });
      setAuthToken(response.token);
      const userData: User = {
        id: String(response.usuario.id),
        email: response.usuario.email,
        firstName: response.usuario.nombre,
        lastName: response.usuario.apellido,
        role: response.usuario.rol === 'ADMINISTRADOR' ? 'ADMIN' : 'CLIENT',
      };
      setUser(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
 
      await Promise.all([loadCart(), loadOrders()]);
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
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
 
      const mappedCart: CartItem[] = response.items.map((item: any) => ({
        product: {
          id: String(item.productoId),
          name: item.productoNombre,
          description: '',
          price: item.precioUnitario,
          stock: 0,
          unit: 'UNIDAD',
          imageUrl: item.imagenUrl || 'https://via.placeholder.com/400',
          categoryId: '',
          categoryName: '',
          active: true,
          dateAdded: new Date().toISOString(),
        },
        quantity: item.cantidad,
      }));
      setCart(mappedCart);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };
 
  const removeFromCart = async (productId: string) => {
    try {
      const response = await cartApi.removeItem(Number(productId));
 
      const mappedCart: CartItem[] = response.items.map((item: any) => ({
        product: {
          id: String(item.productoId),
          name: item.productoNombre,
          description: '',
          price: item.precioUnitario,
          stock: 0,
          unit: 'UNIDAD',
          imageUrl: item.imagenUrl || 'https://via.placeholder.com/400',
          categoryId: '',
          categoryName: '',
          active: true,
          dateAdded: new Date().toISOString(),
        },
        quantity: item.cantidad,
      }));
      setCart(mappedCart);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };
 
  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
 
    try {
      const response = await cartApi.updateItem(Number(productId), quantity);
 
      const mappedCart: CartItem[] = response.items.map((item: any) => ({
        product: {
          id: String(item.productoId),
          name: item.productoNombre,
          description: '',
          price: item.precioUnitario,
          stock: 0,
          unit: 'UNIDAD',
          imageUrl: item.imagenUrl || 'https://via.placeholder.com/400',
          categoryId: '',
          categoryName: '',
          active: true,
          dateAdded: new Date().toISOString(),
        },
        quantity: item.cantidad,
      }));
      setCart(mappedCart);
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
    }
  };
 
  const clearCart = async () => {
    try {
      await cartApi.clear();
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };
 
  const createOrder = async (
    shippingAddress: Address,
    paymentMethod: PaymentMethod,
    paymentReference?: string
  ): Promise<Order> => {
    try {
      const direccionCompleta = `${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;
      const response = await checkoutApi.confirm({
        metodoPago: paymentMethod,
        direccionEnvio: direccionCompleta,
      });
 
      const newOrder: Order = {
        id: String(response.id),
        userId: String(response.clienteId || ''),
        userName: response.clienteNombre || '',
        items: response.items.map((item: any) => ({
          product: {
            id: String(item.productoId),
            name: item.productoNombre,
            description: '',
            price: item.precioUnitario,
            stock: 0,
            unit: 'UNIDAD',
            imageUrl: '',
            categoryId: '',
            categoryName: '',
            active: true,
            dateAdded: new Date().toISOString(),
          },
          quantity: item.cantidad,
        })),
        total: response.total,
        status: response.estado as OrderStatus,
        paymentMethod: response.metodoPago as PaymentMethod,
        paymentReference: response.referenciaPago,
        shippingAddress: shippingAddress,
        createdAt: response.fechaPedido,
        updatedAt: response.fechaPedido,
      };
 
      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
 
      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };
 
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await orderApi.updateStatus(orderId, status);
 
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
            active: item.producto.activo ?? true,
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
      const requestData = {
        nombre: product.name,
        descripcion: product.description,
        precio: product.price,
        stock: product.stock,
        unidad: product.unit,
        imagenUrl: product.imageUrl || 'https://via.placeholder.com/400',
        categoriaId: Number(product.categoryId),
      };
 
      const response = await productApi.create(requestData);
      const newProduct: Product = {
        id: String(response.id),
        name: response.nombre,
        description: response.descripcion,
        price: response.precio,
        stock: response.stock,
        unit: response.unidad,
        imageUrl: response.imagenUrl || 'https://via.placeholder.com/400',
        categoryId: String(response.categoriaId || ''),
        categoryName: response.categoriaNombre || '',
        active: response.activo ?? true, 
        dateAdded: new Date().toISOString(),
      };
 
      setProducts((prev) => [newProduct, ...prev]);
 
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === String(response.categoriaId)
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
      const updateData: any = {};
      if (product.name) updateData.nombre = product.name;
      if (product.description) updateData.descripcion = product.description;
      if (product.price) updateData.precio = product.price;
      if (product.stock !== undefined) updateData.stock = product.stock;
      if (product.unit) updateData.unidad = product.unit;
      if (product.categoryId) updateData.categoriaId = Number(product.categoryId);
      if (product.imageUrl) updateData.imagenUrl = product.imageUrl;
 
      const response = await productApi.update(id, updateData);
      const updatedProduct: Product = {
        id: String(response.id),
        name: response.nombre,
        description: response.descripcion,
        price: response.precio,
        stock: response.stock,
        unit: response.unidad,
        imageUrl: response.imagenUrl || 'https://via.placeholder.com/400',
        categoryId: String(response.categoriaId || ''),
        categoryName: response.categoriaNombre || '',
        active: response.activo ?? true,
        dateAdded: new Date().toISOString(),
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
    console.log('📤 [addCategory] enviando:', { nombre: category.name, descripcion: category.description, padreId: category.parentId });
    
    await categoryApi.create({
      nombre: category.name,
      descripcion: category.description,
      padreId: category.parentId ? Number(category.parentId) : null,
      hoja: true,
    } as any);

    // En vez de usar response.id (que viene null), recargamos todo
    await loadCategories();
    
  } catch (error) {
    console.error('Failed to add category:', error);
    throw error;
  }
};
 
  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const updateData: any = {};
      console.log('📤 [updateCategory] id:', id, 'enviando:', updateData);
      if (category.name) updateData.nombre = category.name;
      if (category.description) updateData.descripcion = category.description;
      
      // Inyectamos el padreId si se modifica y forzamos hoja a true
      if (category.parentId !== undefined) {
        updateData.padreId = category.parentId ? Number(category.parentId) : null;
      }
      updateData.hoja = true; 
 
      const response = await categoryApi.update(id, updateData);
      await loadCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };
 
  const deleteCategory = async (id: string) => {
    throw new Error('Delete category is not supported by the backend');
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
