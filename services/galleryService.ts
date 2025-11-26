import { PhotoData, GalleryConfig } from '../types';
import { CONFIG_PATH, DATA_BASE_URL } from '../constants';

export const fetchGalleryConfig = async (): Promise<GalleryConfig> => {
  try {
    const response = await fetch(CONFIG_PATH);
    if (!response.ok) {
      throw new Error(`Failed to load gallery config: ${response.statusText}`);
    }
    const data = await response.json();
    return data as GalleryConfig;
  } catch (error) {
    console.error("Error loading gallery config:", error);
    // Return empty config on failure to prevent app crash, though UI should handle empty state
    return { galleries: [] };
  }
};

export const fetchGalleryData = async (folderName: string, page: number): Promise<PhotoData[]> => {
  try {
    // Construct path using the remote base URL
    // Format: https://huynphial.github.io/photohrepo/data/<folderName>/<page>.json
    const path = `${DATA_BASE_URL}/${folderName}/${page}.json`;
    
    const response = await fetch(path);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Page not found');
      }
      throw new Error(`Failed to fetch gallery data: ${response.statusText}`);
    }

    const data = await response.json();
    return data as PhotoData[];
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    throw error;
  }
};

export const fetchGalleryCover = async (folderName: string): Promise<string | null> => {
  try {
    // Fetch the first page to get the first image
    const data = await fetchGalleryData(folderName, 1);
    if (data && data.length > 0) {
      return data[0].url_max_2000 || data[0].url_max;
    }
    return null;
  } catch (error) {
    console.warn(`Failed to fetch cover for gallery ${folderName}`, error);
    return null;
  }
};