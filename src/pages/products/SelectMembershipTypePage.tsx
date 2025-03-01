import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

interface MembershipTypeCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

function MembershipTypeCard({ title, description, onClick }: MembershipTypeCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="p-6 bg-white rounded-lg border-2 border-transparent hover:border-green-500 cursor-pointer transition-all"
      onClick={onClick}
    >
      <div className="flex flex-col items-start space-y-2">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}

export function SelectMembershipTypePage() {
  const membershipTypes = [
    {
      title: "Somente Comunidade",
      description: "Conteúdos no formato de posts ou cursos",
    },
    {
      title: "Somente Cursos",
      description: "Área de cursos estilo Netflix",
    },
    {
      title: "Cursos e Comunidade",
      description: "Habilita as duas áreas, cursos e comunidade",
    },
  ];

  const navigate = useNavigate();

  const handleMembershipTypeSelect = () => {
    // Navigate to the setup page regardless of the type selected
    navigate('/products/create/membership/setup');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Back button */}
        <Link
          to="/products/create/type"
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
          className="mb-8"
        >
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            O que você quer vender na área de membros?
          </h1>
          <p className="text-gray-600">
            Fique tranquilo. Você pode habilitar e desabilitar estas opções depois.
          </p>
        </motion.div>

        {/* Membership types grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 gap-4"
        >
          {membershipTypes.map((type) => (
            <MembershipTypeCard
              key={type.title}
              title={type.title}
              description={type.description}
              onClick={handleMembershipTypeSelect}
            />
          ))}          
        </motion.div>
      </div>
    </div>
  );
}