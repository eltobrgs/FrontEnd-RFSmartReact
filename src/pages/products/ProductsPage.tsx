// React core
import { useState, useEffect } from 'react';

// Components
import { Sidebar } from '../../components/Sidebar';
import { ProductAccessModal } from '../../components/ProductAccessModal';

// Animations
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { FiSearch, FiX, FiUsers, FiEdit } from 'react-icons/fi';

// Navigation
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  accessType: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
  };
  isCreator: boolean;
}

export function ProductsPage() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  // Buscar produtos do produtor
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:3000/api/products/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Falha ao carregar produtos');
        }
        
        const data = await response.json();
        setProducts(data);
        
        // Extrair categorias únicas
        const uniqueCategories = ['Todas', ...new Set(data.map((product: Product) => product.category))];
        setCategories(uniqueCategories as string[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    // Filtrar apenas produtos criados pelo usuário
    const isCreatedByUser = product.isCreator === true;
    
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    
    return isCreatedByUser && matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir produto');
      }
      
      // Remover produto da lista
      setProducts(products.filter(p => p.id !== productId));
      setSelectedProduct(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir produto');
      console.error('Erro ao excluir produto:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-medium text-gray-800">Meus Produtos</h1>
          
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            {/* Search bar */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Add product button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/products/create')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Adicionar produto
            </motion.button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Você ainda não criou nenhum produto ou nenhum produto corresponde aos filtros aplicados.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/products/create')}
              className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Criar meu primeiro produto
            </motion.button>
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="aspect-w-16 aspect-h-9 relative">
                <img
                  src={product.image || `https://source.unsplash.com/random/800x600/?${product.category.toLowerCase()}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {product.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-gray-500">R$</span>
                  <span className="text-lg font-medium text-gray-900">{product.price.toFixed(2)}</span>
                </div>
                {product._count && (
                  <div className="mt-2 text-xs text-gray-500">
                    {product._count.users} {product._count.users === 1 ? 'usuário' : 'usuários'} com acesso
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Product detail modal */}
        <AnimatePresence>
          {selectedProduct && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black cursor-pointer z-40"
                onClick={() => setSelectedProduct(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-8 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row z-50"
              >
                <div className="md:w-1/2 relative">
                  <img
                    src={selectedProduct.image || `https://source.unsplash.com/random/800x600/?${selectedProduct.category.toLowerCase()}`}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 md:w-1/2 overflow-y-auto">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-2xl font-medium text-gray-900">{selectedProduct.name}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedProduct.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {selectedProduct.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-gray-500">{selectedProduct.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Detalhes</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Categoria</span>
                        <span className="font-medium">{selectedProduct.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Preço</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm">R$</span>
                          <span className="font-medium">{selectedProduct.price.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tipo de acesso</span>
                        <span className="font-medium">
                          {selectedProduct.accessType === 'BOTH' ? 'Curso + Comunidade' : 
                           selectedProduct.accessType === 'COURSE' ? 'Curso' : 'Comunidade'}
                        </span>
                      </div>
                      {selectedProduct._count && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Usuários com acesso</span>
                          <span className="font-medium">{selectedProduct._count.users}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Criado em</span>
                        <span className="font-medium">{new Date(selectedProduct.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/products/edit/${selectedProduct.id}`)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Editar produto
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDeleteProduct(selectedProduct.id)}
                        disabled={deleteLoading}
                        className="px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        {deleteLoading ? 'Excluindo...' : 'Excluir'}
                      </motion.button>
                    </div>
                    
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/products/${selectedProduct.id}/setup`)}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiEdit className="w-4 h-4" />
                        Editar Área de Membros
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setIsAccessModalOpen(true);
                          setSelectedProduct(selectedProduct);
                        }}
                        className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <FiUsers className="w-4 h-4" />
                        Gerenciar Acessos
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        
        {/* Product Access Modal */}
        {selectedProduct && (
          <ProductAccessModal
            isOpen={isAccessModalOpen}
            onClose={() => setIsAccessModalOpen(false)}
            productId={selectedProduct.id}
            productName={selectedProduct.name}
          />
        )}
      </main>
    </div>
  );
}