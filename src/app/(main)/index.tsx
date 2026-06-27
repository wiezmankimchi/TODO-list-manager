import { ThemedText } from '@/components/themed-text';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/auth';
import { useProcedure } from '@/context/procedure';
import { useProfileStorage } from '@/hooks/use-profile-storage';
import { useTheme } from '@/hooks/use-theme';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Camera,
  LogOut,
  RefreshCw,
  Settings,
  User,
} from 'lucide-react-native';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PHASE_LABELS: Record<string, string> = {
  scanned: 'QR Scanned — ready to capture images',
  captured: 'Images captured — ready to process',
  processed: 'Processed — ready to upload',
};

export default function HomeScreen() {
  const { session, signOut } = useAuth();
  const { state, hasIncompleteProcedure, resetProcedure } = useProcedure();
  const theme = useTheme();
  const router = useRouter();
  const { profile } = useProfileStorage(session);

  const resumeRoute = (): string => {
    switch (state.phase) {
      case 'scanned':
        return '/capture';
      case 'captured':
        return '/process';
      case 'processed':
        return '/upload';
      default:
        return '/scan';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Welcome back,
            </ThemedText>
            <ThemedText type="default" style={[styles.username, { color: theme.text }]}>
              {profile.displayName || 'User'}
            </ThemedText>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push('/profile')}
              style={[styles.iconButton, { borderColor: theme.border, backgroundColor: theme.secondary }]}
            >
              <User size={18} color={theme.text} />
            </Pressable>
            <Pressable
              onPress={signOut}
              style={[styles.iconButton, { borderColor: theme.border, backgroundColor: theme.secondary }]}
            >
              <LogOut size={18} color={theme.destructive} />
            </Pressable>
          </View>
        </View>

        {/* Hero Card */}
        <Card style={[styles.heroCard, { backgroundColor: theme.primary, borderColor: theme.primary }]}>
          <CardContent style={styles.heroContent}>
            <View style={styles.heroTextSection}>
              <ThemedText style={[styles.heroTitle, { color: theme.primaryForeground }]}>
                Dental Procedure Scanner
              </ThemedText>
              <ThemedText style={[styles.heroSub, { color: theme.mutedForeground }]}>
                Scan QR codes, capture vitals and stickers, generate reports.
              </ThemedText>
            </View>
          </CardContent>
        </Card>

        {/* Resume Banner */}
        {hasIncompleteProcedure && (
          <Card style={[styles.resumeCard, { borderColor: theme.ring }]}>
            <CardContent style={styles.resumeContent}>
              <View style={styles.resumeText}>
                <ThemedText type="smallBold" style={{ color: theme.text }}>
                  Procedure in Progress
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {state.qrData?.PatName ?? 'Unknown Patient'} — {PHASE_LABELS[state.phase] ?? state.phase}
                </ThemedText>
              </View>
              <View style={styles.resumeActions}>
                <Button
                  label="Resume"
                  size="sm"
                  onPress={() => router.push(resumeRoute() as any)}
                  rightIcon={<ArrowRight size={14} color={theme.primaryForeground} />}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={resetProcedure}
                  leftIcon={<RefreshCw size={14} color={theme.textSecondary} />}
                  label="Discard"
                  labelStyle={{ color: theme.textSecondary }}
                />
              </View>
            </CardContent>
          </Card>
        )}

        {/* Start New Procedure */}
        <Button
          label="Start New Procedure"
          size="lg"
          onPress={() => {
            if (hasIncompleteProcedure) {
              resetProcedure();
            }
            router.push('/scan');
          }}
          leftIcon={<Camera size={20} color={theme.primaryForeground} />}
          style={styles.startButton}
        />

        {/* Settings Link */}
        <Pressable
          onPress={() => router.push('/profile')}
          style={({ pressed }) => [
            styles.navLink,
            { borderColor: theme.border, backgroundColor: theme.card },
            pressed && { opacity: 0.8 },
          ]}
        >
          <View style={styles.navLinkLeft}>
            <View style={[styles.linkIcon, { backgroundColor: theme.secondary }]}>
              <Settings size={20} color={theme.text} />
            </View>
            <View>
              <ThemedText type="smallBold" style={{ color: theme.text }}>
                Profile & Settings
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Account details and OpenDental API configuration
              </ThemedText>
            </View>
          </View>
          <ArrowRight size={18} color={theme.textSecondary} />
        </Pressable>

      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroCard: {
    padding: 20,
    marginBottom: 24,
    borderRadius: 16,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroTextSection: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    lineHeight: 20,
  },
  resumeCard: {
    marginBottom: 16,
    borderWidth: 2,
  },
  resumeContent: {
    gap: 12,
  },
  resumeText: {
    gap: 4,
  },
  resumeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  startButton: {
    height: 52,
    marginBottom: 24,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  navLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
