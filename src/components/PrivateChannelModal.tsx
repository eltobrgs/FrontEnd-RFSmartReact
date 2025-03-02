import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLink } from 'react-icons/fi';

interface PrivateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'telegram' | 'whatsapp' | 'youtube';
}

export function PrivateChannelModal({ isOpen, onClose, platform }: PrivateChannelModalProps) {
  const [channelLink, setChannelLink] = useState('');
  const [error, setError] = useState('');

  const validateLink = (link: string) => {
    if (!link) {
      setError('O link é obrigatório');
      return false;
    }

    let isValid = true;
    switch (platform) {
      case 'telegram':
        isValid = link.includes('t.me/') || link.includes('telegram.me/');
        break;
      case 'whatsapp':
        isValid = link.includes('chat.whatsapp.com/');
        break;
      case 'youtube':
        isValid = link.includes('youtube.com/') || link.includes('youtu.be/');
        break;
    }

    if (!isValid) {
      setError(`Link inválido para ${platform}`);
    } else {
      setError('');
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLink(channelLink)) {
      // Handle form submission
      console.log({ platform, channelLink });
      onClose();
    }
  };

  const getPlatformTitle = () => {
    switch (platform) {
      case 'telegram':
        return 'Telegram';
      case 'whatsapp':
        return 'WhatsApp';
      case 'youtube':
        return 'YouTube';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black cursor-pointer z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-8 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-gray-900 rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-medium text-white">Conectar {getPlatformTitle()}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="channelLink" className="block text-sm font-medium text-gray-300 mb-2">
                  Link do {platform === 'youtube' ? 'canal' : 'grupo'}
                </label>
                <div className="relative">
                  <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="channelLink"
                    value={channelLink}
                    onChange={(e) => setChannelLink(e.target.value)}
                    placeholder={`Ex: https://${platform}.com/...`}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Conectar
              </motion.button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}