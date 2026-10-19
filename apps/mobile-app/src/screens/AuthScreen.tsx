import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { api, AuthSession } from '../config/api.js';

interface AuthScreenProps {
  onLoginSuccess: (session: AuthSession) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [authMethod, setAuthMethod] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [phone, setPhone] = useState('03001234567');
  const [email, setEmail] = useState('user@example.com');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
  const [role, setRole] = useState<'CANDIDATE' | 'GUARDIAN'>('CANDIDATE');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (authMethod === 'PHONE' && (!phone || phone.length < 10)) {
      Alert.alert('Invalid Number', 'Please enter a valid mobile number (e.g. 03001234567).');
      return;
    }
    if (authMethod === 'EMAIL' && (!email || !email.includes('@'))) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    if (authMethod === 'PHONE') {
      await api.requestOtp(phone);
    }
    setLoading(false);
    setStep('OTP');
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    const identifier = authMethod === 'PHONE' ? phone : email;
    const session = await api.verifyOtp(identifier, otp, role);
    setLoading(false);
    onLoginSuccess(session);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandTitle}>وصل Wasl</Text>
        <Text style={styles.brandSubtitle}>Verified Matrimonial Platform</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleTab, role === 'CANDIDATE' && styles.roleTabActive]}
            onPress={() => setRole('CANDIDATE')}
          >
            <Text style={[styles.roleText, role === 'CANDIDATE' && styles.roleTextActive]}>Candidate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleTab, role === 'GUARDIAN' && styles.roleTabActive]}
            onPress={() => setRole('GUARDIAN')}
          >
            <Text style={[styles.roleText, role === 'GUARDIAN' && styles.roleTextActive]}>Wali / Guardian</Text>
          </TouchableOpacity>
        </View>

        {step === 'INPUT' && (
          <View style={styles.methodContainer}>
            <TouchableOpacity
              style={[styles.methodTab, authMethod === 'PHONE' && styles.methodTabActive]}
              onPress={() => setAuthMethod('PHONE')}
            >
              <Text style={[styles.methodText, authMethod === 'PHONE' && styles.methodTextActive]}>📱 Phone SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodTab, authMethod === 'EMAIL' && styles.methodTabActive]}
              onPress={() => setAuthMethod('EMAIL')}
            >
              <Text style={[styles.methodText, authMethod === 'EMAIL' && styles.methodTextActive]}>✉️ Email Address</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'INPUT' ? (
          <View>
            {authMethod === 'PHONE' ? (
              <View>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="03001234567"
                  keyboardType="phone-pad"
                  autoFocus
                />
                <Text style={styles.helperText}>Supports Pakistani & International numbers.</Text>
              </View>
            ) : (
              <View>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                />
                <Text style={styles.helperText}>Disposable temporary emails are automatically blocked.</Text>
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleRequestOtp} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Verification Code</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.label}>Enter 6-Digit Code</Text>
            <TextInput
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
            <Text style={styles.helperText}>Sent to {authMethod === 'PHONE' ? phone : email} (Demo: 123456)</Text>
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify & Sign In</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep('INPUT')} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Change {authMethod === 'PHONE' ? 'Phone Number' : 'Email'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.trustBadge}>
        <Text style={styles.trustText}>🔒 KMS 256-Bit Encrypted • Verified Credentials</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#064E3B', justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 28 },
  brandTitle: { fontSize: 36, fontWeight: 'bold', color: '#D1FAE5' },
  brandSubtitle: { fontSize: 14, color: '#A7F3D0', marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 8, padding: 4, marginBottom: 14 },
  roleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  roleTabActive: { backgroundColor: '#064E3B' },
  roleText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  roleTextActive: { color: '#FFFFFF' },
  methodContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', marginBottom: 16 },
  methodTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  methodTabActive: { borderBottomColor: '#064E3B' },
  methodText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  methodTextActive: { color: '#064E3B', fontWeight: 'bold' },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16, color: '#111827', marginBottom: 8 },
  helperText: { fontSize: 12, color: '#6B7280', marginBottom: 16 },
  button: { backgroundColor: '#064E3B', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  backButton: { marginTop: 12, alignItems: 'center' },
  backButtonText: { color: '#064E3B', fontSize: 13, fontWeight: '600' },
  trustBadge: { marginTop: 24, alignItems: 'center' },
  trustText: { color: '#A7F3D0', fontSize: 12, fontWeight: '500' }
});
