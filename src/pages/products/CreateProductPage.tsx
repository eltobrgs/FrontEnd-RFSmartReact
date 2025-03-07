import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from '../../components/Sidebar';
import { FiArrowLeft } from 'react-icons/fi';
import { API_BASE_URL } from '../../variables/api';

export function CreateProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    contactWhatsapp: '',
  });

  // Carregar dados do produto se estiver editando
  useEffect(() => {
    if (productId) {
      setIsEditing(true);
      fetchProductDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao carregar dados do produto');
      }
      
      const data = await response.json();
      
      setProductData({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        category: data.category,
        image: data.image || '',
        contactWhatsapp: data.contactWhatsapp || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do produto');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validação básica
    if (!productData.name || !productData.description || !productData.price || !productData.category) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isEditing) {
        // Atualizar produto existente
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        const productToUpdate = {
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price),
          category: productData.category,
          image: productData.image || undefined,
          contactWhatsapp: productData.contactWhatsapp || undefined
        };
        
        console.log('Atualizando produto com contactWhatsapp:', productData.contactWhatsapp);
        
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productToUpdate)
        });
        
        if (!response.ok) {
          throw new Error('Falha ao atualizar produto');
        }
        
        // Navegar de volta para a lista de produtos
        navigate('/products');
      } else {
        // Criar novo produto - fluxo existente
        console.log('Criando produto com contactWhatsapp:', productData.contactWhatsapp);
        localStorage.setItem('productCreationData', JSON.stringify(productData));
        navigate('/products/create/type');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar dados do produto');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/products')}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-medium text-gray-800">
                {isEditing ? 'Editar Produto' : 'Criar Novo Produto'}
              </h1>
            </div>
          </div>
          
          {loading && !productData.name ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleContinue} className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={productData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      placeholder="Ex: Curso de Marketing Digital"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      placeholder="Descreva seu produto em detalhes"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Preço (R$) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                        placeholder="99.90"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Vendas">Vendas</option>
                        <option value="Negócios">Negócios</option>
                        <option value="Tecnologia">Tecnologia</option>
                        <option value="Desenvolvimento Pessoal">Desenvolvimento Pessoal</option>
                        <option value="Finanças">Finanças</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      value={productData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Deixe em branco para usar uma imagem padrão
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="contactWhatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                      Link do WhatsApp para Pagamento *
                    </label>
                    <input
                      type="url"
                      id="contactWhatsapp"
                      name="contactWhatsapp"
                      value={productData.contactWhatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      placeholder="Ex: https://wa.me/5511999999999"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Link completo do WhatsApp que será exibido para os compradores entrarem em contato para pagamento
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                      disabled={loading}
                    >
                      {loading ? 'Processando...' : isEditing ? 'Salvar Alterações' : 'Continuar'}
                    </motion.button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}