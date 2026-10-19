import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Alert } from 'react-native';
import { api } from '../config/api.js';

export const ProfileScreen: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const session = api.getSession();
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const badges = [
    { title: 'Phone Verified', desc: session?.phone || '03001234567', verified: true, icon: '📱' },
    { title: 'CNIC Identity Verified', desc: 'NADRA Verisys Record 35202-*******-1', verified: true, icon: '🪪' },
    { title: 'Higher Education Verified', desc: 'HEC Verified BS Computer Science', verified: true, icon: '🎓' },
    { title: 'Wali / Family Linked', desc: 'Active Wali Chaperone Supervision', verified: true, icon: '👨‍👩‍👦' }
  ];

  const handleUploadKyc = () => {
    Alert.alert('KYC Document Uploader', 'Select CNIC or Degree scan to submit for Trust & Safety review.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>Z</Text>
        </View>
        <Text style={styles.userName}>Zara Khan</Text>
        <Text style={styles.userRole}>{session?.role || 'CANDIDATE'} • Lahore, Pakistan</Text>
      </View>

      {/* Trust & Badges */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VERIFIED TRUST BADGES</Text>
        {badges.map((b) => (
          <View key={b.title} style={styles.badgeItem}>
            <Text style={styles.badgeIcon}>{b.icon}</Text>
            <View style={styles.badgeInfo}>
              <Text style={styles.badgeTitle}>{b.title}</Text>
              <Text style={styles.badgeDesc}>{b.desc}</Text>
            </View>
            <View style={styles.checkPill}>
              <Text style={styles.checkText}>✓ VERIFIED</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.kycBtn} onPress={handleUploadKyc}>
          <Text style={styles.kycBtnText}>+ Submit Additional Document for KYC Review</Text>
        </TouchableOpacity>
      </View>

      {/* Security & App Lock */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SECURITY & PRIVACY</Text>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Biometric App Lock (FaceID / Fingerprint)</Text>
            <Text style={styles.settingSub}>Require biometric verification on app open</Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ true: '#059669', false: '#D1D5DB' }}
          />
        </View>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Photo Anti-Screenshot Watermark</Text>
            <Text style={styles.settingSub}>Active viewer phone watermark on photos</Text>
          </View>
          <Switch value={true} disabled trackColor={{ true: '#059669', false: '#D1D5DB' }} />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutBtnText}>Sign Out of Wasl</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', marginVertical: 20 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#064E3B', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  userRole: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  section: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#6B7280', letterSpacing: 0.5, marginBottom: 14 },
  badgeItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  badgeIcon: { fontSize: 24, marginRight: 12 },
  badgeInfo: { flex: 1 },
  badgeTitle: { fontSize: 14, fontWeight: 'bold', color: '#1F2937' },
  badgeDesc: { fontSize: 12, color: '#6B7280', marginTop: 1 },
  checkPill: { backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  checkText: { fontSize: 10, fontWeight: 'bold', color: '#047857' },
  kycBtn: { marginTop: 14, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: '#064E3B', borderRadius: 8 },
  kycBtnText: { color: '#064E3B', fontSize: 13, fontWeight: 'bold' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  settingLabel: { fontSize: 13, fontWeight: '600', color: '#1F2937' },
  settingSub: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  logoutBtn: { backgroundColor: '#FEE2E2', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  logoutBtnText: { color: '#DC2626', fontSize: 14, fontWeight: 'bold' }
});
