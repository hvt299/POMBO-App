import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CourseDetailScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Dữ liệu mẫu cho màn hình
    const courseData = {
        title: 'English for Travel',
        banner: require('@/assets/images/dragon.png'), // Đổi đường dẫn ảnh phù hợp
        progress: { percent: 45, current: 15, total: 20 },
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
                    iconBg: colors.surfaceGreen, // Xanh lá nhạt
                    iconColor: colors.primary, // Xanh lá
                    leftBorderColor: colors.primary,
                };
            case 'current':
                return {
                    icon: 'BookOpen',
                    iconBg: colors.surfaceBlue, // Xanh dương nhạt
                    iconColor: colors.secondary, // Xanh dương
                    leftBorderColor: colors.secondary,
                };
            case 'locked':
            default:
                return {
                    icon: 'Lock',
                    iconBg: colors.surfaceAlt, // Xám nhạt
                    iconColor: colors.textSecondary, // Xám
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
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    {courseData.title}
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Banner */}
                <Image source={courseData.banner} style={styles.banner} resizeMode="cover" />

                {/* Progress Card */}
                <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: '#4ADE80' }]}>
                    <View style={styles.progressInfo}>
                        <Typography variant="bodyBase" color={colors.textSecondary}>
                            Tiến độ khóa học
                        </Typography>
                        <Typography variant="h2" color={colors.textPrimary} style={styles.progressPercent}>
                            {courseData.progress.percent}% Hoàn thành
                        </Typography>
                        <Typography variant="bodySmall" color={colors.textSecondary}>
                            Hoàn thành 100% để nhận coins
                        </Typography>
                    </View>

                    {/* Vòng tròn tiến độ (Giả lập bằng View cơ bản) */}
                    <View style={styles.circularProgressContainer}>
                        <View style={[styles.circularProgress, { borderColor: '#4ADE80' }]}>
                            <Typography variant="h3" color={colors.textPrimary}>
                                {courseData.progress.current}/{courseData.progress.total}
                            </Typography>
                        </View>
                        {/* Phần cung tròn xám mờ giả lập vòng khuyết */}
                        <View style={[styles.circularProgressOverlay, { borderTopColor: '#E5E7EB', borderRightColor: '#E5E7EB' }]} />
                    </View>
                </View>

                {/* Danh sách Chương và Bài học */}
                {courseData.chapters.map((chapter) => (
                    <View key={chapter.id} style={styles.chapterContainer}>
                        {/* Chapter Header */}
                        <View style={styles.chapterHeader}>
                            <Typography variant="h3" color={colors.textPrimary} style={styles.chapterTitle}>
                                {chapter.title}
                            </Typography>
                            <Typography 
                                variant="bodySmall" 
                                color={chapter.isCompleted ? '#10B981' : colors.textSecondary}
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
    headerTitle: { fontWeight: '700' },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    banner: {
        width: '100%',
        height: 180,
        borderRadius: 0, // Ảnh banner tràn sát 2 bên
        marginBottom: 20,
    },
    progressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 24,
        borderRadius: 40, // Bo góc lớn giống hình viên thuốc
        borderWidth: 1.5,
        marginBottom: 30,
    },
    progressInfo: {
        flex: 1,
    },
    progressPercent: {
        fontSize: 22,
        marginVertical: 4,
    },
    circularProgressContainer: {
        position: 'relative',
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
        position: 'absolute',
        zIndex: 2,
    },
    circularProgressOverlay: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 6,
        borderColor: 'transparent',
        position: 'absolute',
        transform: [{ rotate: '45deg' }],
        zIndex: 3,
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
        backgroundColor: '#FAFAFA', // Màu nền cực nhạt cho item
        borderLeftWidth: 4, // Đường viền chỉ báo bên trái
        borderTopLeftRadius: 16, // Bo góc trái để đường viền cong
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