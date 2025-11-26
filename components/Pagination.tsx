import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState<string>('');

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handleGoto = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(inputPage);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setInputPage('');
    }
  };

  // Generate range: Current - 2 to Current + 2, clamped by 1 and totalPages
  const renderPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    // Show first page if not in range
    if (start > 1) {
       pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`w-10 h-10 rounded-full text-sm font-medium transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700`}
        >
          1
        </button>
      );
      if (start > 2) {
         pages.push(<span key="dots-start" className="text-gray-500">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
            i === currentPage
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    // Show last page if not in range
    if (end < totalPages) {
       if (end < totalPages - 1) {
         pages.push(<span key="dots-end" className="text-gray-500">...</span>);
       }
       pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`w-10 h-10 rounded-full text-sm font-medium transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-8">
      
      {/* Navigation Buttons */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title="First Page"
        >
          <ChevronsLeft size={20} />
        </button>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title="Previous Page"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-1 mx-2 items-center">
            {renderPageNumbers()}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title="Next Page"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
          title="Last Page"
        >
          <ChevronsRight size={20} />
        </button>
      </div>

      {/* Goto Input */}
      {totalPages > 5 && (
        <form onSubmit={handleGoto} className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Go to:</span>
            <input
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            placeholder="#"
            className="w-16 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
            type="submit"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
            Go
            </button>
        </form>
      )}
    </div>
  );
};