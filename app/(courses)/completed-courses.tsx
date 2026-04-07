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
    
    // Dữ liệu mẫu cho danh sách khóa học đã hoàn thành
    const completedCourses = [
        {
            id: '1',
            title: 'Grammar Essentials',
            completionDate: '12/05/2023',
            image: require('@/assets/images/dragon.png'), // Thay bằng ảnh banner sách của bạn
            borderColor: colors.secondary,
        },
        {
            id: '2',
            title: 'Grammar Essentials',
            completionDate: '12/05/2023',
            image: require('@/assets/images/dragon.png'),
            borderColor: colors.secondary,
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
                    Khóa học đã hoàn thành
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
                {completedCourses.map((course) => (
                    <View 
                        key={course.id} 
                        style={[styles.courseCard, { borderColor: course.borderColor, backgroundColor: colors.surface }]}
                    >
                        {/* Course Image */}
                        <Image source={course.image} style={styles.courseImage} resizeMode="cover" />
                        
                        {/* Course Info */}
                        <View style={styles.infoContainer}>
                            <Typography variant="h3" color={colors.textPrimary} style={styles.courseTitle}>
                                {course.title}
                            </Typography>

                            <Typography variant="bodySmall" color={colors.textSecondary} style={styles.completionDate}>
                                Hoàn thành vào {course.completionDate}
                            </Typography>

                            {/* Action Button */}
                            <TouchableOpacity 
                                activeOpacity={0.7} 
                                style={styles.reviewAction}
                                onPress={() => {
                                    router.push(`/(courses)/completed-courses-detail`);
                                }}
                            >
                                <Typography variant="bodyBase" color={colors.secondary} style={styles.reviewText}>
                                    Xem lại kiến thức
                                </Typography>
                                <Icon name="RefreshCw" size={18} color={colors.secondary} />
                            </TouchableOpacity>
                        </View>
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
        marginBottom: 10,
    },
    backButton: { padding: 4 },
    headerTitle: { fontWeight: '700' },
    searchContainer: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    searchInput: {
        fontSize: 14,
        fontFamily: 'BeVietnamPro-Regular',
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
        overflow: 'hidden', 
        paddingBottom: 25, // Tăng padding bottom một chút để nút có không gian thở
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    courseImage: {
        width: '60%', // Tăng độ rộng ảnh ra một chút cho giống thiết kế
        height: 140,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 8, // Hình banner sách thường bo góc ít hơn card
    },
    infoContainer: {
        paddingHorizontal: 25,
        marginTop: 15,
        alignItems: 'center', // Căn giữa tất cả nội dung bên trong
    },
    courseTitle: {
        textAlign: 'center',
        marginBottom: 6,
    },
    completionDate: {
        textAlign: 'center',
        marginBottom: 16,
    },
    reviewAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8, // Khoảng cách giữa chữ và icon
    },
    reviewText: {
        fontWeight: '600',
    }
});