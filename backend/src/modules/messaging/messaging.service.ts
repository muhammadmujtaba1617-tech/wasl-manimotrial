import { UserRole, GuardianPermissionKey } from '@wasl/shared-types';
import { FamilyService } from '../family/family.service.js';
import { ProposalStoreService } from '../proposals/proposal.store.js';

export interface StoredThread {
  id: string;
  proposalId: string;
  isChaperoned: boolean;
  activeChaperoneUserIds: string[];
  isLocked: boolean;
  createdAt: Date;
}

export interface StoredMessage {
  id: string;
  threadId: string;
  senderId: string;
  messageText: string;
  isFlaggedByAutomod: boolean;
  automodFlagReason?: string;
  createdAt: Date;
}

export class MessagingService {
  private static threads = new Map<string, StoredThread>();
  private static messages: StoredMessage[] = [];

  /**
   * Phone, WhatsApp, and External Link pattern filters for auto-moderation
   */
  private static PII_PATTERNS = [
    { regex: /(?:\+?92|0)?3\d{2}[-.\s]?\d{7}/g, reason: 'PAK_PHONE_NUMBER' },
    { regex: /(?:whatsapp|wa\.me|insta|snapchat|telegram)/gi, reason: 'EXTERNAL_SOCIAL_HANDLE' },
    { regex: /(?:https?:\/\/|www\.)[^\s]+/gi, reason: 'EXTERNAL_WEB_LINK' },
    { regex: /(?:jazzcash|easypaisa|bank|iban|account\s+no)/gi, reason: 'PAYMENT_CONTACT_KEYWORD' }
  ];

  static scanMessageForFlags(text: string): { flagged: boolean; reason?: string } {
    for (const { regex, reason } of this.PII_PATTERNS) {
      if (regex.test(text)) {
        return { flagged: true, reason };
      }
    }
    return { flagged: false };
  }

  static async getOrCreateThread(proposalId: string): Promise<StoredThread> {
    for (const t of this.threads.values()) {
      if (t.proposalId === proposalId) return t;
    }

    const threadId = `thread-${proposalId}`;
    const thread: StoredThread = {
      id: threadId,
      proposalId,
      isChaperoned: false,
      activeChaperoneUserIds: [],
      isLocked: false,
      createdAt: new Date()
    };

    this.threads.set(threadId, thread);
    return thread;
  }

  static async getThreadById(threadId: string): Promise<StoredThread | null> {
    return this.threads.get(threadId) || null;
  }

  static async canAccessThread(userId: string, role: UserRole, thread: StoredThread): Promise<boolean> {
    const proposal = await ProposalStoreService.getProposal(thread.proposalId);
    if (!proposal) return false;

    // Direct candidate participant check
    if (role === UserRole.CANDIDATE) {
      return true;
    }

    // Guardian chaperone check
    if (role === UserRole.GUARDIAN) {
      const hasChaperoneA = FamilyService.hasPermission(userId, proposal.initiatorCandidateId, GuardianPermissionKey.CHAPERONE_CHAT);
      const hasChaperoneB = FamilyService.hasPermission(userId, proposal.recipientCandidateId, GuardianPermissionKey.CHAPERONE_CHAT);
      return hasChaperoneA || hasChaperoneB;
    }

    if (role === UserRole.ADMIN || role === UserRole.MODERATOR) {
      return true;
    }

    return false;
  }

  static async sendMessage(
    threadId: string,
    senderId: string,
    text: string
  ): Promise<StoredMessage> {
    const thread = this.threads.get(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }

    if (thread.isLocked) {
      throw new Error('Thread is locked');
    }

    const modResult = this.scanMessageForFlags(text);

    const message: StoredMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId,
      messageText: text,
      isFlaggedByAutomod: modResult.flagged,
      automodFlagReason: modResult.reason,
      createdAt: new Date()
    };

    this.messages.push(message);
    return message;
  }

  static async getMessagesForThread(threadId: string): Promise<StoredMessage[]> {
    return this.messages.filter(m => m.threadId === threadId);
  }
}
