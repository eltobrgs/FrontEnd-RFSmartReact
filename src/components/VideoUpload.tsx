import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiYoutube } from 'react-icons/fi';

interface VideoUploadProps {
  onChange: (file: File | null) => void;
  onYoutubeChange: (url: string) => void;
  preview?: string;
  youtubeUrl?: string;
  onRemove?: () => void;
  className?: string;
  label?: string;
}

export const VideoUpload = ({ 
  onChange, 
  onYoutubeChange,
  preview, 
  youtubeUrl,
  onRemove, 
  className = '', 
  label = 'Fazer upload de vídeo' 
}: VideoUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
  const [useYoutube, setUseYoutube] = useState<boolean>(!!youtubeUrl);
  const [youtubeLink, setYoutubeLink] = useState<string>(youtubeUrl || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preview) {
      setPreviewUrl(preview);
    }
    if (youtubeUrl) {
      setYoutubeLink(youtubeUrl);
      setUseYoutube(true);
    }
  }, [preview, youtubeUrl]);

  useEffect(() => {
    if (selectedFile) {
      console.log('Enviando arquivo existente para o componente pai:', selectedFile.name);
      onChange(selectedFile);
    }
  }, [selectedFile, onChange]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log('Arquivo selecionado no input:', file?.name, file?.size);
    
    if (file) {
      setSelectedFile(file);
      onChange(file);
      setUseYoutube(false);
      setYoutubeLink('');
      onYoutubeChange('');
      
      const videoUrl = URL.createObjectURL(file);
      setPreviewUrl(videoUrl);
      
      console.log('onChange chamado com arquivo:', file.name);
    }
  };

  const handleDirectFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log('Arquivo selecionado no input direto:', file?.name, file?.size);
    
    if (file) {
      setSelectedFile(file);
      onChange(file);
      setUseYoutube(false);
      setYoutubeLink('');
      onYoutubeChange('');
      
      const videoUrl = URL.createObjectURL(file);
      setPreviewUrl(videoUrl);
      
      console.log('onChange chamado com arquivo direto:', file.name);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type.includes('video/')) {
      console.log('Arquivo arrastado:', file.name, file.size);
      setSelectedFile(file);
      onChange(file);
      setUseYoutube(false);
      setYoutubeLink('');
      onYoutubeChange('');
      
      const videoUrl = URL.createObjectURL(file);
      setPreviewUrl(videoUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (directFileInputRef.current) {
      directFileInputRef.current.value = '';
    }
    onChange(null);
    if (onRemove) onRemove();
  };

  const handleYoutubeToggle = () => {
    setUseYoutube(!useYoutube);
    if (!useYoutube) {
      handleRemove();
    } else {
      setYoutubeLink('');
      onYoutubeChange('');
    }
  };

  const handleYoutubeLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeLink(url);
    onYoutubeChange(url);
  };

  const handleDirectUploadClick = () => {
    if (directFileInputRef.current) {
      directFileInputRef.current.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 flex items-center">
        <button
          type="button"
          className={`px-4 py-2 mr-2 rounded-lg transition-colors ${!useYoutube ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => useYoutube && handleYoutubeToggle()}
        >
          Upload de arquivo
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg transition-colors ${useYoutube ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => !useYoutube && handleYoutubeToggle()}
        >
          Link do YouTube
        </button>
      </div>

      {useYoutube ? (
        <div className="w-full">
          <div className="flex items-center">
            <FiYoutube className="w-6 h-6 text-red-500 mr-2" />
            <input
              type="url"
              value={youtubeLink}
              onChange={handleYoutubeLinkChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Cole a URL do vídeo no YouTube"
            />
          </div>
          {youtubeLink && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Pré-visualização:</p>
              <iframe
                width="100%"
                height="315"
                src={youtubeLink.replace('watch?v=', 'embed/')}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          )}
        </div>
      ) : (
        <>
          {previewUrl ? (
            <div className="relative">
              <video 
                src={previewUrl} 
                controls 
                className="w-full rounded-lg"
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
            <>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <FiUpload className="w-10 h-10 text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">{label}</p>
                <p className="text-xs text-gray-400">Arraste e solte ou clique para selecionar</p>
                <p className="text-xs text-gray-400 mt-2">Formatos aceitos: MP4, WebM, MOV</p>
              </div>
              
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 mb-2">Upload direto:</p>
                <p className="text-xs text-blue-600 mb-3">Se o upload normal não estiver funcionando, use este método alternativo.</p>
                <button
                  type="button"
                  onClick={handleDirectUploadClick}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Escolher Arquivo
                </button>
                <input
                  type="file"
                  ref={directFileInputRef}
                  onChange={handleDirectFileChange}
                  className="hidden"
                  accept="video/*"
                />
              </div>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="video/*"
          />
        </>
      )}
    </div>
  );
}; 