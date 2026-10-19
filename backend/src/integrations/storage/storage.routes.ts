import { FastifyPluginAsync } from 'fastify';
import { cloudStorageService } from './storage.service.js';

export const storageRoutes: FastifyPluginAsync = async (fastify) => {
  // Generate presigned upload URL for direct client-to-R2/S3 upload
  fastify.post('/presigned-url', async (request, reply) => {
    const { fileName, mimeType, folder } = request.body as {
      fileName: string;
      mimeType: string;
      folder?: 'photos' | 'kyc_documents' | 'chat_media';
    };

    if (!fileName || !mimeType) {
      return reply.code(400).send({ error: 'fileName and mimeType are required' });
    }

    try {
      const presigned = cloudStorageService.generatePresignedUploadUrl(
        fileName,
        mimeType,
        folder || 'photos'
      );
      return reply.send({ success: true, ...presigned });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  });

  // Direct base64 / buffer file upload
  fastify.post('/upload', async (request, reply) => {
    const { fileName, mimeType, fileData, folder } = request.body as {
      fileName: string;
      mimeType: string;
      fileData: string;
      folder?: 'photos' | 'kyc_documents' | 'chat_media';
    };

    if (!fileName || !mimeType || !fileData) {
      return reply.code(400).send({ error: 'fileName, mimeType, and fileData (base64) are required' });
    }

    try {
      const uploadResult = await cloudStorageService.processDirectUpload(
        fileName,
        mimeType,
        fileData,
        folder || 'photos'
      );
      return reply.code(201).send({
        success: true,
        file: uploadResult,
        url: uploadResult.cdnUrl
      });
    } catch (err: any) {
      return reply.code(400).send({ error: err.message });
    }
  });

  // Get uploaded file metadata
  fastify.get('/files/:fileId', async (request, reply) => {
    const { fileId } = request.params as { fileId: string };
    const metadata = cloudStorageService.getFileMetadata(fileId);
    if (!metadata) {
      return reply.code(404).send({ error: 'File not found' });
    }
    return reply.send({ success: true, file: metadata });
  });
};
