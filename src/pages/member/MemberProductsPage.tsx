// React core
import { useState } from 'react';

// Components
import { Sidebar } from '../../components/Sidebar';

// Animations
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { FiSearch, FiX } from 'react-icons/fi';

// Mock data
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  accessType: 'course' | 'community' | 'both';
  lastAccessed?: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Curso de Marketing Digital',
    description: 'Aprenda as melhores estratégias de marketing digital',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Marketing',
    accessType: 'course',
    lastAccessed: '2024-01-15'
  },
  {
    id: 2,
    name: 'Masterclass de Vendas',
    description: 'Técnicas avançadas de vendas e negociação',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Vendas',
    accessType: 'both',
    lastAccessed: '2024-01-20'
  },
];

export function MemberProductsPage() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', ...new Set(mockProducts.map(product => product.category))];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          </div>
        </div>

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
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700`}>
                  {product.accessType === 'both' ? 'Curso + Comunidade' : 
                   product.accessType === 'course' ? 'Curso' : 'Comunidade'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Último acesso: {product.lastAccessed}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate to content
                      navigate(`/member/products/${product.id}/content`);
                    }}
                  >
                    Acessar Conteúdo
                  </motion.button>
                </div>
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
                    src={selectedProduct.image}
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
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {selectedProduct.accessType === 'both' ? 'Curso + Comunidade' : 
                         selectedProduct.accessType === 'course' ? 'Curso' : 'Comunidade'}
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
                        <span className="text-gray-500">Último acesso</span>
                        <span className="font-medium">{selectedProduct.lastAccessed}</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/member/products/${selectedProduct.id}/content`)}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Acessar Conteúdo
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}