import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icon';
import { ButtonCTA } from '@/components/ui/ButtonCTA';

const MOCK_WORDS = [
  {
    id: 1,
    word: 'Resilient',
    pronunciation: '/rɪˈzɪliənt/',
    type: '(adj)',
    meaning: 'Kiên cường, mau hồi phục',
    example: '"She is a resilient girl"',
    image: 'https://images.squarespace-cdn.com/content/v1/62c2bd3a72f37e3fad345df6/1662992889341-LGV54BO9FC1CJ4EOTXX5/image-asset.jpeg'
  },
  {
    id: 2,
    word: 'Meticulous',
    pronunciation: '/məˈtɪkjələs/',
    type: '(adj)',
    meaning: 'Tỉ mỉ, quá kỹ càng',
    example: '"He is very meticulous about his work"',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    word: 'Serendipity',
    pronunciation: '/ˌserənˈdɪpəti/',
    type: '(noun)',
    meaning: 'Sự tình cờ, may mắn',
    example: '"Finding this book was pure serendipity"',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    word: 'Eloquent',
    pronunciation: '/ˈeləkwənt/',
    type: '(adj)',
    meaning: 'Có tài hùng biện, hùng hồn',
    example: '"She made an eloquent speech"',
    image: 'https://www.shutterstock.com/image-vector/debate-speakers-on-world-map-260nw-549491392.jpg'
  },
  {
    id: 5,
    word: 'Ephemeral',
    pronunciation: '/ɪˈfemərəl/',
    type: '(adj)',
    meaning: 'Phù du, chóng tàn',
    example: '"Fame is often ephemeral"',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 6,
    word: 'Luminous',
    pronunciation: '/ˈluːmɪnəs/',
    type: '(adj)',
    meaning: 'Sáng chói, lấp lánh',
    example: '"The stars were luminous in the sky"',
    image: 'https://img.freepik.com/hinh-chup-cao-cap/mot-ngoi-sao-sang-choi-tren-bau-troi-dem-toi-voi-nhung-tia-sang-va-lap-lanh_14117-94712.jpg'
  },
  {
    id: 7,
    word: 'Enigmatic',
    pronunciation: '/ˌenɪɡˈmætɪk/',
    type: '(adj)',
    meaning: 'Bí ẩn, khó hiểu',
    example: '"He has an enigmatic smile"',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 8,
    word: 'Vibrant',
    pronunciation: '/ˈvaɪbrənt/',
    type: '(adj)',
    meaning: 'Sôi động, rực rỡ',
    example: '"The city is vibrant with life"',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 9,
    word: 'Tranquil',
    pronunciation: '/ˈtræŋkwɪl/',
    type: '(adj)',
    meaning: 'Yên bình, thanh tĩnh',
    example: '"We enjoyed a tranquil sunset"',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 10,
    word: 'Diligent',
    pronunciation: '/ˈdɪlɪdʒənt/',
    type: '(adj)',
    meaning: 'Siêng năng, cần cù',
    example: '"She is a diligent student"',
    image: 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?q=80&w=600&auto=format&fit=crop'
  }
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function LearnNewWordScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const insets = useSafeAreaInsets();

  const [shuffledWords, setShuffledWords] = useState(() => shuffleArray(MOCK_WORDS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentWord = shuffledWords[currentIndex];

  const [isFlipped, setIsFlipped] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [hasFlippedThisWord, setHasFlippedThisWord] = useState(false);
  const [exitAction, setExitAction] = useState<any>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    setHasFlippedThisWord(true);
    if (isFlipped) {
      Animated.spring(flipAnim, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnim, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    backfaceVisibility: 'hidden' as const,
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    backfaceVisibility: 'hidden' as const,
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ rotateY: backInterpolate }],
  };

  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (isCompleted || exitAction) {
        return;
      }
      e.preventDefault();
      setExitAction(e.data.action);
      setShowExitModal(true);
    });
    return unsub;
  }, [navigation, isCompleted, exitAction]);

  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (exitAction) {
      navigation.dispatch(exitAction);
    } else {
      router.back();
    }
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
    setExitAction(null);
  };

  const handleNext = () => {
    if (!hasFlippedThisWord) {
      setShowWarningModal(true);
      return;
    }

    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
      setIsSaved(false);
      setHasFlippedThisWord(false);
      flipAnim.setValue(0);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setShuffledWords(shuffleArray(MOCK_WORDS));
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsSaved(false);
    setIsCompleted(false);
    setHasFlippedThisWord(false);
    flipAnim.setValue(0);
  };

  // Màn hình hoàn thành bài học (Hình 3)
  if (isCompleted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        
        <View style={styles.completionContent}>
          {/* Icon cúp */}
          <View style={styles.trophyContainer}>
            <View style={[styles.trophyCircle, { backgroundColor: colors.surfaceGreen }]}>
              <Ionicons name="trophy" size={80} color={colors.primary} />
              <FontAwesome5 name="star" solid size={20} color={colors.warning} style={styles.star1} />
              <FontAwesome5 name="star" solid size={16} color={colors.warning} style={styles.star2} />
              <FontAwesome5 name="star" solid size={24} color={colors.warning} style={styles.star3} />
            </View>
          </View>

          <Typography variant="h2" color={colors.textPrimary} style={styles.completionTitle}>
            Chúc mừng bạn đã hoàn{'\n'}thành bài học!
          </Typography>

          <View style={[styles.pillContainer, { backgroundColor: colors.surfaceGreen }]}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Typography variant="bodySmall" color={colors.primary} style={{ marginLeft: 6 }}>
              10/10 từ mới đã học
            </Typography>
          </View>

          {/* Placeholder cho Mascot con rồng */}
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3426/3426653.png' }}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.completionBottomArea, { backgroundColor: colors.surfaceGreen, paddingBottom: Math.max(insets.bottom, 20) }]}>
          <ButtonCTA 
            title="Học tiếp bài mới" 
            onPress={handleRestart} 
            style={{ marginBottom: 12 }} 
          />
          <TouchableOpacity 
            style={[styles.outlineButtonBase, { borderColor: colors.border, backgroundColor: colors.surface }]}
            onPress={() => router.back()}
          >
            <Typography variant="buttonCTA" color={colors.textPrimary}>Về trang chủ</Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8) }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Typography variant="h2" color={colors.textPrimary} style={styles.headerTitle}>Học từ mới</Typography>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextRow}>
          <Typography variant="bodySmall" color={colors.textSecondary}>Tiến độ bài học</Typography>
          <View style={[styles.progressBadge, { backgroundColor: colors.surfaceGreen }]}>
            <Typography variant="caption" color={colors.primary}>{currentIndex + 1}/{MOCK_WORDS.length}</Typography>
          </View>
        </View>
        <View style={[styles.progressBarTrack, { backgroundColor: colors.surfaceGreen }]}>
          <View style={[styles.progressBarFill, { backgroundColor: colors.primary, width: `${((currentIndex + 1) / MOCK_WORDS.length) * 100}%` }]} />
        </View>
      </View>

      {/* Flashcard */}
      <View style={styles.cardContainerWrapper}>
        {/* --- MẶT TRƯỚC THẺ (Hình 1) --- */}
        <Animated.View pointerEvents={isFlipped ? 'none' : 'auto'} style={[styles.cardContainer, frontAnimatedStyle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.cardHeartIcon} onPress={() => setIsSaved(!isSaved)}>
            <Ionicons name={isSaved ? "heart" : "heart-outline"} size={24} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} style={styles.cardFrontContent} onPress={flipCard}>
            <View style={styles.cardCenterContent}>
              <Typography variant="h1" color={colors.textPrimary} style={{ marginBottom: 8 }}>{currentWord.word}</Typography>
              
              <View style={styles.pronounceRow}>
                <Typography variant="bodyBase" color={colors.primary}>{currentWord.pronunciation} </Typography>
                <Typography variant="bodyBase" color={colors.textSecondary} style={{ fontStyle: 'italic' }}>{currentWord.type}</Typography>
                <TouchableOpacity style={[styles.audioButton, { backgroundColor: colors.primary }]}>
                  <Ionicons name="volume-high" size={20} color={colors.textOnAction} />
                </TouchableOpacity>
              </View>

              <View style={styles.fingerprintContainer}>
                <Ionicons name="finger-print-outline" size={48} color={colors.disabled} />
                <Typography variant="bodySmall" color={colors.disabled} style={{ marginTop: 8, textTransform: 'uppercase' }}>
                  Chạm để lật thẻ
                </Typography>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.cardActionsRow}>
            <TouchableOpacity style={[styles.cardActionButton, { borderColor: colors.primary }]} onPress={() => setIsSaved(!isSaved)}>
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={20} color={colors.primary} />
              <Typography variant="bodyBase" color={colors.primary} style={{ marginLeft: 8 }}>Lưu từ</Typography>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cardActionButton, { borderColor: colors.textSecondary }]} onPress={flipCard}>
              <MaterialCommunityIcons name="cards-playing-outline" size={20} color={colors.textPrimary} />
              <Typography variant="bodyBase" color={colors.textPrimary} style={{ marginLeft: 8 }}>Lật thẻ</Typography>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* --- MẶT SAU THẺ (Hình 2) --- */}
        <Animated.View pointerEvents={isFlipped ? 'auto' : 'none'} style={[styles.cardContainer, backAnimatedStyle, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <TouchableOpacity style={styles.cardHeartIcon} onPress={() => setIsSaved(!isSaved)}>
            <Ionicons name={isSaved ? "heart" : "heart-outline"} size={24} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.cardBackContentWrapper}>
            <Image 
              source={{ uri: currentWord.image }} 
              style={styles.cardImage} 
            />
            
            <View style={styles.cardBackContent}>
              <Typography variant="h2" color={colors.textPrimary}>{currentWord.word}</Typography>
              
              <View style={styles.pronounceRowLeft}>
                <Typography variant="bodyBase" color={colors.primary}>{currentWord.pronunciation} </Typography>
                <Typography variant="bodyBase" color={colors.textSecondary} style={{ fontStyle: 'italic' }}>{currentWord.type}</Typography>
                <TouchableOpacity style={[styles.audioButton, { backgroundColor: colors.primary, marginLeft: 12 }]}>
                  <Ionicons name="volume-high" size={16} color={colors.textOnAction} />
                </TouchableOpacity>
              </View>

              <Typography variant="caption" color={colors.disabled} style={styles.meaningLabel}>NGHĨA CỦA TỪ</Typography>
              <Typography variant="bodyLarge" color={colors.textPrimary} style={{ marginBottom: 16 }}>
                {currentWord.meaning}
              </Typography>

              <View style={[styles.exampleBox, { borderLeftColor: colors.primary, backgroundColor: colors.surfaceAlt }]}>
                <Typography variant="caption" color={colors.textSecondary} style={{ marginBottom: 4 }}>ví dụ</Typography>
                <Typography variant="bodyBase" color={colors.textPrimary} style={{ fontStyle: 'italic' }}>
                  {currentWord.example}
                </Typography>
              </View>
            </View>
          </View>

          <View style={styles.cardActionsRow}>
            <TouchableOpacity style={[styles.cardActionButton, { borderColor: colors.primary }]} onPress={() => setIsSaved(!isSaved)}>
              <Ionicons name={isSaved ? "heart" : "heart-outline"} size={20} color={colors.primary} />
              <Typography variant="bodyBase" color={colors.primary} style={{ marginLeft: 8 }}>Lưu từ</Typography>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cardActionButton, { borderColor: colors.textSecondary }]} onPress={flipCard}>
              <MaterialCommunityIcons name="cards-playing-outline" size={20} color={colors.textPrimary} />
              <Typography variant="bodyBase" color={colors.textPrimary} style={{ marginLeft: 8 }}>Lật thẻ</Typography>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Tiếp theo */}
      <View style={[styles.bottomArea, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <ButtonCTA 
          title={currentIndex === MOCK_WORDS.length - 1 ? "Hoàn thành" : "Tiếp theo"} 
          onPress={handleNext} 
        />
      </View>

      {/* Modal Thoát (Hình 4) */}
      <Modal visible={showExitModal} transparent={true} animationType="fade" onRequestClose={handleCancelExit}>
        <View style={[styles.modalOverlay, { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: colors.surfacePink }]}>
              <Icon name="AlertTriangle" size={32} color={colors.danger} />
            </View>
            <Typography variant="h2" color={colors.textPrimary} style={styles.modalTitle}>Xác nhận thoát</Typography>
            <Typography variant="bodyBase" color={colors.textSecondary} style={styles.modalText}>
              Bạn có chắc chắn muốn thoát? Kết quả học từ mới sẽ không được lưu.
            </Typography>
            
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={[styles.modalCancelBtn, { borderColor: colors.border }]} onPress={handleCancelExit}>
                <Typography variant="buttonCTA" color={colors.textPrimary}>Hủy</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalExitBtn, { backgroundColor: colors.danger }]} onPress={handleConfirmExit}>
                <Typography variant="buttonCTA" color={'#FFFFFF'}>Thoát</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Cảnh báo */}
      <Modal visible={showWarningModal} transparent={true} animationType="fade" onRequestClose={() => setShowWarningModal(false)}>
        <View style={[styles.modalOverlay, { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: colors.surfacePink }]}>
              <Ionicons name="close-outline" size={32} color={colors.danger} />
            </View>
            <Typography variant="h2" color={colors.textPrimary} style={styles.modalTitle}>Cảnh báo</Typography>
            <Typography variant="bodyBase" color={colors.textSecondary} style={[styles.modalText, { marginBottom: 16 }]}>
              Bạn cần phải lật thẻ để xem nghĩa của từ mới được tiếp tục qua từ tiếp theo.
            </Typography>
            
            <View style={{ width: '100%', alignItems: 'center' }}>
              <TouchableOpacity 
                style={[styles.primaryButton, { backgroundColor: colors.danger, paddingHorizontal: 48, paddingVertical: 12, borderRadius: 16 }]} 
                onPress={() => setShowWarningModal(false)}
              >
                <Typography variant="buttonCTA" color={'#FFFFFF'}>Ok</Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  textWhite: {
    color: Colors.light.textOnAction,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: Colors.light.textPrimary,
  },
  // Progress
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBadge: {
    backgroundColor: Colors.light.surfaceGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: Colors.light.surfaceGreen,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  // Card Common
  cardContainerWrapper: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  cardContainer: {
    flex: 1,
    borderRadius: 32,
    borderWidth: 1,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContentWrapper: {
    flex: 1,
  },
  cardHeartIcon: {
    position: 'absolute',
    top: 24,
    right: 24,
    zIndex: 10,
  },
  // Card Front
  cardFront: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFrontContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardCenterContent: {
    alignItems: 'center',
  },
  pronounceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  audioButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  fingerprintContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  // Card Back
  cardBackContentWrapper: {
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  cardBackContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  pronounceRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  meaningLabel: {
    color: Colors.light.disabled,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  exampleBox: {
    borderLeftWidth: 3,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  // Card Actions
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cardActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 24,
  },
  // Bottom Area
  bottomArea: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: Colors.light.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.surfacePink,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.light.textPrimary,
    marginBottom: 12,
  },
  modalText: {
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelBtn: {
    flex: 0.48,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalExitBtn: {
    flex: 0.48,
    backgroundColor: Colors.light.danger,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  // Completion Screen
  completionContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  trophyContainer: {
    marginBottom: 24,
  },
  trophyCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.light.surfaceGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  star1: { position: 'absolute', top: 10, left: 20 },
  star2: { position: 'absolute', bottom: 20, left: 15 },
  star3: { position: 'absolute', bottom: 10, right: 20 },
  completionTitle: {
    textAlign: 'center',
    color: Colors.light.textPrimary,
    marginBottom: 16,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceGreen,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 32,
  },
  mascotImage: {
    width: 120,
    height: 120,
  },
  completionBottomArea: {
    backgroundColor: Colors.light.surfaceGreen,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  outlineButtonBase: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
});