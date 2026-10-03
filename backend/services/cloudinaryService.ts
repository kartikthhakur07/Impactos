import { v2 as cloudinary } from 'cloudinary';

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

export interface CloudinaryUploadResponse {
  success: boolean;
  url?: string;
  publicId?: string;
  version?: number;
  error?: string;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string,
  folder: string = 'impactos/uploads'
): Promise<CloudinaryUploadResponse> {
  if (!isCloudinaryConfigured) {
    return { success: false, error: 'Cloudinary credentials not configured in environment' };
  }

  return new Promise((resolve) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        public_id: `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      },
      (error, result) => {
        if (error || !result) {
          console.warn('Cloudinary upload warning (falling back to local):', error?.message);
          resolve({ success: false, error: error?.message || 'Upload failed' });
        } else {
          resolve({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            version: result.version
          });
        }
      }
    );
    (stream as any).end(buffer);
  });
}
