import React, { useState, useEffect } from 'react';
import { PhotoData } from '../types';
import { Download, ExternalLink, Eye, Calendar, Maximize2, Loader2, Link as LinkIcon, Save } from 'lucide-react';
import { SAVE_API_URL } from '../constants';

interface PhotoCardProps {
  photo: PhotoData;
  index: number;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo, index }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Image Loading State
  // Prioritize 2000px version, fallback to max
  const [imgSrc, setImgSrc] = useState<string>(photo.url_max_2000 || photo.url_max);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Reset state when photo prop changes
  useEffect(() => {
    setImgSrc(photo.url_max_2000 || photo.url_max);
    setIsVisible(true);
  }, [photo]);

  const handleImageError = () => {
    // If we are currently trying url_max_2000, and url_max exists and is different
    if (imgSrc === photo.url_max_2000 && photo.url_max && photo.url_max !== photo.url_max_2000) {
      // Silently fall back
      setImgSrc(photo.url_max);
    } else {
      // Otherwise (failed on fallback, or only one url existed, or urls were same), hide the card silently
      setIsVisible(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      // Download the currently visible image or fall back to url_max
      const response = await fetch(imgSrc || photo.url_max);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Use title or ID for filename
      const filename = photo.title ? `${photo.title}.jpg` : `${photo.id}.jpg`;
      link.download = filename; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: just open the link if CORS prevents blob fetching
      window.open(photo.url_max, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenOriginal = () => {
    window.open(photo.url_max, '_blank');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(SAVE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(photo)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.text();
      console.log('Save result:', result);
      // Silent success
    } catch (error) {
      console.error('Failed to save photo:', error);
      // Silent failure (logged to console)
    } finally {
      setIsSaving(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white dark:bg-gray-850 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800 break-inside-avoid mb-4">
      {/* Image Container - Natural Aspect Ratio */}
      <div className="relative group w-full">
        <img
          src={imgSrc}
          alt={photo.title || photo.id}
          className="w-full h-auto block"
          loading="lazy"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 pointer-events-none" />
        
        {/* Overlay Buttons (Only visible on hover for cleaner look in masonry) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
           <a
            href={photo.flickr_page}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
            title="Open Flickr Page"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-tight mb-1" title={photo.title || 'Untitled'}>
            <span className="text-blue-600 dark:text-blue-400 mr-2">#{index}</span>
            {photo.title || 'Untitled'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            by {photo.realname || photo.ownername}
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1" title="Resolution">
            <Maximize2 size={12} />
            <span>{photo.max_width} x {photo.max_height}</span>
          </div>
          <div className="flex items-center gap-1" title="Views">
            <Eye size={12} />
            <span>{parseInt(photo.count_view).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1" title="Date Taken">
            <Calendar size={12} />
            <span>{photo.datetaken.split(' ')[0]}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
            <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white text-gray-700 dark:text-gray-200 text-sm py-2 px-3 rounded transition-all duration-200"
            title="Download Image"
            >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span>Download</span>
            </button>

            <button
            onClick={handleOpenOriginal}
            className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm py-2 px-3 rounded transition-all duration-200"
            title="Open Original Link"
            >
            <LinkIcon size={16} />
            </button>

            <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-green-600 dark:hover:bg-green-600 hover:text-white dark:hover:text-white text-gray-700 dark:text-gray-200 text-sm py-2 px-3 rounded transition-all duration-200"
            title="Save Info"
            >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            </button>
        </div>
      </div>
    </div>
  );
};