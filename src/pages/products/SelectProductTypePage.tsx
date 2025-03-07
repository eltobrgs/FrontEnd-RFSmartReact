import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiBook, FiUsers, FiPackage } from 'react-icons/fi';
import { FaDiscord, FaTelegram, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { BsPersonWorkspace } from 'react-icons/bs';
import { HiShoppingCart } from 'react-icons/hi';
import { Sidebar } from '../../components/Sidebar';

interface ProductTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function ProductTypeCard({ icon, title, description, onClick }: ProductTypeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white p-6 rounded-xl shadow-sm cursor-pointer border-2 border-transparent hover:border-green-500 transition-all"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function SelectProductTypePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productData, setProductData] = useState<any>(null);
  
  // Carregar dados do produto do localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('productCreationData');
    if (storedData) {
      try {
        setProductData(JSON.parse(storedData));
      } catch (err) {
        console.error('Erro ao carregar dados do produto:', err);
        setError('Erro ao carregar dados do produto. Por favor, comece novamente.');
      }
    } else {
      // Se não houver dados, voltar para a página inicial de criação
      navigate('/products/create');
    }
  }, [navigate]);

  const handleProductTypeSelect = async (type: string) => {
    if (!productData) {
      setError('Dados do produto não encontrados. Por favor, comece novamente.');
      return;
    }
    
    try {
      setLoading(true);
      
      // Atualizar os dados do produto com o tipo selecionado
      const updatedProductData = {
        ...productData,
        accessType: type === 'course' ? 'COURSE' : type === 'community' ? 'COMMUNITY' : 'BOTH'
      };
      
      // Salvar no localStorage para uso na próxima etapa
      localStorage.setItem('productCreationData', JSON.stringify(updatedProductData));
      
      // Criar o produto na API
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProductData)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao criar produto');
      }
      
      const createdProduct = await response.json();
      
      // Limpar dados do localStorage
      localStorage.removeItem('productCreationData');
      
      // Navegar para a página de configuração do produto
      // Redirecionar para a página de configuração de membros com o ID do produto
      navigate(`/products/${createdProduct.id}/setup`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar produto');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!productData) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              {error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                  {error}
                </div>
              ) : (
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              )}
              {error && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/products/create')}
                  className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Voltar para o início
                </motion.button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-medium text-gray-800">Selecione o Tipo de Produto</h1>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <ProductTypeCard
                icon={<FiBook className="w-6 h-6" />}
                title="Curso"
                description="Crie um curso com módulos e aulas para seus alunos aprenderem no seu ritmo."
                onClick={() => handleProductTypeSelect('course')}
              />
              
              <ProductTypeCard
                icon={<FiUsers className="w-6 h-6" />}
                title="Comunidade"
                description="Crie uma comunidade com posts, grupos privados e interação entre membros."
                onClick={() => handleProductTypeSelect('community')}
              />
              
              <ProductTypeCard
                icon={<FiPackage className="w-6 h-6" />}
                title="Curso + Comunidade"
                description="Combine um curso estruturado com uma comunidade para oferecer a experiência completa."
                onClick={() => handleProductTypeSelect('both')}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}