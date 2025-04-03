import { useState, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiX } from 'react-icons/fi';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  preview?: string;
  onRemove?: () => void;
  className?: string;
  label?: string;
}

export const ImageUpload = ({ 
  onChange, 
  preview, 
  onRemove, 
  className = '', 
  label = 'Fazer upload de imagem' 
}: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      onChange(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange(null);
    if (onRemove) onRemove();
  };

  return (
    <div className={`w-full ${className}`}>
      {previewUrl ? (
        <div className="relative">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-64 object-cover rounded-lg"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
            type="button"
          >
            <FiX className="w-4 h-4" />
          </motion.button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-green-500 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <FiUpload className="w-10 h-10 text-gray-400 mb-4" />
          <p className="text-gray-500 mb-2">{label}</p>
          <p className="text-xs text-gray-400">Arraste e solte ou clique para selecionar</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}; 