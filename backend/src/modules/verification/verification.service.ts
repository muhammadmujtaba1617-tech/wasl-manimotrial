import { BadgeType, BadgeStatusType, VerificationBadge } from '@wasl/shared-types';

export interface StoredKycDocument {
  id: string;
  candidateId: string;
  documentType: string;
  encryptedFilePath: string;
  status: BadgeStatusType;
  submittedAt: Date;
  metadata?: Record<string, any>;
}

export class VerificationService {
  private static badgesStore = new Map<string, Map<BadgeType, VerificationBadge>>();
  private static kycQueue: StoredKycDocument[] = [];

  static async getBadgesForCandidate(candidateId: string): Promise<VerificationBadge[]> {
    const map = this.badgesStore.get(candidateId);
    if (!map) return [];
    return Array.from(map.values());
  }

  static async issueOrUpdateBadge(
    candidateId: string,
    badgeType: BadgeType,
    status: BadgeStatusType,
    metadata?: Record<string, any>
  ): Promise<VerificationBadge> {
    let map = this.badgesStore.get(candidateId);
    if (!map) {
      map = new Map<BadgeType, VerificationBadge>();
      this.badgesStore.set(candidateId, map);
    }

    const badge: VerificationBadge = {
      id: `badge-${candidateId}-${badgeType}`,
      candidateId,
      badgeType,
      status,
      verifiedAt: status === BadgeStatusType.VERIFIED ? new Date().toISOString() : null,
      verificationMetadata: metadata
    };

    map.set(badgeType, badge);
    return badge;
  }

  static async submitDocumentForReview(
    candidateId: string,
    documentType: string,
    encryptedFilePath: string,
    metadata?: Record<string, any>
  ): Promise<StoredKycDocument> {
    const doc: StoredKycDocument = {
      id: `doc-${Date.now()}`,
      candidateId,
      documentType,
      encryptedFilePath,
      status: BadgeStatusType.PENDING,
      submittedAt: new Date(),
      metadata
    };

    this.kycQueue.push(doc);

    // Map doc type to badge type
    let badgeType = BadgeType.CNIC_IDENTITY;
    if (documentType.includes('DEGREE')) badgeType = BadgeType.EDUCATION;
    if (documentType.includes('SALARY') || documentType.includes('EMPLOYMENT')) badgeType = BadgeType.EMPLOYMENT;

    await this.issueOrUpdateBadge(candidateId, badgeType, BadgeStatusType.PENDING);
    return doc;
  }

  static async getKycQueue(): Promise<StoredKycDocument[]> {
    return this.kycQueue.filter(doc => doc.status === BadgeStatusType.PENDING);
  }

  static async reviewDocument(
    docId: string,
    decision: 'APPROVE' | 'REJECT',
    moderatorId: string,
    notes?: string
  ): Promise<StoredKycDocument> {
    const doc = this.kycQueue.find(d => d.id === docId);
    if (!doc) {
      throw new Error('KYC document submission not found');
    }

    doc.status = decision === 'APPROVE' ? BadgeStatusType.VERIFIED : BadgeStatusType.REJECTED;

    let badgeType = BadgeType.CNIC_IDENTITY;
    if (doc.documentType.includes('DEGREE')) badgeType = BadgeType.EDUCATION;
    if (doc.documentType.includes('SALARY') || doc.documentType.includes('EMPLOYMENT')) badgeType = BadgeType.EMPLOYMENT;

    await this.issueOrUpdateBadge(doc.candidateId, badgeType, doc.status, {
      moderatorId,
      notes,
      reviewedAt: new Date().toISOString()
    });

    return doc;
  }
}
