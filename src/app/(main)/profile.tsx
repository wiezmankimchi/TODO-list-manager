import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/hooks/use-theme';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ThemedText } from '@/components/themed-text';
import { User, Mail, Shield, Bell, HelpCircle } from 'lucide-react-native';

export default function ProfileScreen() {
  const { session, signOut } = useAuth();
  const theme = useTheme();

  const [displayName, setDisplayName] = useState(session ? session.split('@')[0] : 'Admin');
  const [email, setEmail] = useState(session || 'admin@example.com');
  const [notifications, setNotifications] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Success', 'Profile changes saved successfully.', [
        { text: 'OK' }
      ]);
    }, 1000);
  };

  const getInitials = () => {
    if (!displayName) return 'U';
    return displayName.slice(0, 2).toUpperCase();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primary }]}>
            <ThemedText style={[styles.avatarText, { color: theme.primaryForeground }]}>
              {getInitials()}
            </ThemedText>
          </View>
          <ThemedText type="subtitle" style={[styles.nameText, { color: theme.text }]}>
            {displayName}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {email}
          </ThemedText>
        </View>

        {/* Edit Info Card */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Update your display name and email address below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              label="Display Name"
              placeholder="Your Name"
              value={displayName}
              onChangeText={setDisplayName}
              leftIcon={<User size={16} color={theme.textSecondary} />}
            />
            <Input
              label="Email Address"
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={16} color={theme.textSecondary} />}
            />
            <Button
              label="Save Details"
              loading={isSaving}
              onPress={handleSave}
              style={styles.saveButton}
            />
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Preferences
        </ThemedText>

        <Card style={styles.card}>
          <CardContent style={styles.settingsList}>
            {/* Setting Item: Notifications */}
            <View style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
              <View style={styles.settingItemLeft}>
                <Bell size={18} color={theme.text} />
                <View style={styles.settingText}>
                  <ThemedText type="smallBold" style={{ color: theme.text }}>Push Notifications</ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>Enable updates and alerts</ThemedText>
                </View>
              </View>
              <Button
                variant={notifications ? 'default' : 'outline'}
                size="sm"
                label={notifications ? 'On' : 'Off'}
                onPress={() => setNotifications(!notifications)}
                style={styles.toggleButton}
              />
            </View>

            {/* Setting Item: Security */}
            <View style={[styles.settingItem, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
              <View style={styles.settingItemLeft}>
                <Shield size={18} color={theme.text} />
                <View style={styles.settingText}>
                  <ThemedText type="smallBold" style={{ color: theme.text }}>Security & Privacy</ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>2FA and account lockouts</ThemedText>
                </View>
              </View>
              <Button
                variant="outline"
                size="sm"
                label="Manage"
                onPress={() => Alert.alert('Security', 'Security settings are managed in your account dashboard.')}
              />
            </View>

            {/* Setting Item: Support */}
            <View style={styles.settingItem}>
              <View style={styles.settingItemLeft}>
                <HelpCircle size={18} color={theme.text} />
                <View style={styles.settingText}>
                  <ThemedText type="smallBold" style={{ color: theme.text }}>Help & Support</ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>FAQ and customer helpdesk</ThemedText>
                </View>
              </View>
              <Button
                variant="outline"
                size="sm"
                label="Help"
                onPress={() => Alert.alert('Support', 'Please email support@example.com for help.')}
              />
            </View>
          </CardContent>
        </Card>

        {/* Action Button: Sign Out */}
        <Button
          variant="destructive"
          label="Sign Out"
          onPress={signOut}
          style={styles.signOutButton}
        />

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  card: {
    marginBottom: 20,
    marginVertical: 0,
  },
  saveButton: {
    height: 44,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsList: {
    paddingVertical: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  toggleButton: {
    minWidth: 60,
  },
  signOutButton: {
    height: 48,
    marginTop: 12,
  },
});
