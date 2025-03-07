// React core
import { useState, useEffect } from 'react';

// Components
import { Sidebar } from '../../components/Sidebar';

// Animations
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { FiSearch, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

// Importando a variável API_BASE_URL
import { API_BASE_URL } from '../../variables/api';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  accessType: 'COURSE' | 'COMMUNITY' | 'BOTH';
  discountPrice?: number;
  createdAt: string;
  contactWhatsapp?: string;
  createdBy?: {
    id: string;
    name: string;
    avatar: string;
  };
  rating?: number;
  studentsCount?: number;
}
export function BuyProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [products, setProducts] = useState<Product[]>([]);
  // Removido o uso de 'navigate' já que não está sendo utilizado
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentProduct, setPaymentProduct] = useState<Product | null>(null);

  // Buscar produtos disponíveis
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/products/available-to-buy`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Falha ao carregar produtos');
        }
        
        const data = await response.json();
        
        // Adicionar propriedades para compatibilidade com a interface
        const formattedProducts = data.map((product: Product) => ({
          ...product,
          rating: 4.5 + Math.random() * 0.5, // Valor aleatório entre 4.5 e 5.0
          studentsCount: Math.floor(Math.random() * 2000) + 100, // Valor aleatório entre 100 e 2100
          accessType: product.accessType as 'COURSE' | 'COMMUNITY' | 'BOTH'
        }));
        
        setProducts(formattedProducts);
        
        // Extrair categorias únicas
        const uniqueCategories = ['Todas', ...new Set(formattedProducts.map((product: Product) => product.category))];
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
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBuyNow = async (productId: string) => {
    try {
      // Encontrar o produto selecionado
      const product = products.find(p => p.id === productId);
      
      if (product) {
        setPaymentProduct(product);
        setIsPaymentModalOpen(true);
      }
    } catch (err) {
      console.error('Erro ao processar compra:', err);
    }
  };

  const formatWhatsAppLink = (number: string, productName: string, price: number) => {
    // Remover caracteres não numéricos
    const cleanNumber = number.replace(/\D/g, '');
    
    // Formatar a mensagem
    const message = encodeURIComponent(
      `Olá! Gostaria de comprar o produto "${productName}" por R$ ${price.toFixed(2)}. Como posso efetuar o pagamento?`
    );
    
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-medium text-gray-800">Produtos Disponíveis</h1>
          
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
            <p className="text-gray-500">Tente ajustar seus filtros ou busque por outro termo.</p>
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
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700`}>
                  {product.accessType === 'BOTH' ? 'Curso + Comunidade' : 
                   product.accessType === 'COURSE' ? 'Curso' : 'Comunidade'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">{product.rating?.toFixed(1) || '4.5'}</span>
                  </div>
                  <span className="text-sm text-gray-500">{product.studentsCount || '0'} alunos</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.discountPrice ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-gray-500">R$</span>
                          <span className="text-lg font-medium text-gray-900">{product.discountPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-gray-400">R$</span>
                          <span className="text-sm text-gray-400 line-through">{product.price.toFixed(2)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm text-gray-500">R$</span>
                        <span className="text-lg font-medium text-gray-900">{product.price.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(product.id);
                    }}
                  >
                    Comprar Agora
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
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {selectedProduct.accessType === 'BOTH' ? 'Curso + Comunidade' : 
                         selectedProduct.accessType === 'COURSE' ? 'Curso' : 'Comunidade'}
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
                      {selectedProduct.createdBy && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Criado por</span>
                          <span className="font-medium">{selectedProduct.createdBy.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBuyNow(selectedProduct.id)}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Comprar Agora
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {isPaymentModalOpen && paymentProduct && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black cursor-pointer z-50"
                onClick={() => setIsPaymentModalOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
              >
                <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-medium text-gray-900">Finalizar Compra</h2>
                      <button
                        onClick={() => setIsPaymentModalOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Resumo da compra</h3>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={paymentProduct.image || `https://source.unsplash.com/random/100x100/?${paymentProduct.category.toLowerCase()}`}
                          alt={paymentProduct.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{paymentProduct.name}</p>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-sm text-gray-500">R$</span>
                            <span className="text-lg font-medium text-gray-900">
                              {(paymentProduct.discountPrice || paymentProduct.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Instruções de Pagamento</h3>
                      <p className="text-gray-600 mb-4">
                        Para finalizar sua compra, entre em contato com o vendedor via WhatsApp. 
                        Após o pagamento, seu acesso será liberado.
                      </p>
                      
                      {paymentProduct.contactWhatsapp ? (
                        <a
                          href={formatWhatsAppLink(
                            paymentProduct.contactWhatsapp,
                            paymentProduct.name,
                            paymentProduct.discountPrice || paymentProduct.price
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <FaWhatsapp className="w-5 h-5" />
                          <span>Conversar com Vendedor</span>
                        </a>
                      ) : (
                        <div className="text-center p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                          <p>O vendedor não disponibilizou um número de WhatsApp para contato.</p>
                          <p className="mt-2">Entre em contato pelo suporte da plataforma.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}