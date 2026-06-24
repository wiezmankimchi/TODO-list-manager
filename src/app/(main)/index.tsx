import { ThemedText } from '@/components/themed-text';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/auth';
import { useTasks } from '@/context/tasks';
import { useProfileStorage } from '@/hooks/use-profile-storage';
import { useTheme } from '@/hooks/use-theme';
import { getActiveTasks, getCompletedTasks, getWeekOverWeekGrowth } from '@/utils/task-stats';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  FolderKanban,
  ListTodo,
  LogOut,
  Settings,
  TrendingUp,
  User,
} from 'lucide-react-native';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { session, signOut } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { tasks } = useTasks();
  const { profile } = useProfileStorage(session);

  const stats = [
    { label: 'Active Tasks', value: String(getActiveTasks(tasks)), icon: FolderKanban },
    { label: 'Tasks Done', value: String(getCompletedTasks(tasks)), icon: CheckCircle },
    { label: 'Growth', value: getWeekOverWeekGrowth(tasks), icon: TrendingUp },
  ];

  const recentActivity = [
    { id: '1', title: 'Updated profile details', time: '2 hours ago', type: 'profile' },
    { id: '2', title: 'Created list "Project Bardeen"', time: 'Yesterday', type: 'list' },
    { id: '3', title: 'Completed task "Define colors"', time: '2 days ago', type: 'task' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Custom Header */}
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
                Aesthetics & Simplicity
              </ThemedText>
              <ThemedText style={[styles.heroSub, { color: theme.mutedForeground }]}>
                Clean grayscale interfaces designed for focus and productivity.
              </ThemedText>
            </View>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} style={styles.statCard}>
                <CardContent style={styles.statContent}>
                  <View style={[styles.statIconContainer, { backgroundColor: theme.secondary }]}>
                    <Icon size={16} color={theme.text} />
                  </View>
                  <ThemedText style={[styles.statValue, { color: theme.text }]}>
                    {stat.value}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {stat.label}
                  </ThemedText>
                </CardContent>
              </Card>
            );
          })}
        </View>

        {/* Navigation Links */}
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Explore App
        </ThemedText>
        
        <View style={styles.linksContainer}>
          <Pressable
            onPress={() => router.push('/lists')}
            style={({ pressed }) => [
              styles.navLink,
              { borderColor: theme.border, backgroundColor: theme.card },
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={styles.navLinkLeft}>
              <View style={[styles.linkIcon, { backgroundColor: theme.secondary }]}>
                <ListTodo size={20} color={theme.text} />
              </View>
              <View>
                <ThemedText type="smallBold" style={{ color: theme.text }}>
                  My Lists
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  View task boards, active items, and checklists
                </ThemedText>
              </View>
            </View>
            <ArrowRight size={18} color={theme.textSecondary} />
          </Pressable>

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
                  Account details, configurations, and dark theme
                </ThemedText>
              </View>
            </View>
            <ArrowRight size={18} color={theme.textSecondary} />
          </Pressable>
        </View>

        {/* Recent Activity */}
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Recent Logs
        </ThemedText>

        <Card style={styles.activityCard}>
          <CardContent style={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <View
                key={activity.id}
                style={[
                  styles.activityItem,
                  index < recentActivity.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border },
                ]}
              >
                <View style={styles.activityText}>
                  <ThemedText type="small" style={{ color: theme.text }}>
                    {activity.title}
                  </ThemedText>
                  <ThemedText type="code" style={{ color: theme.textSecondary, fontSize: 10, marginTop: 2 }}>
                    {activity.time}
                  </ThemedText>
                </View>
                <ChevronRight size={14} color={theme.textSecondary} />
              </View>
            ))}
          </CardContent>
        </Card>

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
  sectionTitle: {
    fontSize: 15,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 12,
    marginVertical: 0,
  },
  statContent: {
    alignItems: 'flex-start',
    gap: 4,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  linksContainer: {
    gap: 12,
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
  activityCard: {
    padding: 0,
    marginVertical: 0,
  },
  activityList: {
    paddingHorizontal: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  activityText: {
    flex: 1,
    paddingRight: 16,
  },
});
