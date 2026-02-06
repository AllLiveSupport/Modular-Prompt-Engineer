import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from '../../contexts/LanguageContext';

interface ImageUploaderProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

const ImageUploader = ({ images, onImagesChange }: ImageUploaderProps) => {
  const { t } = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      onImagesChange([...images, ...newFiles]);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set to false if we are leaving the main container, not entering a child
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles).filter(file => file.type.startsWith('image/'));
      if (newFiles.length > 0) {
        onImagesChange([...images, ...newFiles]);
      }
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-lg font-bold text-surface-50 flex items-center gap-2">
          <ImageIcon size={20} className="text-primary-400" />
          {t('imageLabel')}
        </label>
        {images.length > 0 && (
          <span className="text-xs font-semibold px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full border border-primary-500/20">
            {images.length} {t('images')}
          </span>
        )}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`group relative glass-morphism rounded-3xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-4 ${isDragging
          ? 'border-primary-400 bg-primary-500/20 scale-[1.02] shadow-2xl shadow-primary-500/30'
          : images.length > 0
            ? 'border-primary-500/30 bg-primary-500/5'
            : 'border-surface-700/50 hover:border-primary-500/50 hover:bg-primary-500/5'
          }`}
      >
        <div className="w-16 h-16 bg-surface-800 rounded-2xl flex items-center justify-center text-surface-400 group-hover:text-primary-400 group-hover:scale-110 transition-all duration-300">
          <Upload size={32} />
        </div>
        <div className="text-center">
          <p className="text-surface-200 font-semibold">{t('imagePlaceholder')}</p>
          <p className="text-xs text-surface-500 mt-1 uppercase tracking-wider">{t('imageLimit') || 'MAX 4 IMAGES'}</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {images.map((image, index) => (
            <div key={index} className="group relative aspect-square glass-morphism rounded-2xl overflow-hidden ring-1 ring-surface-700/50 shadow-lg animate-in fade-in slide-in-from-bottom-2">
              <img
                src={URL.createObjectURL(image)}
                alt={`upload-${index}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-surface-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 z-10"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;