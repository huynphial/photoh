import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGalleryConfig, fetchGalleryCover } from '../services/galleryService';
import { GalleryConfigItem } from '../types';
import { ArrowRight, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

interface GalleryWithCover extends GalleryConfigItem {
  coverUrl?: string | null;
}

export const Home: React.FC = () => {
  const [galleries, setGalleries] = useState<GalleryWithCover[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfigAndCovers = async () => {
      try {
        const config = await fetchGalleryConfig();
        
        // Fetch covers for all galleries in parallel
        const galleriesWithCovers = await Promise.all(
          config.galleries.map(async (gallery) => {
            const coverUrl = await fetchGalleryCover(gallery.folderName);
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
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Photo Collections
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore our curated galleries. High resolution photography organized for your viewing pleasure.
        </p>
      </div>

      {galleries.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No galleries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery, index) => (
            <Link
              key={gallery.id}
              to={`/gallery/${gallery.folderName}/1`}
              className="group block bg-white dark:bg-gray-850 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              <div className="h-64 overflow-hidden relative">
                {gallery.coverUrl ? (
                  <img
                    src={gallery.coverUrl}
                    alt={gallery.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                    <span className="text-blue-400 mr-2">#{index + 1}</span>
                    {gallery.name}
                  </h2>
                  <div className="flex items-center text-gray-300 text-sm font-medium">
                     <span className="mr-2">{gallery.totalPages} {gallery.totalPages === 1 ? 'Page' : 'Pages'}</span>
                     <span className="mx-2">•</span>
                     <span className="flex items-center text-blue-300">
                        View Gallery <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                     </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};