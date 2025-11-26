export interface PhotoData {
  id: string;
  owner: string;
  title: string;
  realname: string;
  ownername: string;
  datetaken: string;
  max_width: number;
  max_height: number;
  url_max: string;
  max_width_2000: number;
  max_height_2000: number;
  url_max_2000: string;
  flickr_page: string;
  count_view: string;
}

export interface GalleryConfigItem {
  id: string;
  name: string;
  folderName: string;
  totalPages: number;
}

export interface GalleryConfig {
  galleries: GalleryConfigItem[];
}