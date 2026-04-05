import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CompletedCourseDetailScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Màu chủ đạo cho màn hình này (màu xanh dương nhạt)
    const BLUE_THEME_COLOR = '#38BDF8';
    const GREEN_THEME_COLOR = '#10B981';
    const ORANGE_REWARD_COLOR = '#F97316';

    // Dữ liệu mẫu cho màn hình
    const courseData = {
        title: 'Grammar Essentials',
        hasBadge: true, // Icon tích xanh ở header
        banner: require('@/assets/images/dragon.png'), // Đổi đường dẫn ảnh banner phù hợp
        progress: { 
            percent: 100, 
            current: 20, 
            total: 20,
            rewardText: "Thưởng 200 Coins"
        },
        chapters: [
            {
                id: 'c1',
                title: 'Chương 1: Airport & Arrival',
                progressText: '5/5 Bài học',
                isCompleted: true,
                lessons: [
                    { id: 'l1', title: 'Checking In', meta: '10 mins • Vocabulary', status: 'completed' },
                    { id: 'l2', title: 'Security Check', meta: '15 mins • Speaking', status: 'completed' },
                ]
            },
            {
                id: 'c2',
                title: 'Chương 2: Airport & Arrival',
                progressText: '1/13 Bài học',
                isCompleted: false,
                lessons: [
                    { id: 'l3', title: 'Asking for Directions', meta: '12 mins • Interaction', status: 'current' },
                    { id: 'l4', title: 'Taking a Taxi', meta: '8 mins • Listening', status: 'locked' },
                    { id: 'l5', title: 'Public Transport', meta: '20 mins • Grammar', status: 'locked' },
                ]
            }
        ]
    };

    // Hàm render icon và màu sắc tùy theo trạng thái bài học
    const getLessonStyle = (status: string) => {
        switch (status) {
            case 'completed':
                return {
                    icon: 'Check',
                    iconBg: '#D1FAE5', // Xanh lá nhạt
                    iconColor: colors.primary, // Xanh lá
                    leftBorderColor: colors.primary,
                };
            case 'current':
                return {
                    icon: 'BookOpen',
                    iconBg: '#E0F2FE', // Xanh dương nhạt
                    iconColor: colors.secondary,
                    leftBorderColor: colors.secondary,
                };
            case 'locked':
            default:
                return {
                    icon: 'Lock',
                    iconBg: '#F3F4F6', // Xám nhạt
                    iconColor: '#9CA3AF', // Xám
                    leftBorderColor: 'transparent',
                };
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                        {courseData.title}
                    </Typography>
                    {courseData.hasBadge && (
                        <Icon name="CheckCircle" size={18} color={BLUE_THEME_COLOR} style={styles.titleBadge} />
                    )}
                </View>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Banner */}
                <Image source={courseData.banner} style={styles.banner} resizeMode="cover" />

                {/* Progress Card (phiên bản xanh dương) */}
                <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: BLUE_THEME_COLOR }]}>
                    <View style={styles.progressInfo}>
                        <Typography variant="bodyBase" color={colors.textSecondary}>
                            Tiến độ khóa học
                        </Typography>
                        <Typography variant="h2" color={colors.textPrimary} style={styles.progressPercent}>
                            {courseData.progress.percent}% Hoàn thành
                        </Typography>
                        <Typography variant="bodySmall" color={ORANGE_REWARD_COLOR}>
                            {courseData.progress.rewardText}
                        </Typography>
                    </View>

                    {/* Vòng tròn tiến độ đầy đủ (Giả lập bằng View) */}
                    <View style={styles.circularProgressContainer}>
                        <View style={[styles.circularProgress, { borderColor: BLUE_THEME_COLOR }]}>
                            <Typography variant="h3" color={colors.textPrimary}>
                                {courseData.progress.current}/{courseData.progress.total}
                            </Typography>
                        </View>
                    </View>
                </View>

                {/* Danh sách Chương và Bài học (giữ nguyên cấu trúc) */}
                {courseData.chapters.map((chapter) => (
                    <View key={chapter.id} style={styles.chapterContainer}>
                        {/* Chapter Header */}
                        <View style={styles.chapterHeader}>
                            <Typography variant="h3" color={colors.textPrimary} style={styles.chapterTitle}>
                                {chapter.title}
                            </Typography>
                            <Typography 
                                variant="bodySmall" 
                                color={chapter.isCompleted ? GREEN_THEME_COLOR : colors.textSecondary}
                            >
                                {chapter.progressText}
                            </Typography>
                        </View>

                        {/* Lessons List */}
                        {chapter.lessons.map((lesson) => {
                            const stylesConfig = getLessonStyle(lesson.status);
                            return (
                                <TouchableOpacity 
                                    key={lesson.id} 
                                    activeOpacity={lesson.status === 'locked' ? 1 : 0.7}
                                    style={[
                                        styles.lessonCard, 
                                        { borderLeftColor: stylesConfig.leftBorderColor }
                                    ]}
                                >
                                    <View style={[styles.lessonIconContainer, { backgroundColor: stylesConfig.iconBg }]}>
                                        <Icon name={stylesConfig.icon} size={20} color={stylesConfig.iconColor} />
                                    </View>
                                    
                                    <View style={styles.lessonInfo}>
                                        <Typography 
                                            variant="h3" 
                                            color={lesson.status === 'locked' ? colors.textSecondary : colors.textPrimary}
                                        >
                                            {lesson.title}
                                        </Typography>
                                        <Typography variant="bodySmall" color={colors.textSecondary}>
                                            {lesson.meta}
                                        </Typography>
                                    </View>

                                    {lesson.status !== 'locked' && (
                                        <Icon name="ChevronRight" size={20} color={colors.textSecondary} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    backButton: { padding: 4 },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    headerTitle: { fontWeight: '700' },
    titleBadge: { marginLeft: 6 },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    banner: {
        width: '100%',
        height: 180,
        borderRadius: 0,
        marginBottom: 20,
    },
    progressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24,
        borderRadius: 40,
        borderWidth: 1.5,
        marginBottom: 30,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    progressInfo: {
        flex: 1,
    },
    progressPercent: {
        fontSize: 22,
        marginVertical: 4,
    },
    circularProgressContainer: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circularProgress: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chapterContainer: {
        marginBottom: 24,
    },
    chapterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chapterTitle: {
        fontWeight: '700',
    },
    lessonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        backgroundColor: '#FAFAFA',
        borderLeftWidth: 4,
        borderTopLeftRadius: 16,
        borderBottomLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },
    lessonIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    lessonInfo: {
        flex: 1,
    },
});