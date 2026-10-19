import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ProposalStatus } from '@wasl/shared-types';

interface ProposalItem {
  id: string;
  candidateName: string;
  age: number;
  city: string;
  profession: string;
  compatibilityScore: number;
  stage: ProposalStatus;
  lastUpdated: string;
}

export const ProposalsScreen: React.FC<{ onOpenChat: (name: string) => void }> = ({ onOpenChat }) => {
  const [proposals, setProposals] = useState<ProposalItem[]>([
    {
      id: 'prop_001',
      candidateName: 'Zara Khan',
      age: 26,
      city: 'Lahore',
      profession: 'Software Engineer',
      compatibilityScore: 94,
      stage: ProposalStatus.INTRODUCTION_REQUESTED,
      lastUpdated: 'Today at 2:30 PM'
    },
    {
      id: 'prop_002',
      candidateName: 'Ayesha Malik',
      age: 25,
      city: 'Islamabad',
      profession: 'Doctor',
      compatibilityScore: 89,
      stage: ProposalStatus.SUPERVISED_CHAT,
      lastUpdated: 'Yesterday'
    }
  ]);

  const advanceStage = (id: string, currentStage: ProposalStatus) => {
    let nextStage: ProposalStatus = currentStage;
    if (currentStage === ProposalStatus.INTRODUCTION_REQUESTED) {
      nextStage = ProposalStatus.SUPERVISED_CHAT;
    } else if (currentStage === ProposalStatus.SUPERVISED_CHAT) {
      nextStage = ProposalStatus.FAMILY_MEETING;
    } else if (currentStage === ProposalStatus.FAMILY_MEETING) {
      nextStage = ProposalStatus.ENGAGED;
    }

    setProposals(prev => prev.map(p => (p.id === id ? { ...p, stage: nextStage, lastUpdated: 'Just now' } : p)));
    Alert.alert('Stage Advanced', `Proposal moved to ${nextStage.replace(/_/g, ' ')}`);
  };

  const getStageBadgeColor = (stage: ProposalStatus) => {
    switch (stage) {
      case ProposalStatus.ENGAGED: return '#059669';
      case ProposalStatus.SUPERVISED_CHAT: return '#2563EB';
      case ProposalStatus.FAMILY_MEETING: return '#D97706';
      default: return '#4B5563';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Proposal Funnel</Text>
        <Text style={styles.subtitle}>8-Stage Structured Matrimonial Progression</Text>
      </View>

      {proposals.map((prop) => (
        <View key={prop.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.candName}>{prop.candidateName}</Text>
              <Text style={styles.candDetail}>{prop.profession} • {prop.city}</Text>
            </View>
            <View style={[styles.stageBadge, { backgroundColor: getStageBadgeColor(prop.stage) }]}>
              <Text style={styles.stageText}>{prop.stage.replace(/_/g, ' ')}</Text>
            </View>
          </View>

          {/* Stepper overview */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepDotActive} />
            <View style={styles.stepLineActive} />
            <View style={styles.stepDotActive} />
            <View style={styles.stepLineActive} />
            <View style={styles.stepDotActive} />
            <View style={styles.stepLineInactive} />
            <View style={styles.stepDotInactive} />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.timestamp}>Updated {prop.lastUpdated}</Text>
            <Text style={styles.scoreText}>Match: {prop.compatibilityScore}%</Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {prop.stage === ProposalStatus.SUPERVISED_CHAT && (
              <TouchableOpacity style={styles.chatActionBtn} onPress={() => onOpenChat(prop.candidateName)}>
                <Text style={styles.chatActionText}>Open Chaperone Chat</Text>
              </TouchableOpacity>
            )}

            {prop.stage !== ProposalStatus.ENGAGED && (
              <TouchableOpacity style={styles.advanceBtn} onPress={() => advanceStage(prop.id, prop.stage)}>
                <Text style={styles.advanceBtnText}>Advance to Next Stage →</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  candName: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  candDetail: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  stageBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  stageText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  stepDotActive: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#059669' },
  stepDotInactive: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#D1D5DB' },
  stepLineActive: { flex: 1, height: 2, backgroundColor: '#059669' },
  stepLineInactive: { flex: 1, height: 2, backgroundColor: '#D1D5DB' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  timestamp: { fontSize: 12, color: '#9CA3AF' },
  scoreText: { fontSize: 12, fontWeight: 'bold', color: '#064E3B' },
  actions: { flexDirection: 'row', gap: 8 },
  chatActionBtn: { flex: 1, backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  chatActionText: { color: '#1D4ED8', fontWeight: 'bold', fontSize: 13 },
  advanceBtn: { flex: 1, backgroundColor: '#064E3B', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  advanceBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 }
});
