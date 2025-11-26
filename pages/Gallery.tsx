import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PhotoData, GalleryConfigItem } from '../types';
import { fetchGalleryData, fetchGalleryConfig } from '../services/galleryService';
import { PhotoCard } from '../components/PhotoCard';
import { Pagination } from '../components/Pagination';
import { Loader2, AlertCircle, ArrowLeft, Grid3X3, Minus, Plus, ChevronDown, ChevronsDown, ChevronLeft, ChevronRight } from 'lucide-react';

export const Gallery: React.FC = () => {
  const { folder, page } = useParams<{ folder: string; page: string }>();
  const navigate = useNavigate();
  
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [galleryInfo, setGalleryInfo] = useState<GalleryConfigItem | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Grid State
  const [columnCount, setColumnCount] = useState<number>(4);

  const currentPage = parseInt(page || '1', 10);

  useEffect(() => {
    // Responsive default columns
    const updateDefaultColumns = () => {
        if (window.innerWidth < 640) setColumnCount(1);
        else if (window.innerWidth < 1024) setColumnCount(2);
        else setColumnCount(4);
    };
    
    updateDefaultColumns();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!folder) return;
      
      setLoading(true);
      setError(null);
      setPhotos([]);

      try {
        // Run fetches in parallel for better performance
        const [config, data] = await Promise.all([
          fetchGalleryConfig(),
          fetchGalleryData(folder, currentPage)
        ]);

        const info = config.galleries.find(g => g.folderName === folder);
        if (!info) {
             throw new Error("Gallery configuration not found.");
        }
        setGalleryInfo(info);
        setPhotos(data);
      } catch (err) {
        console.error(err);
        setError("Could not load photos. You may have reached the end of the gallery or the page does not exist.");
      } finally {
        setLoading(false);
        // Scroll to top on page change
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    loadData();
  }, [folder, currentPage]);

  const handlePageChange = (newPage: number) => {
    navigate(`/gallery/${folder}/${newPage}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // --- Floating Actions ---
  const handleScrollBottom = () => {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
  };

  const handleScroll20Pics = () => {
      // Approximate height of 20 pictures based on columns. 
      // Assuming avg card height ~400px (including margin). 
      // Rows to scroll = 20 / columnCount.
      const estimatedRowHeight = 400;
      const rowsToScroll = 20 / columnCount;
      const scrollAmount = rowsToScroll * estimatedRowHeight;
      
      window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
      });
  };

  const handleNextPage = () => {
      if (galleryInfo && currentPage < galleryInfo.totalPages) {
          handlePageChange(currentPage + 1);
      }
  };

  const handlePrevPage = () => {
      if (currentPage > 1) {
          handlePageChange(currentPage - 1);
      }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <button 
            onClick={handleBackToHome}
            className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-2 transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Collections
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {galleryInfo?.name || folder} 
            {galleryInfo?.totalPages && galleryInfo.totalPages > 1 && (
                <span className="text-gray-400 dark:text-gray-600 text-xl font-normal ml-2">
                    Page {currentPage} of {galleryInfo.totalPages}
                </span>
            )}
          </h1>
        </div>

        {/* Grid Control */}
        {!loading && !error && photos.length > 0 && (
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 px-2 border-r border-gray-200 dark:border-gray-700">
                    <Grid3X3 size={18} />
                    <span className="text-sm font-medium hidden sm:inline">View</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setColumnCount(Math.max(1, columnCount - 1))}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                        title="Increase Size (Fewer Columns)"
                    >
                        <Minus size={16} />
                    </button>
                    
                    <input 
                        type="range" 
                        min="1" 
                        max="6" 
                        value={columnCount} 
                        onChange={(e) => setColumnCount(parseInt(e.target.value))}
                        className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                    />
                    
                    <button 
                        onClick={() => setColumnCount(Math.min(6, columnCount + 1))}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300"
                        title="Decrease Size (More Columns)"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading gallery...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-4">
            <AlertCircle size={48} className="text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Oops!</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6">{error}</p>
          <div className="flex gap-4">
            {currentPage > 1 && (
                <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                Go Back One Page
                </button>
            )}
            <button
                onClick={handleBackToHome}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition-colors"
            >
                Home
            </button>
          </div>
        </div>
      )}

      {/* Gallery Grid (Masonry using CSS Columns) */}
      {!loading && !error && photos.length > 0 && (
        <>
          <div 
            className="w-full gap-4 transition-all duration-500"
            style={{ columnCount: columnCount }}
          >
            {photos.map((photo, index) => (
              <PhotoCard key={photo.id} photo={photo} index={index + 1} />
            ))}
          </div>

          <div className="mt-8 border-t border-gray-200 dark:border-gray-800">
             {galleryInfo && (
                <Pagination 
                currentPage={currentPage} 
                totalPages={galleryInfo.totalPages}
                onPageChange={handlePageChange} 
                />
             )}
          </div>

          {/* Floating Controls (Bottom Right) */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-40 print:hidden">
            {/* Navigation Group */}
             <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button 
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Previous Page"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="h-[1px] bg-gray-200 dark:bg-gray-700 w-full" />
                <button 
                    onClick={handleNextPage}
                    disabled={!galleryInfo || currentPage >= galleryInfo.totalPages}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Next Page"
                >
                    <ChevronRight size={20} />
                </button>
             </div>

             {/* Scroll Group */}
             <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mt-2">
                <button 
                    onClick={handleScroll20Pics}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                    title="Scroll down ~20 pics"
                >
                    <ChevronDown size={20} />
                </button>
                <div className="h-[1px] bg-gray-200 dark:bg-gray-700 w-full" />
                <button 
                    onClick={handleScrollBottom}
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                    title="Scroll to Bottom"
                >
                    <ChevronsDown size={20} />
                </button>
             </div>
          </div>
        </>
      )}

      {/* Empty State (Valid JSON but empty array) */}
      {!loading && !error && photos.length === 0 && (
         <div className="flex-grow flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 dark:text-gray-400 italic">No photos found in this list.</p>
         </div>
      )}
    </div>
  );
};