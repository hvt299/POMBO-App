import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
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

    const ongoingCourses = [
        { id: '1', title: 'English for Travel', instructor: 'Kurnia Majid', progress: 0.65, completedLessons: 12, totalLessons: 18, image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071' },
        { id: '2', title: 'IELTS Speaking Masterclass', instructor: 'Sarah Connor', progress: 0.3, completedLessons: 6, totalLessons: 20, image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070' },
        { id: '3', title: 'Business English for Beginners', instructor: 'David Smith', progress: 0.8, completedLessons: 24, totalLessons: 30, image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069' },
        { id: '4', title: 'Basic Grammar in Use', instructor: 'John Doe', progress: 0.1, completedLessons: 2, totalLessons: 20, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973' },
        { id: '5', title: 'Daily Communication Skills', instructor: 'Emily Chen', progress: 0.45, completedLessons: 9, totalLessons: 20, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098' },
    ];

    const themeColor = colors.secondary;

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
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
                <InputField placeholder="Tìm kiếm khóa học" leftIcon={"Search"} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {ongoingCourses.map((course) => (
                    <TouchableOpacity
                        key={course.id}
                        activeOpacity={0.8}
                        style={[styles.courseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                        onPress={() => router.push(`/(courses)/course-detail`)}
                    >
                        <Image source={{ uri: course.image }} style={styles.courseImage} resizeMode="cover" />

                        <View style={styles.infoContainer}>
                            <Typography variant="bodyLarge" color={colors.textPrimary} style={styles.courseTitle} numberOfLines={2}>
                                {course.title}
                            </Typography>

                            <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 4 }}>
                                GV: <Typography variant="caption" style={{ fontFamily: 'BeVietnamPro-Medium', color: colors.primary }}>{course.instructor}</Typography>
                            </Typography>

                            <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 8 }}>
                                {course.completedLessons} / {course.totalLessons} Bài học
                            </Typography>

                            {/* Progress Bar với màu Secondary */}
                            <View style={styles.progressRow}>
                                <View style={[styles.progressBg, { backgroundColor: colors.surfaceAlt }]}>
                                    <View style={[styles.progressFill, { width: `${course.progress * 100}%`, backgroundColor: themeColor }]} />
                                </View>
                                <Typography variant="tiny" color={themeColor} style={{ marginLeft: 8, fontFamily: 'BeVietnamPro-Bold' }}>
                                    {Math.round(course.progress * 100)}%
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
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
    backButton: { padding: 4 },
    headerTitle: { fontWeight: '700' },
    searchContainer: { paddingHorizontal: 20, marginBottom: 16 },

    scrollContent: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },

    courseCard: { flexDirection: 'row', padding: 16, borderRadius: 24, borderWidth: 1.5, alignItems: 'center' },
    courseImage: { width: 80, height: 80, borderRadius: 16 },
    infoContainer: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    courseTitle: { fontFamily: 'BeVietnamPro-Bold', marginBottom: 2, lineHeight: 20 },

    progressRow: { flexDirection: 'row', alignItems: 'center' },
    progressBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
});