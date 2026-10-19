export interface UserReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedCandidateId: string;
  reportedCandidateName: string;
  category:
    | 'INAPPROPRIATE_CONDUCT'
    | 'MISREPRESENTED_DETAILS'
    | 'SUSPICIOUS_COMMERCIAL'
    | 'HARASSMENT'
    | 'FAKE_PROFILE';
  reason: string;
  details?: string;
  status: 'PENDING_REVIEW' | 'WARNED' | 'BANNED' | 'DISMISSED';
  createdAt: string;
}

class SafetyService {
  private blockedUsersMap: Map<string, Set<string>> = new Map();
  private incognitoSettings: Map<string, boolean> = new Map();
  private reports: UserReport[] = [
    {
      id: 'rep-1',
      reporterId: 'cand-female-1',
      reporterName: 'Fatima Zahra',
      reportedCandidateId: 'cand-male-suspicious-9',
      reportedCandidateName: 'Kamran Ali (Unverified)',
      category: 'SUSPICIOUS_COMMERCIAL',
      reason: 'Commercial Matchmaking Agent soliciting off-platform broker commission',
      details: 'Sent unprompted message asking for PKR 50,000 upfront registration fee.',
      status: 'PENDING_REVIEW',
      createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
    }
  ];

  blockUser(userId: string, targetCandidateId: string): void {
    if (!this.blockedUsersMap.has(userId)) {
      this.blockedUsersMap.set(userId, new Set());
    }
    this.blockedUsersMap.get(userId)!.add(targetCandidateId);

    // Two-way block mutual isolation
    if (!this.blockedUsersMap.has(targetCandidateId)) {
      this.blockedUsersMap.set(targetCandidateId, new Set());
    }
    this.blockedUsersMap.get(targetCandidateId)!.add(userId);
  }

  unblockUser(userId: string, targetCandidateId: string): void {
    if (this.blockedUsersMap.has(userId)) {
      this.blockedUsersMap.get(userId)!.delete(targetCandidateId);
    }
    if (this.blockedUsersMap.has(targetCandidateId)) {
      this.blockedUsersMap.get(targetCandidateId)!.delete(userId);
    }
  }

  getBlockedUsers(userId: string): string[] {
    return Array.from(this.blockedUsersMap.get(userId) || []);
  }

  isBlocked(userA: string, userB: string): boolean {
    return (
      (this.blockedUsersMap.get(userA)?.has(userB) ?? false) ||
      (this.blockedUsersMap.get(userB)?.has(userA) ?? false)
    );
  }

  createReport(data: Omit<UserReport, 'id' | 'createdAt' | 'status'>): UserReport {
    const report: UserReport = {
      id: `rep-${Date.now()}`,
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
      ...data
    };
    this.reports.unshift(report);
    return report;
  }

  getAllReports(): UserReport[] {
    return this.reports;
  }

  updateReportStatus(
    reportId: string,
    status: UserReport['status']
  ): UserReport | null {
    const report = this.reports.find((r) => r.id === reportId);
    if (report) {
      report.status = status;
      return report;
    }
    return null;
  }

  setIncognitoMode(userId: string, enabled: boolean): void {
    this.incognitoSettings.set(userId, enabled);
  }

  getIncognitoMode(userId: string): boolean {
    return this.incognitoSettings.get(userId) || false;
  }
}

export const safetyService = new SafetyService();
