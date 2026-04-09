import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { InputField } from '@/components/ui/InputField';

export default function CompletedCoursesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const completedCourses = [
        { id: '1', title: 'Grammar Essentials', instructor: 'John Doe', completionDate: '12/05/2023', rewardAmount: 200, rewardType: 'coin', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973' },
        { id: '2', title: 'Basic Vocabulary', instructor: 'Emily Chen', completionDate: '01/04/2023', rewardAmount: 50, rewardType: 'gem', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098' },
        { id: '3', title: 'TOEIC Listening Practice', instructor: 'Michael Bay', completionDate: '15/08/2023', rewardAmount: 300, rewardType: 'coin', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071' },
        { id: '4', title: 'Advanced Reading Comprehension', instructor: 'Sarah Connor', completionDate: '22/10/2023', rewardAmount: 100, rewardType: 'gem', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070' },
        { id: '5', title: 'Writing for IELTS Task 1', instructor: 'David Smith', completionDate: '05/12/2023', rewardAmount: 500, rewardType: 'coin', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069' }
    ];

    const themeColor = colors.primary;

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Khóa học đã hoàn thành
                </Typography>
                <View style={{ width: 28 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <InputField placeholder="Tìm kiếm khóa học" leftIcon={"Search"} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {completedCourses.map((course) => {
                    const isGem = course.rewardType === 'gem';
                    const rewardBgColor = isGem ? colors.surfacePink : colors.surfaceYellow;
                    const rewardTextColor = isGem ? colors.rankMaster : colors.warning;
                    const rewardIcon = isGem ? 'Gem' : 'Coins';

                    return (
                        <TouchableOpacity
                            key={course.id}
                            activeOpacity={0.8}
                            style={[styles.courseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            onPress={() => router.push(`/(courses)/completed-courses-detail`)}
                        >
                            <Image source={{ uri: course.image }} style={styles.courseImage} resizeMode="cover" />

                            <View style={styles.infoContainer}>
                                <Typography variant="bodyLarge" color={colors.textPrimary} style={styles.courseTitle} numberOfLines={2}>
                                    {course.title}
                                </Typography>

                                <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 4 }}>
                                    GV: <Typography variant="caption" style={{ fontFamily: 'BeVietnamPro-Medium', color: colors.primary }}>{course.instructor}</Typography>
                                </Typography>

                                <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 12 }}>
                                    Hoàn thành vào {course.completionDate}
                                </Typography>

                                <View style={styles.actionRow}>
                                    {/* Nhóm Badge "Đã xong" và "Phần thưởng" */}
                                    <View style={styles.badgeGroup}>
                                        <View style={[styles.badge, { backgroundColor: colors.surfaceGreen }]}>
                                            <Icon name="CheckCircle" size={12} color={themeColor} />
                                            <Typography variant="tiny" color={themeColor} style={{ marginLeft: 4, fontFamily: 'BeVietnamPro-Bold' }}>Đã xong</Typography>
                                        </View>
                                        <View style={[styles.badge, { backgroundColor: rewardBgColor }]}>
                                            <Icon name={rewardIcon} size={12} color={rewardTextColor} />
                                            <Typography variant="tiny" color={rewardTextColor} style={{ marginLeft: 4, fontFamily: 'BeVietnamPro-Bold' }}>+{course.rewardAmount}</Typography>
                                        </View>
                                    </View>

                                    <View style={styles.reviewBtn}>
                                        <Typography variant="caption" color={colors.secondary} style={{ fontFamily: 'BeVietnamPro-Bold', marginRight: 4 }}>Xem lại</Typography>
                                        <Icon name="ChevronRight" size={14} color={colors.secondary} />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}
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

    actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    badgeGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
    reviewBtn: { flexDirection: 'row', alignItems: 'center' }
});