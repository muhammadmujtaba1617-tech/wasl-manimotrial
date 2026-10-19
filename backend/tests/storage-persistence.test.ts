import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { buildApp } from '../src/server.js';

describe('Persistent Database State & Cloud Storage Uploader Endpoints', () => {
  let app: any;

  before(async () => {
    process.env.NODE_ENV = 'test';
    app = await buildApp();
  });

  after(async () => {
    if (app) {
      await app.close();
    }
  });

  it('generates a presigned upload URL for Cloudflare R2 / AWS S3', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/storage/presigned-url',
      payload: {
        fileName: 'candidate_photo_1.jpg',
        mimeType: 'image/jpeg',
        folder: 'photos'
      }
    });
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.payload);
    assert.strictEqual(body.success, true);
    assert.ok(body.uploadUrl);
    assert.ok(body.storageKey.startsWith('photos/'));
    assert.ok(body.publicUrl);
  });

  it('handles direct base64 file upload with SHA-256 integrity and MIME validation', async () => {
    // 1. Valid PNG upload
    const mockPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const uploadRes = await app.inject({
      method: 'POST',
      url: '/api/v1/storage/upload',
      payload: {
        fileName: 'selfie.png',
        mimeType: 'image/png',
        fileData: mockPngBase64,
        folder: 'photos'
      }
    });
    assert.strictEqual(uploadRes.statusCode, 201);
    const uploadBody = JSON.parse(uploadRes.payload);
    assert.strictEqual(uploadBody.success, true);
    assert.ok(uploadBody.file.sha256Hash);
    assert.strictEqual(uploadBody.file.mimeType, 'image/png');
    assert.ok(uploadBody.url);

    // 2. Reject unsupported executable file
    const invalidRes = await app.inject({
      method: 'POST',
      url: '/api/v1/storage/upload',
      payload: {
        fileName: 'malicious.exe',
        mimeType: 'application/x-msdownload',
        fileData: 'TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAA...',
        folder: 'photos'
      }
    });
    assert.strictEqual(invalidRes.statusCode, 400);
  });

  it('registers user in persistent database and retrieves persisted profile', async () => {
    // 1. Register persistent user
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/persistence/register',
      payload: {
        phone: '+923007654321',
        email: 'persistent.candidate@wasl.app',
        role: 'CANDIDATE',
        profile: {
          displayName: 'Hamza Malik',
          gender: 'MALE',
          dateOfBirth: '1996-03-20',
          heightCm: 178,
          maritalStatus: 'Single (Never Married)',
          city: 'Lahore',
          country: 'Pakistan',
          education: "Master's from LUMS",
          profession: 'Product Lead @ Tech Corp',
          sect: 'Sunni',
          prayerLevel: 'Always (5x daily)',
          familyStructure: 'Nuclear Family',
          bio: 'Persistent candidate record saved to database.',
          hobbies: ['Tech', 'Cricket', 'Travel'],
          photos: ['https://media.wasl.app/photos/hamza.jpg'],
          isVerified: true
        }
      }
    });
    assert.strictEqual(regRes.statusCode, 201);
    const regBody = JSON.parse(regRes.payload);
    assert.strictEqual(regBody.success, true);
    assert.ok(regBody.user.id);
    const userId = regBody.user.id;

    // 2. Query persistent user
    const getRes = await app.inject({
      method: 'GET',
      url: `/api/v1/persistence/${userId}`
    });
    assert.strictEqual(getRes.statusCode, 200);
    const getBody = JSON.parse(getRes.payload);
    assert.strictEqual(getBody.user.candidateProfile.displayName, 'Hamza Malik');
  });
});
