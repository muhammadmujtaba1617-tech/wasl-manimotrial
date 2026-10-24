'use client';

export type MatchStatus = 'NOT_CONNECTED' | 'SENT_PENDING' | 'RECEIVED_PENDING' | 'MUTUAL_MATCH';

export interface CandidateMatchState {
  id: string;
  status: MatchStatus;
  updatedAt?: string;
}

const DEFAULT_MATCH_STATES: Record<string, MatchStatus> = {
  'cand-female-1': 'MUTUAL_MATCH',
  'cand-female-2': 'RECEIVED_PENDING',
  'cand-female-4': 'RECEIVED_PENDING',
  'cand-male-1': 'SENT_PENDING'
};

const STORAGE_KEY = 'wasl_match_states_v1';

export function getMatchStates(): Record<string, MatchStatus> {
  if (typeof window === 'undefined') return DEFAULT_MATCH_STATES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load match states:', e);
  }
  return DEFAULT_MATCH_STATES;
}

export function getCandidateMatchStatus(candidateId: string): MatchStatus {
  const states = getMatchStates();
  return states[candidateId] || 'NOT_CONNECTED';
}

export function setCandidateMatchStatus(candidateId: string, status: MatchStatus): Record<string, MatchStatus> {
  if (typeof window === 'undefined') return DEFAULT_MATCH_STATES;
  try {
    const current = getMatchStates();
    const updated = { ...current, [candidateId]: status };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch a custom event so other components on the page update instantly
    window.dispatchEvent(new Event('wasl_match_state_updated'));
    return updated;
  } catch (e) {
    console.error('Failed to save match status:', e);
    return DEFAULT_MATCH_STATES;
  }
}
