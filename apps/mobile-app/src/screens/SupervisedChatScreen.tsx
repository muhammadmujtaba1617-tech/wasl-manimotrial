import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';

interface Message {
  id: string;
  sender: 'ME' | 'THEM' | 'CHAPERONE' | 'SYSTEM';
  senderName: string;
  text: string;
  timestamp: string;
}

const PII_PATTERNS = [
  /(\+92|0092|92|0)?3[0-9]{2}[-\s]?[0-9]{7}/i, // Pakistani phone numbers
  /(whatsapp|wa\.me|call\s*me\s*at|text\s*me)/i,
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i // Email
];

export const SupervisedChatScreen: React.FC<{ recipientName: string; onBack: () => void }> = ({ recipientName, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_0',
      sender: 'SYSTEM',
      senderName: 'Wasl Moderation',
      text: 'Supervised chat active. Off-platform contact sharing is restricted until formal family introduction is complete.',
      timestamp: '2:15 PM'
    },
    {
      id: 'msg_1',
      sender: 'THEM',
      senderName: recipientName,
      text: 'Assalam-o-Alaikum! Thank you for accepting the proposal discussion.',
      timestamp: '2:16 PM'
    },
    {
      id: 'msg_2',
      sender: 'CHAPERONE',
      senderName: 'Tariq Khan (Wali)',
      text: 'Wa Alaikum Assalam. We appreciate the prompt family introduction.',
      timestamp: '2:18 PM'
    }
  ]);

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    // Real-time On-device PII Check
    for (const pattern of PII_PATTERNS) {
      if (pattern.test(input)) {
        Alert.alert(
          'Contact Sharing Blocked',
          'For candidate safety and privacy, phone numbers and direct off-platform contact links are restricted during supervised chaperone chat.'
        );
        return;
      }
    }

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'ME',
      senderName: 'Me',
      text: input,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{recipientName}</Text>
          <Text style={styles.headerSubtitle}>Supervised Chaperone Chat</Text>
        </View>
      </View>

      {/* Chaperone Banner */}
      <View style={styles.chaperoneBanner}>
        <Text style={styles.bannerText}>👀 Chaperone Active: Tariq Khan (Wali) is present in this conversation.</Text>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messageList} contentContainerStyle={{ padding: 16 }}>
        {messages.map((m) => {
          if (m.sender === 'SYSTEM') {
            return (
              <View key={m.id} style={styles.systemBox}>
                <Text style={styles.systemText}>{m.text}</Text>
              </View>
            );
          }

          if (m.sender === 'CHAPERONE') {
            return (
              <View key={m.id} style={styles.chaperoneMsgBox}>
                <Text style={styles.chaperoneSender}>{m.senderName}</Text>
                <Text style={styles.chaperoneText}>{m.text}</Text>
                <Text style={styles.msgTime}>{m.timestamp}</Text>
              </View>
            );
          }

          const isMe = m.sender === 'ME';

          return (
            <View key={m.id} style={[styles.msgRow, isMe ? styles.myMsgRow : styles.theirMsgRow]}>
              <View style={[styles.msgBubble, isMe ? styles.myBubble : styles.theirBubble]}>
                <Text style={[styles.msgText, isMe ? styles.myMsgText : styles.theirMsgText]}>{m.text}</Text>
                <Text style={[styles.msgTime, isMe ? styles.myTime : styles.theirTime]}>{m.timestamp}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a respectful message..."
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#064E3B', paddingHorizontal: 16, paddingVertical: 14, paddingTop: 40 },
  backBtn: { marginRight: 12 },
  backBtnText: { color: '#A7F3D0', fontWeight: 'bold', fontSize: 14 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 11, color: '#A7F3D0' },
  chaperoneBanner: { backgroundColor: '#FEF3C7', paddingVertical: 8, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#FDE68A' },
  bannerText: { fontSize: 11, color: '#92400E', fontWeight: '600' },
  messageList: { flex: 1 },
  systemBox: { backgroundColor: '#E5E7EB', padding: 10, borderRadius: 8, marginVertical: 8, alignItems: 'center' },
  systemText: { fontSize: 11, color: '#4B5563', textAlign: 'center' },
  chaperoneMsgBox: { backgroundColor: '#FEF9C3', borderColor: '#FEF08A', borderWidth: 1, padding: 12, borderRadius: 12, marginVertical: 6, alignSelf: 'center', maxWidth: '85%' },
  chaperoneSender: { fontSize: 11, fontWeight: 'bold', color: '#854D0E', marginBottom: 2 },
  chaperoneText: { fontSize: 13, color: '#713F12' },
  msgRow: { flexDirection: 'row', marginVertical: 4 },
  myMsgRow: { justifyContent: 'flex-end' },
  theirMsgRow: { justifyContent: 'flex-start' },
  msgBubble: { maxWidth: '75%', padding: 12, borderRadius: 16 },
  myBubble: { backgroundColor: '#064E3B', borderBottomRightRadius: 2 },
  theirBubble: { backgroundColor: '#FFFFFF', borderBottomLeftRadius: 2 },
  msgText: { fontSize: 14, lineHeight: 18 },
  myMsgText: { color: '#FFFFFF' },
  theirMsgText: { color: '#1F2937' },
  msgTime: { fontSize: 9, marginTop: 4, textAlign: 'right' },
  myTime: { color: '#A7F3D0' },
  theirTime: { color: '#9CA3AF' },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#111827' },
  sendBtn: { marginLeft: 10, backgroundColor: '#064E3B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  sendBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }
});
