import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import pkg from 'multer-storage-cloudinary';
const CloudinaryStorage = pkg.CloudinaryStorage || (typeof pkg.default === 'function' ? pkg.default : pkg.default?.CloudinaryStorage) || pkg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const makeUploader = (folder, formats = ['jpg', 'jpeg', 'png', 'webp']) => {
  const storage = new CloudinaryStorage({
    cloudinary: Object.assign({}, cloudinary, { v2: cloudinary }),
    params: {
      folder: `solvixdocs/${folder}`,
      allowed_formats: formats,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    },
  });
  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.'));
      }
    }
  });
};

export const uploadLogo = makeUploader('logos').single('logo');
export const uploadQrCode = makeUploader('qrcodes').single('qrCode');

export const deleteFromCloudinary = async (publicId) => {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Error deleting ${publicId} from Cloudinary:`, error);
    }
  }
};

// For PDF storage (raw_upload, no transformation)
export const uploadPdfToCloudinary = async (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'solvixdocs/pdfs',
        public_id: publicId,
        format: 'pdf',
        overwrite: true,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
};
