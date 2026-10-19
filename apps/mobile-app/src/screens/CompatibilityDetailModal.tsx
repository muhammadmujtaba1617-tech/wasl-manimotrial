import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { MobileCandidate } from '../config/api.js';

interface CompatibilityDetailModalProps {
  candidate: MobileCandidate;
  onClose: () => void;
}

export const CompatibilityDetailModal: React.FC<CompatibilityDetailModalProps> = ({ candidate, onClose }) => {
  const dimensions = [
    { label: 'Location & Relocation', score: 20, max: 20, reason: 'Both primary residence in Lahore with aligned relocation outlook.' },
    { label: 'Family Dynamics & Structure', score: 18, max: 20, reason: 'Nuclear family preference and aligned elder care values.' },
    { label: 'Career & Financial Goals', score: 19, max: 20, reason: 'Professional career trajectories with mutual growth support.' },
    { label: 'Religious Practice', score: 14, max: 15, reason: 'Aligned Sunni practice and prayer frequency.' },
    { label: 'Education Standards', score: 14, max: 15, reason: 'LUMS BS CS and equivalent postgraduate aspirations.' },
    { label: 'Lifestyle & Hobbies', score: 9, max: 10, reason: 'Shared fitness, reading, and non-smoking preferences.' }
  ];

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Compatibility Breakdown</Text>
            <Text style={styles.subtitle}>with {candidate.firstName} ({candidate.score}/100 Match)</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
          {/* Dimension Progress Bars */}
          <Text style={styles.sectionHeader}>6-DIMENSION BREAKDOWN</Text>
          {dimensions.map((dim) => {
            const percentage = Math.round((dim.score / dim.max) * 100);

            return (
              <View key={dim.label} style={styles.dimRow}>
                <View style={styles.dimHeader}>
                  <Text style={styles.dimLabel}>{dim.label}</Text>
                  <Text style={styles.dimScore}>{dim.score}/{dim.max}</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.dimReason}>{dim.reason}</Text>
              </View>
            );
          })}

          {/* Key Alignments */}
          {candidate.explanations && (
            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>✨ Key Alignments</Text>
              {candidate.explanations.keyAlignments.map((a, i) => (
                <Text key={i} style={styles.bulletItem}>• {a}</Text>
              ))}

              <Text style={[styles.insightTitle, { marginTop: 14 }]}>💬 Discussion Topics</Text>
              {candidate.explanations.potentialDiscussionTopics.map((t, i) => (
                <Text key={i} style={styles.bulletItem}>• {t}</Text>
              ))}
            </View>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end', zIndex: 100 },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '88%', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 13, color: '#064E3B', fontWeight: '600', marginTop: 2 },
  closeBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
  closeBtnText: { fontSize: 16, color: '#4B5563', fontWeight: 'bold' },
  scrollBody: { marginBottom: 10 },
  sectionHeader: { fontSize: 11, fontWeight: 'bold', color: '#6B7280', letterSpacing: 1, marginBottom: 12 },
  dimRow: { marginBottom: 16 },
  dimHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  dimLabel: { fontSize: 13, fontWeight: '600', color: '#1F2937' },
  dimScore: { fontSize: 13, fontWeight: 'bold', color: '#064E3B' },
  progressBarBg: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: 8, backgroundColor: '#059669', borderRadius: 4 },
  dimReason: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  insightCard: { backgroundColor: '#F9FAFB', padding: 14, borderRadius: 12, marginTop: 10 },
  insightTitle: { fontSize: 13, fontWeight: 'bold', color: '#111827', marginBottom: 6 },
  bulletItem: { fontSize: 12, color: '#374151', lineHeight: 18, marginBottom: 2 }
});
