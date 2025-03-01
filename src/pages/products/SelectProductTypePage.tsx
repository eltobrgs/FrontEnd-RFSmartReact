import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { FaDiscord, FaTelegram, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { BsPersonWorkspace } from 'react-icons/bs';
import { HiShoppingCart } from 'react-icons/hi';

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
      className="p-6 bg-white rounded-lg border-2 border-transparent hover:border-green-500 cursor-pointer transition-all"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="text-4xl text-gray-700">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}

export function SelectProductTypePage() {
  const productTypes = [
    {
      icon: <BsPersonWorkspace />,
      title: "Área de Membros",
      description: "Cursos on-line e comunidade",
    },
    {
      icon: <FaTelegram />,
      title: "Telegram",
      description: "Grupo ou canal privado",
    },
    {
      icon: <FaInstagram />,
      title: "Instagram",
      description: "Perfil Privado ou Close Friends",
    },
    {
      icon: <FaDiscord />,
      title: "Discord",
      description: "Servidor privado",
    },
    {
      icon: <FaWhatsapp />,
      title: "Whatsapp",
      description: "Grupo privado",
    },
    {
      icon: <HiShoppingCart />,
      title: "Usar somente checkout",
      description: "Entregar o conteúdo de outra forma",
    },
  ];

  const navigate = useNavigate();

  const handleProductTypeSelect = (type: string) => {
    if (type === "Área de Membros") {
      navigate('/products/create/membership');
    } else {
      // Handle other product types
      console.log(`Selected product type: ${type}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Back button */}
        <Link
          to="/products/create"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <motion.div
            whileHover={{ x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft className="w-5 h-5" />
          </motion.div>
          <span>Voltar</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            O que você vai vender?
          </h1>
          <p className="text-gray-600">
            Escolha o tipo de produto que você quer criar
          </p>
        </motion.div>

        {/* Product types grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {productTypes.map((type) => (
            <ProductTypeCard
              key={type.title}
              icon={type.icon}
              title={type.title}
              description={type.description}
              onClick={() => handleProductTypeSelect(type.title)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}