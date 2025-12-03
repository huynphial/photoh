import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGalleryConfig, fetchGalleryCover } from '../services/galleryService';
import { GalleryConfigItem } from '../types';
import { ArrowRight, Image as ImageIcon, Loader2, AlertCircle, FolderOpen } from 'lucide-react';

interface GalleryWithCover extends GalleryConfigItem {
  coverUrl?: string | null;
}

// Sub-component to handle individual card state (image error handling)
const GalleryCard: React.FC<{ gallery: GalleryWithCover; index: number }> = ({ gallery, index }) => {
  const [imgError, setImgError] = useState(false);

  const showImage = gallery.showCover && gallery.coverUrl && !imgError;

  return (
    <Link
      to={`/gallery/${gallery.folderName}/1`}
      className="group block bg-white dark:bg-gray-850 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      <div className="h-40 overflow-hidden relative">
        {showImage ? (
          <>
            <img
              src={gallery.coverUrl || ''}
              alt={gallery.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity" />
          </>
        ) : (
          <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${gallery.showCover && !imgError ? 'bg-gray-200 dark:bg-gray-800' : 'bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900'}`}>
            {gallery.showCover && !imgError ? (
              <ImageIcon size={32} className="text-gray-400" />
            ) : (
              <FolderOpen size={40} className="text-white/20 group-hover:text-white/30 transition-colors transform group-hover:scale-110 duration-500" />
            )}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h2 className={`text-lg font-bold mb-0.5 leading-tight truncate ${showImage ? 'text-white' : 'text-white'}`}>
            <span className="text-blue-300 mr-1.5 text-sm">#{index + 1}</span>
            {gallery.name}
          </h2>
          <div className={`flex items-center text-xs font-medium ${showImage ? 'text-gray-300' : 'text-blue-100'}`}>
            <span className="mr-2">{gallery.totalPages} {gallery.totalPages === 1 ? 'Page' : 'Pages'}</span>
            <span className="flex-grow"></span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform opacity-0 group-hover:opacity-100" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export const Home: React.FC = () => {
  const [galleries, setGalleries] = useState<GalleryWithCover[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfigAndCovers = async () => {
      try {
        const config = await fetchGalleryConfig();

        // Fetch covers for all galleries in parallel only if showCover is true
        const galleriesWithCovers = await Promise.all(
          config.galleries.map(async (gallery) => {
            let coverUrl = null;
            if (gallery.showCover) {
              try {
                coverUrl = await fetchGalleryCover(gallery.folderName);
              } catch (e) {
                console.warn(`Could not load cover for ${gallery.folderName}`);
              }
            }
            return { ...gallery, coverUrl };
          })
        );

        setGalleries(galleriesWithCovers);
      } catch (err) {
        setError("Unable to load gallery collections.");
      } finally {
        setLoading(false);
      }
    };
    loadConfigAndCovers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Loading collections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Photo Collections
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {galleries.length} folders available.
        </p>
      </div>

      {galleries.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
          No galleries found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {galleries.map((gallery, index) => (
            <GalleryCard key={gallery.id} gallery={gallery} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};
