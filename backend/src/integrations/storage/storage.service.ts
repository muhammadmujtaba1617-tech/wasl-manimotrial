import crypto from 'crypto';

export interface UploadResult {
  fileId: string;
  storageKey: string;
  storageUrl: string;
  cdnUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  sha256Hash: string;
  uploadedAt: string;
  provider: 'CLOUDFLARE_R2' | 'AWS_S3' | 'MINIO';
}

export interface PresignedUrlResult {
  uploadUrl: string;
  storageKey: string;
  publicUrl: string;
  expiresInSeconds: number;
  provider: 'CLOUDFLARE_R2' | 'AWS_S3' | 'MINIO';
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

class CloudStorageService {
  private provider: 'CLOUDFLARE_R2' | 'AWS_S3' | 'MINIO' = 'CLOUDFLARE_R2';
  private bucketName: string = process.env.STORAGE_BUCKET || 'wasl-production-media';
  private cdnDomain: string = process.env.STORAGE_CDN_URL || 'https://media.wasl.app';
  private uploadedFiles: Map<string, UploadResult> = new Map();

  constructor() {
    if (process.env.STORAGE_PROVIDER === 'AWS_S3') {
      this.provider = 'AWS_S3';
    } else if (process.env.STORAGE_PROVIDER === 'MINIO') {
      this.provider = 'MINIO';
    }
  }

  generatePresignedUploadUrl(
    fileName: string,
    mimeType: string,
    folder: 'photos' | 'kyc_documents' | 'chat_media' = 'photos'
  ): PresignedUrlResult {
    if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      throw new Error(`Unsupported MIME type: ${mimeType}. Allowed: JPEG, PNG, WEBP, PDF.`);
    }

    const fileId = crypto.randomUUID();
    const ext = fileName.split('.').pop() || 'bin';
    const storageKey = `${folder}/${fileId}.${ext}`;
    const uploadUrl = `https://${this.bucketName}.r2.cloudflarestorage.com/${storageKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=3600`;
    const publicUrl = `${this.cdnDomain}/${storageKey}`;

    return {
      uploadUrl,
      storageKey,
      publicUrl,
      expiresInSeconds: 3600,
      provider: this.provider
    };
  }

  async processDirectUpload(
    fileName: string,
    mimeType: string,
    fileDataBufferOrBase64: string | Buffer,
    folder: 'photos' | 'kyc_documents' | 'chat_media' = 'photos'
  ): Promise<UploadResult> {
    if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
      throw new Error(`Unsupported file type: ${mimeType}. Allowed: JPEG, PNG, WEBP, PDF.`);
    }

    let buffer: Buffer;
    if (typeof fileDataBufferOrBase64 === 'string') {
      const base64Data = fileDataBufferOrBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
    } else {
      buffer = fileDataBufferOrBase64;
    }

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File exceeds maximum permitted size of 10MB (Received: ${(buffer.length / 1024 / 1024).toFixed(2)}MB).`);
    }

    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const fileId = crypto.randomUUID();
    const ext = fileName.split('.').pop() || (mimeType === 'application/pdf' ? 'pdf' : 'jpg');
    const storageKey = `${folder}/${fileId}.${ext}`;
    const storageUrl = `s3://${this.bucketName}/${storageKey}`;
    const cdnUrl = `${this.cdnDomain}/${storageKey}`;

    const result: UploadResult = {
      fileId,
      storageKey,
      storageUrl,
      cdnUrl,
      fileName,
      fileSize: buffer.length,
      mimeType,
      sha256Hash,
      uploadedAt: new Date().toISOString(),
      provider: this.provider
    };

    this.uploadedFiles.set(fileId, result);
    return result;
  }

  getFileMetadata(fileId: string): UploadResult | null {
    return this.uploadedFiles.get(fileId) || null;
  }
}

export const cloudStorageService = new CloudStorageService();
