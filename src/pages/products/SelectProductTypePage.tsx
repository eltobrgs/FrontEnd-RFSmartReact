import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiBook, FiUsers, FiPackage } from 'react-icons/fi';
import { Sidebar } from '../../components/Sidebar';
import { API_BASE_URL } from '../../variables/api';

export function SelectProductTypePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productData, setProductData] = useState<any>(null);
  // Comentar a variável imageFile e setImageFile que não são utilizadas
  // const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Recuperar dados do produto do localStorage
    const storedData = localStorage.getItem('productCreationData');
    if (storedData) {
      setProductData(JSON.parse(storedData));
    }

    // Recuperar arquivo de imagem, se existir
    const storedImageFile = localStorage.getItem('productImageFile');
    if (storedImageFile) {
      // const imageMetadata = JSON.parse(storedImageFile);
      JSON.parse(storedImageFile); // Apenas para parsing, sem atribuir a uma variável
    }
  }, []);

  const handleSelectType = async (type: 'course' | 'community' | 'both') => {
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
      
      // Criar o produto na API usando FormData para upload de arquivos
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('name', updatedProductData.name);
      formData.append('description', updatedProductData.description);
      formData.append('price', updatedProductData.price);
      formData.append('category', updatedProductData.category);
      formData.append('accessType', updatedProductData.accessType);
      formData.append('contactWhatsapp', updatedProductData.contactWhatsapp || '');
      
      // Adicionar arquivo de imagem, se existir
      if (updatedProductData.hasImage) {
        // Recuperar a imagem do DataURL salvo
        const imageDataUrl = localStorage.getItem('productImageDataUrl');
        if (imageDataUrl) {
          try {
            // Converter o DataURL de volta para um arquivo Blob/File
            const blob = await dataURLtoBlob(imageDataUrl);
            
            // Determinar o tipo de arquivo correto baseado no Data URL
            let fileType = 'image/png'; // padrão
            if (imageDataUrl.includes('data:image/jpeg')) fileType = 'image/jpeg';
            if (imageDataUrl.includes('data:image/webp')) fileType = 'image/webp';
            
            // Criar um arquivo para envio
            const file = new File([blob], 'product-image.' + fileType.split('/')[1], { type: fileType });
            
            // Adicionar o arquivo ao FormData
            formData.append('image', file);
          } catch (err) {
            console.error('Erro ao processar imagem:', err);
          }
        }
      }
      
      // Enviar o formulário com os dados
      await submitFormData(token, formData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar produto');
      console.error('Erro:', err);
      setLoading(false);
    }
  };

  // Função auxiliar para converter DataURL para Blob
  const dataURLtoBlob = async (dataURL: string): Promise<Blob> => {
    // Fetch API para converter dataURL para blob
    const res = await fetch(dataURL);
    const blob = await res.blob();
    return blob;
  };

  const submitFormData = async (token: string | null, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Falha ao criar produto');
    }
    
    const createdProduct = await response.json();
    
    // Limpar dados do localStorage
    localStorage.removeItem('productCreationData');
    localStorage.removeItem('productImageDataUrl');
    
    // Navegar para a página de configuração do produto
    navigate(`/products/${createdProduct.id}/setup`);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/products/create')}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-medium text-gray-800">
                Tipo de Produto
              </h1>
            </div>
          </div>
          
          {loading ? (
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
              
              <p className="text-gray-600 mb-8">
                Escolha o tipo de produto que você deseja criar. Esta configuração afeta como seu produto será apresentado e as funcionalidades disponíveis.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-green-500 cursor-pointer"
                  onClick={() => handleSelectType('course')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-green-100 rounded-full mb-4">
                      <FiBook className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Curso</h3>
                    <p className="text-gray-500 text-sm">
                      Crie aulas, módulos e lições. Ideal para ensinar habilidades ou compartilhar conhecimento estruturado.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-green-500 cursor-pointer"
                  onClick={() => handleSelectType('community')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-blue-100 rounded-full mb-4">
                      <FiUsers className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Comunidade</h3>
                    <p className="text-gray-500 text-sm">
                      Crie espaços sociais, grupos e discussões. Ideal para criar uma comunidade em torno de um tema.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-green-500 cursor-pointer"
                  onClick={() => handleSelectType('both')}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-purple-100 rounded-full mb-4">
                      <FiPackage className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Curso + Comunidade</h3>
                    <p className="text-gray-500 text-sm">
                      Combine cursos e comunidade. Ideal para uma experiência completa de aprendizado e networking.
                    </p>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}