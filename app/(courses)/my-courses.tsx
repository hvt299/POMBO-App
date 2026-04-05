import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyCoursesScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    // Dữ liệu mẫu cho các mục
    const courseCategories = [
        {
            id: 'ongoing-courses',
            title: 'Khóa học đang học',
            borderColor: colors.primary,
            icon: require('@/assets/images/dragon-nobg.png'),
        },
        {
            id: 'completed-courses',
            title: 'Khóa học đã hoàn thành',
            borderColor: colors.secondary,
            icon: require('@/assets/images/dragon-nobg.png'),
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header Area */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>

                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Khóa học của bạn
                </Typography>

                {/* View trống để căn giữa title */}
                <View style={{ width: 28 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {courseCategories.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.7}
                        style={[
                            styles.card,
                            {
                                borderColor: item.borderColor,
                                backgroundColor: colors.surface
                            }
                        ]}
                        onPress={() => {
                            // Điều hướng tùy theo id
                            router.push(`/${item.id}`)
                        }}
                    >
                        <Image
                            source={item.icon}
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <Typography variant="h3" color={colors.textPrimary} style={styles.cardText}>
                            {item.title}
                        </Typography>
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
        paddingBottom: 20,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        textAlign: 'center',
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        gap: 24, // Khoảng cách giữa các card
    },
    card: {
        width: '100%',
        aspectRatio: 1.4, // Tạo hình chữ nhật bo góc như mẫu
        borderRadius: 32,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow cho card
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    image: {
        width: '80%',
        height: '80%',
    },
    cardText: {
        fontSize: 18,
        fontWeight: '600',
    },
});