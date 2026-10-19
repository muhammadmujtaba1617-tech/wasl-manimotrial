import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { api, MobileCandidate } from '../config/api.js';

interface DiscoveryFeedScreenProps {
  onSelectCandidate: (candidate: MobileCandidate) => void;
  onOpenChat: (candidateName: string) => void;
}

export const DiscoveryFeedScreen: React.FC<DiscoveryFeedScreenProps> = ({ onSelectCandidate, onOpenChat }) => {
  const [candidates, setCandidates] = useState<MobileCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [blurStates, setBlurStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    const list = await api.getDiscoveryRecommendations();
    setCandidates(list);
    const initialBlurs: Record<string, boolean> = {};
    list.forEach(c => { initialBlurs[c.id] = c.isPhotoBlurred; });
    setBlurStates(initialBlurs);
    setLoading(false);
  };

  const toggleBlur = (id: string) => {
    setBlurStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#064E3B" />
        <Text style={styles.loadingText}>Running 100-pt compatibility engine...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topHeader}>
        <Text style={styles.screenTitle}>Verified Discoveries</Text>
        <Text style={styles.screenSubtitle}>Ranked by deterministic 6-dimension compatibility</Text>
      </View>

      {candidates.map((cand) => {
        const isBlurred = blurStates[cand.id] ?? true;

        return (
          <View key={cand.id} style={styles.card}>
            {/* Photo & Privacy Canvas */}
            <View style={styles.photoContainer}>
              <View style={[styles.photoBox, isBlurred && styles.photoBlurred]}>
                <Text style={styles.avatarInitial}>{cand.firstName[0]}</Text>
                {isBlurred && (
                  <View style={styles.watermarkOverlay}>
                    <Text style={styles.watermarkText}>🛡️ PROTECTED • VIEWED BY {api.getSession()?.phone || 'USER'}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.blurToggleButton} onPress={() => toggleBlur(cand.id)}>
                <Text style={styles.blurToggleText}>{isBlurred ? '👁️ Reveal Photo' : '🔒 Hide Photo'}</Text>
              </TouchableOpacity>
            </View>

            {/* Candidate Header & Score */}
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.candName}>{cand.firstName}, {cand.age}</Text>
                <Text style={styles.candSubtitle}>{cand.profession} • {cand.city}</Text>
              </View>

              <View style={styles.scoreBadge}>
                <Text style={styles.scoreValue}>{cand.score}</Text>
                <Text style={styles.scoreLabel}>MATCH</Text>
              </View>
            </View>

            {/* Verification Badges */}
            <View style={styles.badgeRow}>
              {cand.badges.map((b) => (
                <View key={b} style={styles.badgePill}>
                  <Text style={styles.badgePillText}>✓ {b.replace(/_/g, ' ')}</Text>
                </View>
              ))}
            </View>

            {/* Demographics Summary */}
            <View style={styles.demographicsGrid}>
              <View style={styles.demoItem}>
                <Text style={styles.demoLabel}>Education</Text>
                <Text style={styles.demoValue}>{cand.education}</Text>
              </View>
              <View style={styles.demoItem}>
                <Text style={styles.demoLabel}>Sect / Cast</Text>
                <Text style={styles.demoValue}>{cand.sect} {cand.cast ? `(${cand.cast})` : ''}</Text>
              </View>
            </View>

            {/* Explainable AI summary */}
            {cand.explanations && (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>💡 Compatibility Insight</Text>
                <Text style={styles.explanationText}>{cand.explanations.summary}</Text>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.breakdownBtn} onPress={() => onSelectCandidate(cand)}>
                <Text style={styles.breakdownBtnText}>6D Breakdown</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatBtn} onPress={() => onOpenChat(cand.firstName)}>
                <Text style={styles.chatBtnText}>Supervised Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  loadingText: { marginTop: 12, color: '#4B5563', fontSize: 14 },
  topHeader: { marginBottom: 16 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  screenSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  photoContainer: { position: 'relative', marginBottom: 14 },
  photoBox: { height: 180, backgroundColor: '#E5E7EB', borderRadius: 12, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  photoBlurred: { backgroundColor: '#9CA3AF' },
  avatarInitial: { fontSize: 64, fontWeight: 'bold', color: '#D1D5DB' },
  watermarkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' },
  watermarkText: { color: '#F3F4F6', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  blurToggleButton: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  blurToggleText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  candName: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  candSubtitle: { fontSize: 14, color: '#4B5563', marginTop: 2 },
  scoreBadge: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignItems: 'center' },
  scoreValue: { fontSize: 18, fontWeight: 'bold', color: '#064E3B' },
  scoreLabel: { fontSize: 9, fontWeight: '700', color: '#047857' },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  badgePill: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgePillText: { color: '#1D4ED8', fontSize: 11, fontWeight: '600' },
  demographicsGrid: { flexDirection: 'row', backgroundColor: '#F9FAFB', padding: 10, borderRadius: 8, marginBottom: 12 },
  demoItem: { flex: 1 },
  demoLabel: { fontSize: 11, color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' },
  demoValue: { fontSize: 13, color: '#1F2937', fontWeight: '500', marginTop: 2 },
  explanationBox: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 14 },
  explanationTitle: { fontSize: 12, fontWeight: 'bold', color: '#166534', marginBottom: 2 },
  explanationText: { fontSize: 12, color: '#14532D', lineHeight: 16 },
  actionRow: { flexDirection: 'row', gap: 10 },
  breakdownBtn: { flex: 1, borderWidth: 1, borderColor: '#064E3B', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  breakdownBtnText: { color: '#064E3B', fontWeight: 'bold', fontSize: 14 },
  chatBtn: { flex: 1, backgroundColor: '#064E3B', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  chatBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }
});
