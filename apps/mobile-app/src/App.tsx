import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { AuthScreen } from './screens/AuthScreen.js';
import { DiscoveryFeedScreen } from './screens/DiscoveryFeedScreen.js';
import { CompatibilityDetailModal } from './screens/CompatibilityDetailModal.js';
import { ProposalsScreen } from './screens/ProposalsScreen.js';
import { FamilyWorkspaceScreen } from './screens/FamilyWorkspaceScreen.js';
import { SupervisedChatScreen } from './screens/SupervisedChatScreen.js';
import { ProfileScreen } from './screens/ProfileScreen.js';
import { api, AuthSession, MobileCandidate } from './config/api.js';

type TabType = 'DISCOVERY' | 'PROPOSALS' | 'FAMILY' | 'PROFILE';

export function App() {
  const [session, setSession] = useState<AuthSession | null>(api.getSession());
  const [currentTab, setCurrentTab] = useState<TabType>('DISCOVERY');
  const [selectedCandidate, setSelectedCandidate] = useState<MobileCandidate | null>(null);
  const [activeChatRecipient, setActiveChatRecipient] = useState<string | null>(null);

  if (!session) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#064E3B' }}>
        <StatusBar barStyle="light-content" backgroundColor="#064E3B" />
        <AuthScreen
          onLoginSuccess={(s) => {
            setSession(s);
            setCurrentTab('DISCOVERY');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main Content Area */}
      <View style={styles.content}>
        {activeChatRecipient ? (
          <SupervisedChatScreen
            recipientName={activeChatRecipient}
            onBack={() => setActiveChatRecipient(null)}
          />
        ) : (
          <>
            {currentTab === 'DISCOVERY' && (
              <DiscoveryFeedScreen
                onSelectCandidate={(cand) => setSelectedCandidate(cand)}
                onOpenChat={(name) => setActiveChatRecipient(name)}
              />
            )}
            {currentTab === 'PROPOSALS' && (
              <ProposalsScreen onOpenChat={(name) => setActiveChatRecipient(name)} />
            )}
            {currentTab === 'FAMILY' && <FamilyWorkspaceScreen />}
            {currentTab === 'PROFILE' && (
              <ProfileScreen
                onLogout={() => {
                  api.setSession(null);
                  setSession(null);
                }}
              />
            )}
          </>
        )}
      </View>

      {/* 6D Compatibility Breakdown Modal */}
      {selectedCandidate && (
        <CompatibilityDetailModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

      {/* Bottom Tab Bar */}
      {!activeChatRecipient && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentTab('DISCOVERY')}
          >
            <Text style={[styles.tabIcon, currentTab === 'DISCOVERY' && styles.tabActiveIcon]}>🔍</Text>
            <Text style={[styles.tabLabel, currentTab === 'DISCOVERY' && styles.tabActiveLabel]}>Matches</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentTab('PROPOSALS')}
          >
            <Text style={[styles.tabIcon, currentTab === 'PROPOSALS' && styles.tabActiveIcon]}>📋</Text>
            <Text style={[styles.tabLabel, currentTab === 'PROPOSALS' && styles.tabActiveLabel]}>Proposals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentTab('FAMILY')}
          >
            <Text style={[styles.tabIcon, currentTab === 'FAMILY' && styles.tabActiveIcon]}>👨‍👩‍👧</Text>
            <Text style={[styles.tabLabel, currentTab === 'FAMILY' && styles.tabActiveLabel]}>Family</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentTab('PROFILE')}
          >
            <Text style={[styles.tabIcon, currentTab === 'PROFILE' && styles.tabActiveIcon]}>👤</Text>
            <Text style={[styles.tabLabel, currentTab === 'PROFILE' && styles.tabActiveLabel]}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1 },
  tabBar: { flexDirection: 'row', height: 62, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', alignItems: 'center', justifyContent: 'space-around', paddingBottom: 6 },
  tabItem: { alignItems: 'center', justifyContent: 'center', paddingVertical: 4 },
  tabIcon: { fontSize: 20, color: '#9CA3AF' },
  tabActiveIcon: { color: '#064E3B' },
  tabLabel: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: '500' },
  tabActiveLabel: { color: '#064E3B', fontWeight: 'bold' }
});

export default App;
