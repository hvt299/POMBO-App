import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSpring } from 'react-native-reanimated';

const PACKS = [
    { id: 'x50', title: 'Gói Đặc Quyền', amount: 'X50', originalPrice: '5.000', price: '2.500', discount: '-50%', isFeatured: true, label: 'SIÊU LỜI' },
    { id: 'x5', title: 'Gói Khởi Động', amount: 'X5', originalPrice: null, price: '300', discount: null, subLabel: 'Bốc thử xem sao' },
    { id: 'x10', title: 'Gói Cơ Bản', amount: 'X10', originalPrice: '700', price: '500', discount: '-28%', isHot: true, label: 'HOT' },
    { id: 'x15', title: 'Gói Tiêu Chuẩn', amount: 'X15', originalPrice: '1.200', price: '900', discount: '-25%' },
    { id: 'x20', title: 'Gói Nâng Cao', amount: 'X20', originalPrice: '1.500', price: '1.100', discount: '-26%' },
];

export default function VocabPackagesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const insets = useSafeAreaInsets();

    const categoryName = params.categoryName || 'Du lịch';
    const [balances, setBalances] = useState({ coin: 1255, gem: 5000 });

    const [showAnimation, setShowAnimation] = useState(false);
    const [rewardAmount, setRewardAmount] = useState('');

    const featuredPack = PACKS.find(p => p.isFeatured);
    const normalPacks = PACKS.filter(p => !p.isFeatured);

    const storeColor = colors.primary;

    const rotation = useSharedValue(0);
    const scale = useSharedValue(0);

    const startAnimation = () => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 6000, easing: Easing.linear }),
            -1, false
        );
        scale.value = withSpring(1, { damping: 12, stiffness: 90 });
    };

    const stopAnimation = () => {
        rotation.value = 0;
        scale.value = 0;
    };

    const handlePurchase = (pack: any) => {
        setRewardAmount(pack.amount);
        setShowAnimation(true);
        startAnimation();

        setTimeout(() => {
            setShowAnimation(false);
            stopAnimation();
            setBalances(prev => ({
                ...prev,
                coin: prev.coin - parseInt(pack.price.replace(/\./g, ''))
            }));
        }, 2500);
    };

    const animatedRaysStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
    }));

    const animatedIconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const SunburstRays = () => {
        const rayCount = 12;
        return (
            <Animated.View style={[styles.raysContainer, animatedRaysStyle]}>
                {Array.from({ length: rayCount }).map((_, i) => (
                    <View
                        key={i}
                        style={[styles.rayItem, { transform: [{ rotate: `${(360 / rayCount) * i}deg` }] }]}
                    />
                ))}
            </Animated.View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background, paddingBottom: insets.bottom }}>

            {/* HEADER */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Icon name="ChevronLeft" size={28} color={colors.textPrimary} />
                </TouchableOpacity>
                <View style={styles.headerTitleWrapper}>
                    <Typography variant="h2" color={colors.textPrimary}>Gói từ vựng</Typography>
                </View>

                {/* Balances */}
                <View style={styles.miniBalances}>
                    <View style={[styles.miniBalancePill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Icon name="Coins" size={14} color={colors.warning} />
                        <Typography variant="tiny" color={colors.textPrimary} style={{ marginLeft: 4, fontFamily: 'BeVietnamPro-Bold' }}>{balances.coin.toLocaleString()}</Typography>
                    </View>
                    <View style={[styles.miniBalancePill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Icon name="Gem" size={14} color={colors.rankMaster} />
                        <Typography variant="tiny" color={colors.textPrimary} style={{ marginLeft: 4, fontFamily: 'BeVietnamPro-Bold' }}>{balances.gem.toLocaleString()}</Typography>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Typography variant="bodyBase" color={colors.textSecondary} style={{ marginBottom: 24 }}>
                    Chủ đề: <Typography variant="bodyBase" style={{ fontFamily: 'BeVietnamPro-Bold', color: colors.primary }}>{categoryName}</Typography>
                </Typography>

                {/* --- GÓI ĐẶC BIỆT --- */}
                {featuredPack && (
                    <TouchableOpacity
                        style={[styles.premiumCard, { backgroundColor: colors.surfaceGreen, borderColor: storeColor }]}
                        activeOpacity={0.8}
                        onPress={() => handlePurchase(featuredPack)}
                    >
                        <View style={styles.watermarkIcon}>
                            <Icon name="HelpCircle" size={160} color={storeColor} />
                        </View>

                        <View style={[styles.premiumBadge, { backgroundColor: storeColor }]}>
                            <Icon name="Sparkles" size={14} color="#FFF" />
                            <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold', marginLeft: 4 }}>{featuredPack.label}</Typography>
                        </View>

                        <View style={styles.premiumBody}>
                            <View style={{ flex: 1, zIndex: 2 }}>
                                <Typography variant="h3" color={storeColor} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                                    {featuredPack.title}
                                </Typography>
                                <Typography variant="h1" style={{ color: storeColor, fontFamily: 'Baloo2-ExtraBold', fontSize: 44, lineHeight: 50 }}>
                                    {featuredPack.amount}
                                </Typography>
                                <Typography variant="bodySmall" color={colors.textPrimary} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                                    Từ vựng "{categoryName}"
                                </Typography>
                            </View>
                        </View>

                        {/* Nút thanh toán (Chỉ dùng Icon Coin) */}
                        <View style={[styles.premiumButton, { backgroundColor: storeColor }]}>
                            <View style={{ alignItems: 'center' }}>
                                {featuredPack.discount && (
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                                        <Typography variant="caption" style={{ textDecorationLine: 'line-through', color: 'rgba(255,255,255,0.7)', marginRight: 6 }}>{featuredPack.originalPrice}</Typography>
                                        <View style={{ backgroundColor: colors.danger, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                                            <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold', fontSize: 10 }}>{featuredPack.discount}</Typography>
                                        </View>
                                    </View>
                                )}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ marginRight: 6 }}><Icon name="Coins" size={18} color={colors.surfaceYellow} strokeWidth={2.5} /></View>
                                    <Typography variant="buttonCTA" color="#FFF">{featuredPack.price}</Typography>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                {/* --- LƯỚI GÓI BÌNH THƯỜNG --- */}
                <View style={styles.gridContainer}>
                    {normalPacks.map((pack) => (
                        <View key={pack.id} style={styles.col}>
                            <TouchableOpacity
                                style={[styles.packCard, { backgroundColor: colors.surface, borderColor: pack.isHot ? storeColor : colors.border }]}
                                activeOpacity={0.7}
                                onPress={() => handlePurchase(pack)}
                            >
                                <View style={[StyleSheet.absoluteFillObject, { borderRadius: 20, overflow: 'hidden' }]}>
                                    <View style={styles.watermarkIconMini}>
                                        <Icon name="HelpCircle" size={100} color={storeColor} />
                                    </View>
                                </View>

                                {pack.isHot && (
                                    <View style={[styles.hotBadge, { backgroundColor: storeColor }]}>
                                        <Typography variant="tiny" style={{ color: '#FFF', fontFamily: 'BeVietnamPro-Bold' }}>{pack.label}</Typography>
                                    </View>
                                )}

                                <View style={[styles.packIconWrapper, { backgroundColor: colors.surfaceGreen }]}>
                                    <Icon name="Package" size={32} color={storeColor} strokeWidth={2} />
                                </View>

                                <Typography variant="h3" color={colors.textPrimary} style={{ marginTop: 8 }}>
                                    {pack.amount.toLocaleString()}
                                </Typography>

                                <View style={[styles.discountWrapper, { marginVertical: 'auto' }]}>
                                    {pack.discount ? (
                                        <>
                                            <Typography variant="tiny" style={{ textDecorationLine: 'line-through', color: colors.textSecondary, marginRight: 6 }}>
                                                {pack.originalPrice}
                                            </Typography>
                                            <View style={[styles.discountBadge, { backgroundColor: colors.danger }]}>
                                                <Typography variant="tiny" style={{ color: '#FFF', fontSize: 9, fontFamily: 'BeVietnamPro-Bold' }}>
                                                    {pack.discount}
                                                </Typography>
                                            </View>
                                        </>
                                    ) : pack.subLabel ? (
                                        <Typography variant="tiny" style={{ color: storeColor, opacity: 0.8, fontFamily: 'BeVietnamPro-Medium', textAlign: 'center' }}>
                                            {pack.subLabel}
                                        </Typography>
                                    ) : null}
                                </View>

                                <View style={[styles.priceButton, { borderColor: storeColor, backgroundColor: colors.surface }]}>
                                    <View style={{ marginRight: 4 }}><Icon name="Coins" size={14} color={colors.warning} strokeWidth={2.5} /></View>
                                    <Typography variant="bodySmall" color={storeColor} style={{ fontFamily: 'BeVietnamPro-Bold' }}>
                                        {pack.price}
                                    </Typography>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* --- OVERLAY ANIMATION MUA THÀNH CÔNG --- */}
            <Modal visible={showAnimation} transparent animationType="fade">
                <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.85)' }]}>
                    <SunburstRays />

                    <Animated.View style={[styles.rewardIconWrapper, animatedIconStyle]}>
                        <Icon name="PackageOpen" size={140} color={storeColor} strokeWidth={1.5} />

                        <Typography variant="display" style={{ color: '#FFF', marginTop: 16, fontFamily: 'Baloo2-ExtraBold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 8 }}>
                            {rewardAmount}
                        </Typography>
                        <Typography variant="h2" style={{ color: colors.surfaceGreen }}>
                            Từ vựng mới!
                        </Typography>
                    </Animated.View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitleWrapper: { flex: 1, paddingLeft: 8 },
    miniBalances: { flexDirection: 'row', gap: 8 },
    miniBalancePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },

    scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

    premiumCard: { borderRadius: 24, borderWidth: 2, padding: 20, paddingTop: 32, marginBottom: 24, position: 'relative', overflow: 'hidden' },
    premiumBadge: { position: 'absolute', top: 0, left: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6, borderBottomRightRadius: 16, zIndex: 2 },
    premiumBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    premiumButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 16, zIndex: 2 },
    watermarkIcon: { position: 'absolute', right: -30, top: 0, opacity: 0.1, zIndex: 0 },

    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
    col: { width: '47%' },
    packCard: { borderRadius: 20, borderWidth: 1.5, padding: 12, alignItems: 'center', position: 'relative', height: 210 },
    packIconWrapper: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginTop: 4, zIndex: 2 },
    hotBadge: { position: 'absolute', top: -12, right: -10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, zIndex: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
    watermarkIconMini: { position: 'absolute', right: -20, top: 10, opacity: 0.05, zIndex: 0 },

    discountWrapper: { minHeight: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 2 },
    discountBadge: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 },
    priceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, marginTop: 'auto', zIndex: 2 },
    
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    raysContainer: { position: 'absolute', width: 1000, height: 1000, justifyContent: 'center', alignItems: 'center', opacity: 0.25 },
    rayItem: { position: 'absolute', width: 1000, height: 60, backgroundColor: '#FFFFFF' },
    rewardIconWrapper: { alignItems: 'center', justifyContent: 'center', zIndex: 10 }
});