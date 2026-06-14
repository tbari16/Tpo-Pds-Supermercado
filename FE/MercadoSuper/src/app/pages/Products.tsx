import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export default function Products() {
  const { products, categories, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);

  const activeProducts = products.filter((p) => p.active);

  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [activeProducts, searchQuery, selectedCategory, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = async (product: any) => {
    if (product.stock <= 0) {
      toast.error('Producto sin stock');
      return;
    }
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} agregado al carrito`);
    } catch (error) {
      toast.error('Error al agregar al carrito');
    }
  };

  const maxPrice = Math.max(...activeProducts.map((p) => p.price), 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-4">Nuestros Productos</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 border border-[#E2E8F0] rounded-xl hover:bg-[#F8FAFC] bg-white shadow-sm"
          >
            <SlidersHorizontal className="w-5 h-5 text-[#2563EB]" />
            <span className="font-medium text-[#1E293B]">Filtros</span>
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside
          className={`${
            showFilters ? 'block' : 'hidden'
          } lg:block w-64 flex-shrink-0 space-y-6`}
        >
          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
            <h3 className="font-semibold text-[#1E293B] mb-4">Categorías</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-sm text-gray-700">Todas</span>
              </label>
              {categories.filter((c) => c.active).map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category.id}
                    onChange={() => setSelectedCategory(category.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {category.name} ({category.productCount})
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm">
            <h3 className="font-semibold text-[#1E293B] mb-4">Rango de Precio</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${priceRange[0].toFixed(2)}</span>
                <span>${priceRange[1].toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
              setPriceRange([0, maxPrice]);
            }}
            className="w-full px-4 py-2 text-[#2563EB] border border-[#2563EB] rounded-xl hover:bg-[#EFF6FF] font-medium"
          >
            Limpiar Filtros
          </button>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Mostrando {paginatedProducts.length} de {filteredProducts.length} productos
            </p>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="12">12 por página</option>
              <option value="24">24 por página</option>
              <option value="48">48 por página</option>
            </select>
          </div>

          {paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-xl hover:border-[#2563EB] transition-all duration-300 group"
                  >
                    <Link to={`/products/${product.id}`} className="block relative">
                      <div className="aspect-square overflow-hidden bg-[#F8FAFC]">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute top-2 right-2 bg-[#FACC15] text-[#1E293B] text-xs font-bold px-2 py-1 rounded-lg">
                          ¡Últimos!
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <Link to={`/products/${product.id}`}>
                        <span className="text-xs text-[#2563EB] font-semibold bg-[#EFF6FF] px-2 py-1 rounded-lg">
                          {product.categoryName}
                        </span>
                        <h3 className="font-bold text-[#1E293B] mt-2 mb-2 line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-3">
                        <p className="text-2xl font-bold text-[#1E293B]">
                          ${product.price.toFixed(2)}
                        </p>
                        <span className="text-sm text-[#64748B]">/{product.unit}</span>
                      </div>
                      {product.stock > 0 ? (
                        <div className="space-y-2">
                          <p className="text-xs text-[#22C55E] font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-[#22C55E] rounded-full"></span>
                            {product.stock} disponibles
                          </p>
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white py-2.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all font-medium"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Agregar al carrito
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-2.5 text-red-600 text-sm font-medium bg-red-50 rounded-xl">
                          Sin stock
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .map((page, idx, arr) => (
                      <div key={page} className="flex items-center gap-2">
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
