import React, { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  DimensionValue,
  useColorScheme
} from 'react-native';
// Thay thế toàn bộ bằng lucide-react-native
import { Bell, Flame, Zap, MessageCircle, Laptop, Book, Crown } from 'lucide-react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// --- COLORS THEME ---
export const Colors = {
  light: {
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceAlt: '#F1F5F9',
      border: '#E2E8F0',
      primary: '#23CE6B',
      secondary: '#0EA5E9',
      warning: '#F59E0B',
      danger: '#EF4444',
      disabled: '#CBD5E1',
      rankMaster: '#EC4899',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      textOnAction: '#FFFFFF',
      surfaceGreen: '#D1FAE5',
      surfacePink: '#FCE7F3',
      surfacePurple: '#F3E8FF',
      surfaceBlue: '#E0F2FE',
      surfaceYellow: '#FEF3C7',
  },
  dark: {
      background: '#0F172A',
      surface: '#1E293B',
      surfaceAlt: '#334155',
      border: '#334155',
      primary: '#23CE6B',
      secondary: '#0EA5E9',
      warning: '#F59E0B',
      danger: '#EF4444',
      disabled: '#475569',
      rankMaster: '#EC4899',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      textOnAction: '#022C15',
      surfaceGreen: '#064E3B',
      surfacePink: '#831843',
      surfacePurple: '#581C87',
      surfaceBlue: '#0C4A6E',
      surfaceYellow: '#78350F',
  },
};

export default function EnhancedDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const styles = useMemo(() => getStyles(colors), [colors]);

  const CHART_DATA = [
    { day: '1', words: 0, color: colors.danger },
    { day: '2', words: 12, color: colors.warning, active: true },
    { day: '3', words: 0, color: colors.primary },
    { day: '4', words: 0, color: colors.secondary },
    { day: '5', words: 0, color: colors.rankMaster },
  ];

  // Truyền thẳng Component Icon của Lucide vào mảng
  const NEXT_LESSONS = [
    { id: 1, title: 'Giao tiếp cơ bản', progress: '80%', color: colors.secondary, bg: colors.surfaceBlue, icon: MessageCircle },
    { id: 2, title: 'Từ vựng IT', progress: '30%', color: colors.rankMaster, bg: colors.surfacePurple, icon: Laptop },
    { id: 3, title: 'Ngữ pháp Toeic', progress: '10%', color: colors.danger, bg: colors.surfacePink, icon: Book },
  ];

  const LEADERBOARD = [
    { id: 1, name: 'Minh Tuấn', points: 2450, avatar: 'https://i.pravatar.cc/150?img=12', rank: 1 },
    { id: 2, name: 'Alex (Bạn)', points: 2100, avatar: 'https://i.pravatar.cc/150?img=11', rank: 2 },
    { id: 3, name: 'Thảo Vy', points: 1850, avatar: 'https://i.pravatar.cc/150?img=5', rank: 3 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        
        {/* --- HEADER --- */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
          <View style={styles.userInfo}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
            <View>
              <Text style={styles.greeting}>Chào buổi sáng</Text>
              <Text style={styles.userName}>Alex! ✌️</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <View style={styles.badge} />
            <Bell size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* --- STATS CARDS --- */}
        <View style={styles.cardsRow}>
          <TouchableOpacity style={[styles.card, styles.streakCard]}>
            <View style={styles.streakHeader}>
              <Flame size={20} color={colors.textOnAction} />
              <View style={styles.streakBadge}>
                <Text style={styles.streakBadgeText}>Streak</Text>
              </View>
            </View>
            <Text style={styles.streakNumber}>7</Text>
            <Text style={styles.streakLabel}>NGÀY LIÊN TIẾP</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.reviewCard]}
            activeOpacity={0.8}
            onPress={() => router.push('/review')}
          >
            <View style={{ marginBottom: 8 }}>
              <Zap size={26} color={colors.primary} />
            </View>
            <Text style={styles.reviewTitle}>Ôn tập ngay</Text>
            <Text style={styles.reviewSubtitle}>TIẾP TỤC LỘ TRÌNH</Text>
          </TouchableOpacity>
        </View>

        {/* --- LEARNING CHART --- */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Biểu đồ học tập</Text>
          <View style={styles.chartSection}>
            {CHART_DATA.map((item, index) => (
              <View key={index} style={styles.chartColumn}>
                <Text style={[styles.chartWords, item.active && { color: colors.warning, fontWeight: '800' }]}>
                  {item.words} từ
                </Text>
                <View style={[
                  styles.chartBar, 
                  { height: item.active ? 90 : 8, backgroundColor: item.color }
                ]} />
                <Text style={[styles.chartDay, item.active && { color: colors.textPrimary, fontWeight: '800' }]}>
                  {item.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- DAILY TASKS --- */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Nhiệm vụ hằng ngày</Text>
          <View style={styles.tasksCard}>
            <View style={styles.circularProgress}>
              <Text style={styles.progressTextMain}>15/20</Text>
              <Text style={styles.progressTextSub}>NV</Text>
            </View>
            <View style={styles.tasksInfo}>
              <Text style={styles.tasksDescription}>
                Chỉ còn 5 nhiệm vụ nữa thôi là bạn sẽ hoàn thành mục tiêu hôm nay! Cố lên nhé!
              </Text>
              <View style={styles.progressSteps}>
                {[1, 2, 3, 4, 5].map((step) => (
                  <View key={step} style={[styles.stepDot, step === 5 ? styles.stepDotInactive : styles.stepDotActive]} />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* --- NEXT LESSONS --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Học tiếp nào</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {NEXT_LESSONS.map((lesson) => {
              const IconComponent = lesson.icon; // Gán component ra biến để render
              return (
                <TouchableOpacity key={lesson.id} style={styles.lessonCard}>
                  <View style={[styles.lessonIconWrap, { backgroundColor: lesson.bg }]}>
                    <IconComponent size={24} color={lesson.color} />
                  </View>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <View style={styles.lessonProgressBar}>
                    <View style={[styles.lessonProgressFill, { width: lesson.progress as DimensionValue, backgroundColor: lesson.color }]} />
                  </View>
                  <Text style={styles.lessonProgressText}>{lesson.progress} hoàn thành</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* --- LEADERBOARD --- */}
        <View style={[styles.sectionContainer, { marginBottom: 40 }]}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Bảng xếp hạng</Text>
                <TouchableOpacity>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>
          {/* <Text style={styles.sectionTitle}>Bảng xếp hạng tuần</Text> */}
          <View style={styles.leaderboardCard}>
            {LEADERBOARD.map((user, index) => (
              <View key={user.id} style={[styles.leaderboardRow, index !== LEADERBOARD.length - 1 && styles.borderBottom]}>
                <Text style={[styles.rankText, user.rank === 1 && { color: colors.warning }]}>#{user.rank}</Text>
                <Image source={{ uri: user.avatar }} style={styles.lbAvatar} />
                <View style={styles.lbInfo}>
                  <Text style={[styles.lbName, user.name.includes('(Bạn)') && { color: colors.secondary, fontWeight: '800' }]}>
                    {user.name}
                  </Text>
                  <Text style={styles.lbPoints}>{user.points} XP</Text>
                </View>
                {user.rank === 1 && <Crown size={24} color={colors.warning} />}
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

// --- DYNAMIC STYLES ---
const getStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    zIndex: 1,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  card: {
    width: (width - 56) / 2,
    borderRadius: 20,
    padding: 16,
    height: 130,
    justifyContent: 'center',
  },
  streakCard: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakBadgeText: {
    color: colors.textOnAction,
    fontSize: 12,
    fontWeight: '700',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textOnAction,
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 11,
    color: colors.surfaceGreen,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  reviewTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  reviewSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: 16,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  chartSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 130,
    paddingHorizontal: 8,
  },
  chartColumn: {
    alignItems: 'center',
    width: 44,
  },
  chartWords: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 6,
  },
  chartBar: {
    width: 32,
    borderRadius: 8,
    marginBottom: 10,
  },
  chartDay: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tasksCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  circularProgress: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 7,
    borderColor: colors.primary,
    borderLeftColor: colors.border, 
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  progressTextMain: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    transform: [{ rotate: '-45deg' }],
  },
  progressTextSub: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  tasksInfo: {
    flex: 1,
    marginLeft: 20,
  },
  tasksDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 14,
  },
  progressSteps: {
    flexDirection: 'row',
    gap: 8,
  },
  stepDot: {
    height: 6,
    flex: 1,
    borderRadius: 3,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  stepDotInactive: {
    backgroundColor: colors.border,
  },
  horizontalScroll: {
    paddingRight: 20,
    gap: 16,
  },
  lessonCard: {
    width: 160,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  lessonProgressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  lessonProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  lessonProgressText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  leaderboardCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textSecondary,
    width: 32,
  },
  lbAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  lbInfo: {
    flex: 1,
  },
  lbName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  lbPoints: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});