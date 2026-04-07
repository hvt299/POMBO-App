import React, { useState, useEffect, useMemo } from 'react';
import { 
    View, StyleSheet, ScrollView, SafeAreaView, 
    TouchableOpacity, useColorScheme, TextInput 
} from 'react-native';
import { useRouter, Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; 
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { VocabularyItem, VocabularyData } from './VocabularyItem';
import { EmptyState } from './EmptyState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NotebookListBaseProps {
    title: string;
    initialData: VocabularyData[];
    themeColor: string; 
}

export const NotebookListBase = ({ title, initialData, themeColor }: NotebookListBaseProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const [activeLevel, setActiveLevel] = useState(1);
    const [results, setResults] = useState<VocabularyData[]>(initialData);
    // State này dùng để giữ bản sao dữ liệu gốc đã được lưu
    const [savedData, setSavedData] = useState<VocabularyData[]>(initialData);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Mảng màu theo mức độ được lấy trực tiếp từ theme
    const LEVEL_THEME_COLORS = useMemo(() => [
        colors.danger,     // Level 1
        colors.warning,    // Level 2
        colors.secondary,  // Level 3
        colors.primary,    // Level 4
        colors.rankMaster, // Level 5
    ], [colors]);

    // Hàm tạo dải gradient từ màu solid sang trong suốt
    const getLevelGradients = (level: number) => {
        const baseColor = LEVEL_THEME_COLORS[level - 1];
        return [baseColor, `${baseColor}00`] as const; // Thêm '00' vào mã Hex để tạo trong suốt
    };

    // Đồng bộ lại savedData khi initialData thay đổi (ví dụ khi load từ API)
    useEffect(() => {
        setResults(initialData);
        setSavedData(initialData);
    }, [initialData]);

    const filteredData = useMemo(() => {
        return results.filter(item => {
            const matchLevel = item.level === activeLevel;
            const matchSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase());
            return matchLevel && matchSearch;
        });
    }, [results, activeLevel, searchQuery]);

    // So sánh kết quả hiện tại với bản "Đã lưu gần nhất"
    const hasChanges = useMemo(() => {
        return results.some(item => {
            const original = savedData.find(o => o.id === item.id);
            return original ? item.isReviewing !== original.isReviewing : false;
        });
    }, [results, savedData]);

    const toggleStatus = (id: string) => {
        setResults(prev => prev.map(item => 
            item.id === id ? { ...item, isReviewing: !item.isReviewing } : item
        ));
    };

    const handleSave = () => {
        // Giả lập lưu thành công
        console.log("Đã lưu trạng thái mới");
        setSavedData([...results]); // Cập nhật bản lưu gốc để nút Lưu tắt đi
        setIsSelectionMode(false);
        // Ở đây bạn nên gọi thêm API để lưu vào Database/Server thực tế
    };

    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            
            {/* Header */}
            <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 20), backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => router.back()}><Icon name="ChevronLeft" size={28} color={colors.textPrimary} /></TouchableOpacity>
                <Typography variant="h2" style={[styles.headerTitle, { color: colors.textPrimary }]}>{title}</Typography>
                <View style={{ width: 28 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.actionRow}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Icon name="Search" size={18} color={themeColor} />
                    <TextInput 
                        placeholder="tìm kiếm..."
                        placeholderTextColor={colors.textSecondary}
                        style={[styles.searchInput, { color: colors.textPrimary }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.saveBtn, { backgroundColor: hasChanges ? colors.secondary : colors.disabled }]}
                    disabled={!hasChanges}
                    onPress={handleSave}
                >
                    <Typography variant="tiny" color={hasChanges ? '#fff' : colors.textSecondary}>Lưu</Typography>
                </TouchableOpacity>
            </View>

            {/* UI Level Bar chuẩn theo theme */}
            <View style={styles.levelWrapper}>
                {/* Thanh màu phía trên */}
                <View style={styles.topBarContainer}>
                    {LEVEL_THEME_COLORS.map((color, idx) => (
                        <View key={idx} style={[styles.colorSegment, { backgroundColor: color }]} />
                    ))}
                </View>

                {/* Các nút Mức độ */}
                <View style={styles.levelContainer}>
                    {[1, 2, 3, 4, 5].map((lvl) => {
                        const isActive = activeLevel === lvl;
                        return (
                            <TouchableOpacity 
                                key={lvl} 
                                onPress={() => { setActiveLevel(lvl); setIsSelectionMode(false); }}
                                style={styles.levelTab}
                            >
                                {isActive && (
                                    <LinearGradient
                                        // Sử dụng hàm getLevelGradients để tự động lấy từ theme
                                        colors={getLevelGradients(lvl)}
                                        style={StyleSheet.absoluteFill}
                                    />
                                )}
                                <Typography 
                                    variant="tiny" 
                                    style={[
                                        styles.levelText, 
                                        { color: colors.textPrimary }, 
                                        isActive && { fontWeight: 'bold' }
                                    ]}
                                >
                                    Mức độ {lvl}
                                </Typography>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <VocabularyItem 
                            key={item.id}
                            data={item}
                            isSelectionMode={isSelectionMode}
                            onLongPress={() => { setIsSelectionMode(true); toggleStatus(item.id); }}
                            onSelect={() => toggleStatus(item.id)}
                            statusColor={themeColor}
                        />
                    ))
                ) : (
                    <EmptyState message={searchQuery ? "Không tìm thấy từ" : "Mức độ này chưa có từ"} />
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 10,
        zIndex: 10,
    },
    headerTitle: { flex: 1, textAlign: 'center' },
    actionRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 10, marginBottom: 20 },
    searchBar: { flex: 1, height: 44, borderRadius: 22, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
    saveBtn: { height: 44, paddingHorizontal: 20, borderRadius: 15, justifyContent: 'center' },
    
    // Style cho Level Bar
    levelWrapper: { marginHorizontal: 20, marginBottom: 20 },
    topBarContainer: { 
        flexDirection: 'row', 
        height: 4, 
        borderRadius: 2, 
        overflow: 'hidden', 
        gap: 0 
    },
    colorSegment: { flex: 1 },
    levelContainer: { 
        flexDirection: 'row', 
        height: 60,
        gap: 0 
    },
    levelTab: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'relative',
        top: -1,
        padding: 0 
    },
    levelText: { zIndex: 1 },

    scrollContent: { paddingHorizontal: 24, paddingBottom: 40 }
});