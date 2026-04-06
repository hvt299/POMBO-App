import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { CategoryCard } from '@/components/features/notebook/CategoryCard';

export default function NotebookScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            {/* Header Customize */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="ChevronLeft" size={28} />
                </TouchableOpacity>
                <Typography variant="h2" style={styles.headerTitle}>
                    Sổ tay của bạn
                </Typography>
                <View style={{ width: 28 }} /> 
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Search Bar & Button Row */}
                <View style={styles.searchRow}>
                    {/* Bọc thanh search bằng TouchableOpacity để nhận sự kiện nhấn */}
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        style={[
                            styles.searchBar, 
                            { backgroundColor: colors.surface, borderColor: colors.border }
                        ]}
                        onPress={() => router.push('/notebook/search')} // Điều hướng sang màn hình search
                    >
                        {/* Thêm Icon kính lúp cho giống UI search thực tế */}
                        <Icon name="Search" size={18} color={colors.textSecondary} />
                        
                        <Typography 
                            variant="caption" 
                            color={colors.textSecondary} 
                            style={{ marginLeft: 8, flex: 1 }}
                        >
                            tìm kiếm từ vựng trong sổ tay
                        </Typography>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.saveBtn, { backgroundColor: colors.disabled }]} 
                        disabled
                    >
                        <Typography variant="tiny" color={colors.textSecondary}>
                            Lưu thay đổi
                        </Typography>
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                <View style={styles.categoryList}>
                    <CategoryCard 
                        title="Từ vựng đang ôn tập"
                        image={require('@/assets/images/dragon-nobg.png')} 
                        borderColor={colors.primary}
                        onPress={() => /*router.push('/notebook/review')*/{}}
                    />

                    <CategoryCard 
                        title="Từ vựng đang ngủ đông"
                        image={require('@/assets/images/dragon-nobg.png')} 
                        borderColor={colors.secondary}
                        onPress={() =>/* router.push('/notebook/hibernating')*/ {}}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: { flex: 1, textAlign: 'center' },
    container: { paddingHorizontal: 24, paddingTop: 10 },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    saveBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryList: { marginTop: 10 }
});