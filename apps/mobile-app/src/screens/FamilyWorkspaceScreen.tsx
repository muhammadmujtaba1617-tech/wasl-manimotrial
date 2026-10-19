import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, StyleSheet, Alert } from 'react-native';

interface Guardian {
  id: string;
  name: string;
  relation: string;
  phone: string;
  status: 'ACTIVE' | 'INVITED' | 'REVOKED';
  permissions: {
    viewProfiles: boolean;
    suggestMatches: boolean;
    chaperoneChat: boolean;
  };
}

export const FamilyWorkspaceScreen: React.FC = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([
    {
      id: 'guard_001',
      name: 'Tariq Khan (Father)',
      relation: 'Father / Wali',
      phone: '03009876543',
      status: 'ACTIVE',
      permissions: {
        viewProfiles: true,
        suggestMatches: true,
        chaperoneChat: true
      }
    }
  ]);

  const [invitePhone, setInvitePhone] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const togglePermission = (id: string, perm: keyof Guardian['permissions']) => {
    setGuardians(prev =>
      prev.map(g =>
        g.id === id
          ? { ...g, permissions: { ...g.permissions, [perm]: !g.permissions[perm] } }
          : g
      )
    );
  };

  const revokeGuardian = (id: string, name: string) => {
    Alert.alert(
      'Revoke Guardian Access?',
      `Are you sure you want to immediately revoke all permissions for ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke Immediately',
          style: 'destructive',
          onPress: () => {
            setGuardians(prev => prev.map(g => (g.id === id ? { ...g, status: 'REVOKED' } : g)));
            Alert.alert('Access Revoked', `${name}'s access has been terminated.`);
          }
        }
      ]
    );
  };

  const handleSendInvite = () => {
    if (!invitePhone || !inviteName) {
      Alert.alert('Missing Fields', 'Please enter Guardian name and Pakistani phone number.');
      return;
    }
    const newG: Guardian = {
      id: `guard_${Date.now()}`,
      name: inviteName,
      relation: 'Guardian',
      phone: invitePhone,
      status: 'INVITED',
      permissions: {
        viewProfiles: true,
        suggestMatches: true,
        chaperoneChat: false
      }
    };
    setGuardians(prev => [...prev, newG]);
    setShowInviteModal(false);
    setInviteName('');
    setInvitePhone('');
    Alert.alert('Invite Sent', `SMS invitation sent to ${invitePhone} via Wasl SMS rail.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Family Workspace</Text>
          <Text style={styles.subtitle}>Structured Wali & Family Chaperone Oversight</Text>
        </View>
        <TouchableOpacity style={styles.inviteBtn} onPress={() => setShowInviteModal(true)}>
          <Text style={styles.inviteBtnText}>+ Invite Wali</Text>
        </TouchableOpacity>
      </View>

      {/* Invite Modal */}
      {showInviteModal && (
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Invite Guardian / Wali</Text>
          <TextInput
            style={styles.modalInput}
            value={inviteName}
            onChangeText={setInviteName}
            placeholder="Full Name (e.g. Tariq Khan)"
          />
          <TextInput
            style={styles.modalInput}
            value={invitePhone}
            onChangeText={setInvitePhone}
            placeholder="Mobile Number (03001234567)"
            keyboardType="phone-pad"
          />
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowInviteModal(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmInviteBtn} onPress={handleSendInvite}>
              <Text style={styles.confirmInviteBtnText}>Send SMS Invite</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Guardians List */}
      {guardians.map((g) => (
        <View key={g.id} style={styles.guardianCard}>
          <View style={styles.guardianHeader}>
            <View>
              <Text style={styles.guardianName}>{g.name}</Text>
              <Text style={styles.guardianPhone}>{g.phone} • {g.relation}</Text>
            </View>
            <View style={[styles.statusBadge, g.status === 'ACTIVE' ? styles.statusActive : styles.statusRevoked]}>
              <Text style={styles.statusText}>{g.status}</Text>
            </View>
          </View>

          {g.status === 'ACTIVE' ? (
            <View style={styles.permList}>
              <Text style={styles.permTitle}>SCOPED PERMISSIONS</Text>
              
              <View style={styles.permRow}>
                <Text style={styles.permLabel}>View Recommended Profiles</Text>
                <Switch
                  value={g.permissions.viewProfiles}
                  onValueChange={() => togglePermission(g.id, 'viewProfiles')}
                  trackColor={{ true: '#059669', false: '#D1D5DB' }}
                />
              </View>

              <View style={styles.permRow}>
                <Text style={styles.permLabel}>Suggest Matches to Candidate</Text>
                <Switch
                  value={g.permissions.suggestMatches}
                  onValueChange={() => togglePermission(g.id, 'suggestMatches')}
                  trackColor={{ true: '#059669', false: '#D1D5DB' }}
                />
              </View>

              <View style={styles.permRow}>
                <Text style={styles.permLabel}>Chaperone Supervised Chat</Text>
                <Switch
                  value={g.permissions.chaperoneChat}
                  onValueChange={() => togglePermission(g.id, 'chaperoneChat')}
                  trackColor={{ true: '#059669', false: '#D1D5DB' }}
                />
              </View>

              <TouchableOpacity style={styles.revokeBtn} onPress={() => revokeGuardian(g.id, g.name)}>
                <Text style={styles.revokeBtnText}>Revoke Access Immediately</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.revokedNotice}>This guardian currently has no access to your profile or proposals.</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  inviteBtn: { backgroundColor: '#064E3B', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  inviteBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#A7F3D0' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#064E3B', marginBottom: 10 },
  modalInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  cancelBtnText: { color: '#6B7280', fontWeight: '600' },
  confirmInviteBtn: { backgroundColor: '#064E3B', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  confirmInviteBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  guardianCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  guardianHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  guardianName: { fontSize: 17, fontWeight: 'bold', color: '#111827' },
  guardianPhone: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusActive: { backgroundColor: '#ECFDF5' },
  statusRevoked: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 11, fontWeight: 'bold', color: '#064E3B' },
  permList: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12 },
  permTitle: { fontSize: 11, fontWeight: 'bold', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 8 },
  permRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  permLabel: { fontSize: 13, color: '#374151' },
  revokeBtn: { marginTop: 12, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 6 },
  revokeBtnText: { color: '#DC2626', fontSize: 12, fontWeight: 'bold' },
  revokedNotice: { fontSize: 12, color: '#9CA3AF', fontStyle: 'italic', marginTop: 8 }
});
