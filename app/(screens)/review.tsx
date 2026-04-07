import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { ButtonCTA } from '@/components/ui/ButtonCTA';

type QuestionType = 'meaning' | 'fill_blank';

interface Option {
    id: string;
    text: string;
}

interface Question {
    id: number;
    type: QuestionType;
    title: string;
    subtitle?: string;
    content: string;
    options: Option[];
    correctAnswerId: string;
}

const MOCK_QUESTIONS: Question[] = [
    {
        id: 1,
        type: 'meaning',
        title: 'Chọn nghĩa đúng cho từ:',
        content: 'Persistence',
        options: [
            { id: 'A', text: 'Kiên trì' },
            { id: 'B', text: 'Lười biếng' },
            { id: 'C', text: 'Nhanh nhẹn' },
            { id: 'D', text: 'Thông minh' },
        ],
        correctAnswerId: 'A'
    },
    {
        id: 2,
        type: 'fill_blank',
        title: 'Điền vào chỗ trống',
        subtitle: 'Chọn từ đúng nhất để hoàn thành câu bên dưới',
        content: 'She is very _______ about her future.',
        options: [
            { id: 'A', text: 'worried' },
            { id: 'B', text: 'worrying' },
            { id: 'C', text: 'worry' },
        ],
        correctAnswerId: 'A'
    }
];

export default function ReviewScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();
    const { width } = Dimensions.get('window');

    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Thêm state quản lý hoàn thành và điểm số
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);

    const question = MOCK_QUESTIONS[currentIdx];
    const totalQuestions = MOCK_QUESTIONS.length;
    const progress = ((currentIdx + 1) / totalQuestions) * 100;

    const isCorrect = selectedOption === question?.correctAnswerId;

    const handleSubmit = () => {
        if (selectedOption) {
            setIsSubmitted(true);
            // Cộng điểm nếu trả lời đúng
            if (isCorrect) {
                setScore(prev => prev + 5);
            }
        }
    };

    const handleNext = () => {
        if (currentIdx < totalQuestions - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            // Hiển thị màn hình hoàn thành thay vì thoát ngay
            setIsFinished(true);
        }
    };

    const getOptionStyle = (optionId: string) => {
        const isSelected = selectedOption === optionId;
        
        if (!isSubmitted) {
            if (isSelected) return { borderColor: colors.primary, borderWidth: 2, badgeBg: colors.primary, badgeText: colors.textOnAction, textCol: colors.textPrimary };
            return { borderColor: colors.border, borderWidth: 1, badgeBg: colors.surfaceGreen, badgeText: colors.primary, textCol: colors.textPrimary };
        }

        const isThisCorrect = optionId === question.correctAnswerId;
        const isThisSelected = optionId === selectedOption;

        if (isThisCorrect) {
            return { borderColor: colors.primary, borderWidth: 2, badgeBg: colors.primary, badgeText: colors.textOnAction, textCol: colors.primary };
        }
        if (isThisSelected && !isThisCorrect) {
            return { borderColor: colors.danger, borderWidth: 2, badgeBg: colors.surfacePink, badgeText: colors.danger, textCol: colors.danger };
        }

        return { borderColor: colors.border, borderWidth: 1, badgeBg: colors.disabled, badgeText: colors.textSecondary, textCol: colors.textSecondary };
    };

    // --- GIAO DIỆN HOÀN THÀNH ---
    if (isFinished) {
        return (
            <View style={[styles.completionContainer, { backgroundColor: colors.background, paddingTop: Math.max(insets.top, 20) }]}>
                <View style={styles.completionContent}>
                    <View style={[styles.trophyBadge, { backgroundColor: colors.surfaceGreen }]}>
                        {/* Có thể thay 'Star' bằng 'Award' hoặc icon phù hợp trong thư viện của bạn */}
                        <Icon name="Star" size={64} color={colors.primary} />
                    </View>
                    
                    <Typography variant="h1" color={colors.primary} style={{ textAlign: 'center', marginBottom: 12, fontSize: 32 }}>
                        Tuyệt vời!
                    </Typography>
                    
                    <Typography variant="bodyBase" color={colors.textSecondary} style={{ textAlign: 'center', marginBottom: 40 }}>
                        Bạn đã hoàn thành xuất sắc bài ôn tập hôm nay.
                    </Typography>

                    <View style={[styles.scoreCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Typography variant="bodyBase" color={colors.textSecondary} style={{ fontFamily: 'Baloo2-Bold' }}>
                            TỔNG ĐIỂM
                        </Typography>
                        <Typography variant="display" color={colors.primary} style={{ fontSize: 48 }}>
                            {score}
                        </Typography>
                    </View>
                </View>

                <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <ButtonCTA
                        title="Trở về ngay"
                        onPress={() => router.back()}
                    />
                </View>
            </View>
        );
    }

    // --- GIAO DIỆN CÂU HỎI (GIỮ NGUYÊN) ---
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>
                    Ôn tập
                </Typography>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Typography variant="bodySmall" color={colors.textPrimary}>
                        Tiến độ bài học
                    </Typography>
                    <View style={[styles.progressBadge, { backgroundColor: colors.surfaceGreen }]}>
                        <Typography variant="caption" color={colors.primary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                            {`${currentIdx + 1}/${totalQuestions}`}
                        </Typography>
                    </View>
                </View>
                <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceGreen }]}>
                    <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${progress}%` }]} />
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {question.type === 'meaning' && (
                    <>
                        <Typography variant="h3" color={colors.textPrimary} style={{ textAlign: 'center', marginBottom: 16 }}>
                            {question.title}
                        </Typography>
                        
                        <Typography variant="display" color={colors.primary} style={{ textAlign: 'center', marginBottom: 40, fontSize: 32 }}>
                            {question.content}
                        </Typography>
                    </>
                )}

                {question.type === 'fill_blank' && (
                    <>
                        <Typography variant="h3" color={colors.textPrimary} style={{ textAlign: 'center', marginBottom: 4 }}>
                            {question.title}
                        </Typography>
                        {question.subtitle && (
                            <Typography variant="bodySmall" color={colors.primary} style={{ textAlign: 'center', marginBottom: 24, fontSize: 12 }}>
                                {question.subtitle}
                            </Typography>
                        )}
                        
                        <View style={[styles.fillBlankCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <View style={[styles.bookIconBadge, { backgroundColor: colors.surfaceGreen }]}>
                                <Icon name="BookOpen" size={20} color={colors.primary} />
                            </View>
                            <Typography variant="h3" color={colors.textPrimary} style={{ textAlign: 'center', lineHeight: 32 }}>
                                {question.content}
                            </Typography>
                        </View>
                    </>
                )}

                <View style={styles.optionsContainer}>
                    {question.options.map((option) => {
                        const styleInfo = getOptionStyle(option.id);
                        return (
                            <TouchableOpacity
                                key={option.id}
                                activeOpacity={0.8}
                                disabled={isSubmitted}
                                onPress={() => setSelectedOption(option.id)}
                                style={[
                                    styles.optionCard,
                                    { backgroundColor: colors.surface, borderColor: styleInfo.borderColor, borderWidth: styleInfo.borderWidth }
                                ]}
                            >
                                <View style={[styles.optionBadge, { backgroundColor: styleInfo.badgeBg }]}>
                                    <Typography variant="bodyBase" style={{ fontFamily: 'Baloo2-Bold', color: styleInfo.badgeText }}>
                                        {option.id}
                                    </Typography>
                                </View>
                                <Typography variant="h3" color={styleInfo.textCol} style={{ fontSize: 18, alignSelf: 'center', lineHeight: 28, flex: 1 }}>
                                    {option.text}
                                </Typography>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                
                <View style={{ height: 160 }} />
            </ScrollView>

            {!isSubmitted ? (
                <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <ButtonCTA
                        title="Gửi câu trả lời"
                        disabled={!selectedOption}
                        onPress={handleSubmit}
                    />
                </View>
            ) : (
                <View style={[
                    styles.resultBottomSheet,
                    { 
                        backgroundColor: isCorrect ? colors.surfaceGreen : colors.surfacePink,
                        paddingBottom: Math.max(insets.bottom, 20)
                    }
                ]}>
                    <View style={styles.resultHeader}>
                        <View style={[
                            styles.resultIconWrapper,
                            { backgroundColor: isCorrect ? colors.primary : colors.danger }
                        ]}>
                            <Icon name={isCorrect ? "Check" : "X"} size={24} color={colors.textOnAction} />
                        </View>
                        <View>
                            <Typography variant="h2" color={isCorrect ? colors.primary : colors.danger}>
                                {isCorrect ? "Chính xác!" : "Chưa đúng rồi!"}
                            </Typography>
                            <Typography variant="bodyBase" color={colors.textPrimary} style={{ fontFamily: 'Baloo2-Bold' }}>
                                {isCorrect ? "Bạn nhận được 5đ" : `Đáp án đúng là: ${question.correctAnswerId}`}
                            </Typography>
                        </View>
                    </View>
                    <ButtonCTA
                        title={isCorrect ? "Tiếp tục" : "Đã hiểu"}
                        onPress={handleNext}
                        style={{ backgroundColor: isCorrect ? colors.primary : colors.danger }}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    // Các style cũ giữ nguyên
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent',
        marginBottom: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    progressContainer: {
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    fillBlankCard: {
        borderRadius: 24,
        borderWidth: 1,
        padding: 24,
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    bookIconBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    optionsContainer: {
        gap: 16,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
    },
    optionBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 16,
        backgroundColor: 'transparent',
    },
    resultBottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 16,
    },
    resultIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // --- Style mới cho màn hình hoàn thành ---
    completionContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    completionContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    trophyBadge: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    scoreCard: {
        width: '100%',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
        gap: 8,
    },
});