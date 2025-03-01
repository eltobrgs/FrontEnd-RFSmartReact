import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

export function CreateProductPage() {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/products/create/type');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Back button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <motion.div
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft className="w-5 h-5" />
          </motion.div>
          <span>Meus produtos</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Vamos criar seu produto na Lastlink
          </h1>
          <p className="text-gray-600">
            Conte sobre seu produto. Estas informações estarão visíveis para todos.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="space-y-6">
            {/* Product name */}
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do seu produto
              </label>
              <input
                type="text"
                id="productName"
                placeholder="Ex: Iniciantes no Marketing Digital"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                id="category"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="" disabled selected>Selecione um nicho</option>
                <option value="marketing">Marketing Digital</option>
                <option value="business">Negócios</option>
                <option value="technology">Tecnologia</option>
                <option value="personal-development">Desenvolvimento Pessoal</option>
              </select>
            </div>

            {/* Continue button */}
            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              CONTINUAR
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}