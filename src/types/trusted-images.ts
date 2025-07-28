export interface TrustedImage {
  image_name: string;
  image_url: string;
  image_status: string;
}

export interface GroupedTrustedImage {
  image_name: string;
  images: TrustedImage[];
} 