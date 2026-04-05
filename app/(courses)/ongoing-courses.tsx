import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/ui/InputField';

export default function OngoingCoursesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Dữ liệu mẫu cho danh sách khóa học
    const ongoingCourses = [
        {
            id: '1',
            title: 'English for Travel',
            progress: 0.65, // 65%
            completedLessons: 12,
            totalLessons: 18,
            image: require('@/assets/images/dragon.png'), // Thay bằng ảnh của bạn
            borderColor: colors.primary,
        },
        {
            id: '2',
            title: 'English for Travel',
            progress: 0.65,
            completedLessons: 12,
            totalLessons: 18,
            image: require('@/assets/images/dragon.png'),
            borderColor: colors.primary,
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Khóa học đang học
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <InputField
                    placeholder="Tìm kiếm khóa học"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.searchInput, { color: colors.textPrimary }]}
                />
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {ongoingCourses.map((course) => (
                    <TouchableOpacity 
                        onPress={() => router.push(`/(courses)/course-detail`)}
                        key={course.id} 
                        activeOpacity={0.9}
                        style={[styles.courseCard, { borderColor: course.borderColor, backgroundColor: colors.surface }]}
                    >
                        {/* Course Image */}
                        <Image source={course.image} style={styles.courseImage} resizeMode="cover" />
                        
                        {/* Course Info */}
                        <View style={styles.infoContainer}>
                            <Typography variant="h3" color={colors.textPrimary} style={styles.courseTitle}>
                                {course.title}
                            </Typography>

                            {/* Progress Bar Container */}
                            <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceAlt }]}>
                                <View 
                                    style={[
                                        styles.progressBarFill, 
                                        { width: `${course.progress * 100}%`, backgroundColor: course.borderColor }
                                    ]} 
                                />
                            </View>

                            {/* Progress Stats */}
                            <View style={styles.statsRow}>
                                <Typography variant="bodySmall" color={colors.textSecondary}>
                                    {Math.round(course.progress * 100)}% Hoàn thành
                                </Typography>
                                <Typography variant="bodySmall" color={colors.textSecondary}>
                                    {course.completedLessons}/{course.totalLessons} Bài học
                                </Typography>
                            </View>
                        </View>
                    </TouchableOpacity>
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
        marginBottom: 10,
    },
    backButton: { padding: 4 },
    headerTitle: { fontWeight: '700' },
    searchContainer: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    searchWrapper: {
        height: 45,
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    searchInput: {
        fontSize: 14,
        fontFamily: 'BeVietnamPro-Regular', // Đảm bảo font này đã được load
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 30,
        gap: 20,
    },
    courseCard: {
        width: '100%',
        borderRadius: 40,
        borderWidth: 2,
        overflow: 'hidden', // Để ảnh không tràn ra khỏi border radius
        paddingBottom: 20,
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    courseImage: {
        width: '60%',
        height: 140,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 12,
    },
    infoContainer: {
        paddingHorizontal: 25,
        marginTop: 15,
    },
    courseTitle: {
        textAlign: 'center',
        marginBottom: 15,
    },
    progressBarBg: {
        height: 10,
        width: '100%',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    cardText: {
        fontSize: 18,
        fontWeight: '600',
    },
});