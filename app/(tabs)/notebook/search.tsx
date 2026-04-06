import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, useColorScheme } from 'react-native';
import { useFocusEffect, useRouter, Tabs } from 'expo-router'; // Thêm Tabs để ẩn Bottom Bar
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { VocabularyItem, VocabularyData } from '@/components/features/notebook/VocabularyItem';
import { EmptyState } from '@/components/features/notebook/EmptyState';

// Dữ liệu mẫu ban đầu
const initialMockResults: VocabularyData[] = [
    { id: '1', word: 'resilient', type: 'adj', isReviewing: true, phonetic: '/rɪˈzɪl.jənt/', shortDefinition: 'kiên cường', detailedDefinition: 'Khả năng phục hồi nhanh chóng.', examples: ["She is resilient."] },
    { id: '2', word: 'optimistic', type: 'adj', isReviewing: false, phonetic: '/ˌɒp.tɪˈmɪs.tɪk/', shortDefinition: 'lạc quan', detailedDefinition: 'Tin vào điều tốt đẹp.', examples: ["Stay optimistic."] },
    { id: '3', word: 'consistent', type: 'adj', isReviewing: true, phonetic: '/kənˈsɪs.tənt/', shortDefinition: 'kiên định', detailedDefinition: 'Luôn giữ vững phong độ.', examples: ["Be consistent in learning."] },
    { id: '4', word: 'ambitious', type: 'adj', isReviewing: false, phonetic: '/æmˈbɪʃ.əs/', shortDefinition: 'tham vọng', detailedDefinition: 'Có ý chí tiến thủ lớn.', examples: ["An ambitious plan."] },
    { id: '5', word: 'discipline', type: 'n', isReviewing: true, phonetic: '/ˈdɪs.ə.plɪn/', shortDefinition: 'kỷ luật', detailedDefinition: 'Sự tự giác tuân thủ quy tắc.', examples: ["Self-discipline is key."] },
    { id: '6', word: 'versatile', type: 'adj', isReviewing: false, phonetic: '/ˈvɜː.sə.taɪl/', shortDefinition: 'linh hoạt', detailedDefinition: 'Nhiều công dụng, đa năng.', examples: ["A versatile tool."] },
    { id: '7', word: 'empathy', type: 'n', isReviewing: true, phonetic: '/ˈem.pə.θi/', shortDefinition: 'thấu cảm', detailedDefinition: 'Thấu hiểu cảm xúc người khác.', examples: ["Show some empathy."] },
    { id: '8', word: 'integrity', type: 'n', isReviewing: false, phonetic: '/ɪnˈteɡ.rə.ti/', shortDefinition: 'chính trực', detailedDefinition: 'Sự trung thực và đạo đức.', examples: ["A man of integrity."] },
    { id: '9', word: 'innovative', type: 'adj', isReviewing: true, phonetic: '/ˈɪn.ə.veɪ.tɪv/', shortDefinition: 'đột phá', detailedDefinition: 'Có tính sáng tạo mới mẻ.', examples: ["An innovative idea."] },
    { id: '10', word: 'patience', type: 'n', isReviewing: false, phonetic: '/ˈpeɪ.ʃəns/', shortDefinition: 'kiên nhẫn', detailedDefinition: 'Khả năng chờ đợi bình tĩnh.', examples: ["Patience is a virtue."] },
];

export default function SearchScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<VocabularyData[]>([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    // --- CÁC STATE MỚI ---
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    // ---------------------

    const textInputRef = useRef<TextInput>(null);

    useFocusEffect(
        useCallback(() => {
            const timer = setTimeout(() => {
                textInputRef.current?.focus();
            }, 150);
            return () => clearTimeout(timer);
        }, [])
    );

    // Logic đổi trạng thái Radio
    const toggleVocabularyStatus = (id: string) => {
        const updatedResults = results.map(item => {
            if (item.id === id) {
                return { ...item, isReviewing: !item.isReviewing };
            }
            return item;
        });
        setResults(updatedResults);
        setHasChanges(true); // Làm sáng nút Lưu thay đổi
    };

    // Kích hoạt chế độ chọn khi nhấn giữ
    const handleLongPress = (id: string) => {
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            toggleVocabularyStatus(id);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setHasChanges(false); // Reset trạng thái thay đổi khi search mới
        setIsSelectionMode(false); // Thoát chế độ chọn khi search mới

        if (query.length > 1) {
            setIsLoading(true);
            setTimeout(() => {
                const filteredResults = initialMockResults.filter(item => 
                    item.word.toLowerCase().includes(query.toLowerCase())
                );
                setResults(filteredResults);
                setIsLoading(false);
                setSearchPerformed(true);
            }, 500);
        } else {
            setResults([]);
            setSearchPerformed(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            );
        }

        if (searchQuery.length > 1 && results.length === 0 && searchPerformed) {
            return (
                <EmptyState 
                    message="Từ vựng này tôi không tìm thấy trong sổ tay của bạn, đừng lo lắng..."
                />
            );
        }

        if (results.length > 0) {
            return (
                <View style={styles.resultsList}>
                    {results.map((item) => (
                        <VocabularyItem 
                            key={item.id} 
                            data={item} 
                            isSelectionMode={isSelectionMode}
                            onLongPress={() => handleLongPress(item.id)}
                            onSelect={() => toggleVocabularyStatus(item.id)}
                            statusColor={item.isReviewing ? colors.primary : colors.secondary}
                        />
                    ))}
                </View>
            );
        }
        return null; 
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            {/* ẨN BOTTOM BAR */}
            <Tabs.Screen options={{ tabBarStyle: { display: 'none' } }} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Icon name="ChevronLeft" size={28} />
                </TouchableOpacity>
                <Typography variant="h2" style={styles.headerTitle}>
                    Sổ tay của bạn
                </Typography>
                <View style={{ width: 28 }} /> 
            </View>

            {/* Phần Tìm kiếm */}
            <View style={styles.searchSection}>
                <View style={[styles.searchRow]}>
                    <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.primary }]}>
                        <Icon name="Search" size={18} color={colors.primary} />
                        <TextInput
                            ref={textInputRef}
                            style={[styles.searchInput, { color: colors.textPrimary }]}
                            placeholder="từ cần tìm"
                            placeholderTextColor={colors.textSecondary}
                            value={searchQuery}
                            onChangeText={handleSearch}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => handleSearch('')}>
                                <Icon name="XCircle" size={18} color={colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <TouchableOpacity 
                        style={[
                            styles.saveBtn, 
                            { backgroundColor: hasChanges ? colors.secondary : colors.disabled }
                        ]} 
                        disabled={!hasChanges}
                        onPress={() => {
                            console.log("Lưu thay đổi:", results);
                            setHasChanges(false);
                            setIsSelectionMode(false);
                        }}
                    >
                        <Typography variant="tiny" color={hasChanges ? colors.textOnAction : colors.textSecondary}>
                            Lưu thay đổi
                        </Typography>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {renderContent()}
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
    container: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
    searchSection: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    searchInput: {
        flex: 1,
        height: '100%',
        marginLeft: 10,
        fontFamily: 'BeVietnamPro-Regular',
        fontSize: 14,
    },
    saveBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 100,
    },
    resultsList: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
});