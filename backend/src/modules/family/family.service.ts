import {
  GuardianRelationType,
  GuardianPermissionKey,
  InviteGuardianInput
} from '@wasl/shared-types';

export interface StoredGuardian {
  id: string;
  candidateId: string;
  guardianUserId?: string;
  invitedPhone: string;
  invitedName: string;
  relationship: GuardianRelationType;
  isInviteAccepted: boolean;
  permissions: Map<GuardianPermissionKey, { isGranted: boolean; grantedAt: Date; revokedAt?: Date }>;
  createdAt: Date;
}

export interface SuggestedMatch {
  id: string;
  guardianId: string;
  candidateId: string;
  targetCandidateId: string;
  note?: string;
  createdAt: Date;
}

export class FamilyService {
  private static guardiansStore = new Map<string, StoredGuardian>();
  private static suggestionsStore: SuggestedMatch[] = [];

  /**
   * Candidate invites a family guardian with scoped permissions
   */
  static async inviteGuardian(candidateId: string, input: InviteGuardianInput): Promise<StoredGuardian> {
    const guardianId = `guardian-${Date.now()}`;
    const permissionsMap = new Map<GuardianPermissionKey, { isGranted: boolean; grantedAt: Date; revokedAt?: Date }>();

    for (const perm of input.permissions) {
      permissionsMap.set(perm, {
        isGranted: true,
        grantedAt: new Date()
      });
    }

    const stored: StoredGuardian = {
      id: guardianId,
      candidateId,
      invitedPhone: input.invitedPhone,
      invitedName: input.invitedName,
      relationship: input.relationship,
      isInviteAccepted: false,
      permissions: permissionsMap,
      createdAt: new Date()
    };

    this.guardiansStore.set(guardianId, stored);
    return stored;
  }

  /**
   * Guardian accepts invitation and binds guardianUserId
   */
  static async acceptInvite(guardianUserId: string, phone: string): Promise<StoredGuardian | null> {
    for (const guardian of this.guardiansStore.values()) {
      if (guardian.invitedPhone === phone) {
        guardian.guardianUserId = guardianUserId;
        guardian.isInviteAccepted = true;
        return guardian;
      }
    }
    return null;
  }

  /**
   * List all guardians for a candidate
   */
  static async getGuardiansForCandidate(candidateId: string): Promise<any[]> {
    const list: any[] = [];
    for (const g of this.guardiansStore.values()) {
      if (g.candidateId === candidateId) {
        const permissions: Record<string, boolean> = {};
        g.permissions.forEach((v, k) => {
          permissions[k] = v.isGranted;
        });
        list.push({
          id: g.id,
          candidateId: g.candidateId,
          invitedName: g.invitedName,
          invitedPhone: g.invitedPhone,
          relationship: g.relationship,
          isInviteAccepted: g.isInviteAccepted,
          guardianUserId: g.guardianUserId,
          permissions
        });
      }
    }
    return list;
  }

  /**
   * Immediate revocation or update of a guardian permission by candidate
   */
  static async updatePermission(
    candidateId: string,
    guardianId: string,
    permissionName: GuardianPermissionKey,
    isGranted: boolean
  ): Promise<StoredGuardian> {
    const guardian = this.guardiansStore.get(guardianId);
    if (!guardian || guardian.candidateId !== candidateId) {
      throw new Error('Guardian record not found or not owned by candidate');
    }

    const existing = guardian.permissions.get(permissionName);
    if (existing) {
      existing.isGranted = isGranted;
      if (!isGranted) {
        existing.revokedAt = new Date();
      } else {
        existing.revokedAt = undefined;
      }
    } else {
      guardian.permissions.set(permissionName, {
        isGranted,
        grantedAt: new Date(),
        revokedAt: isGranted ? undefined : new Date()
      });
    }

    return guardian;
  }

  /**
   * Check if a guardian user holds a specific active permission for a candidate
   */
  static hasPermission(guardianUserId: string, candidateId: string, permission: GuardianPermissionKey): boolean {
    for (const g of this.guardiansStore.values()) {
      if (g.guardianUserId === guardianUserId && g.candidateId === candidateId && g.isInviteAccepted) {
        const p = g.permissions.get(permission);
        return !!p && p.isGranted;
      }
    }
    return false;
  }

  /**
   * Guardian suggests a match to the candidate's proposal inbox
   */
  static async suggestMatch(
    guardianUserId: string,
    candidateId: string,
    targetCandidateId: string,
    note?: string
  ): Promise<SuggestedMatch> {
    const hasSuggest = this.hasPermission(guardianUserId, candidateId, GuardianPermissionKey.SUGGEST_MATCHES);
    if (!hasSuggest) {
      throw new Error('Guardian does not have suggest_matches permission');
    }

    const suggestion: SuggestedMatch = {
      id: `sug-${Date.now()}`,
      guardianId: guardianUserId,
      candidateId,
      targetCandidateId,
      note,
      createdAt: new Date()
    };

    this.suggestionsStore.push(suggestion);
    return suggestion;
  }

  /**
   * Get suggestions for candidate
   */
  static async getSuggestionsForCandidate(candidateId: string): Promise<SuggestedMatch[]> {
    return this.suggestionsStore.filter(s => s.candidateId === candidateId);
  }
}
