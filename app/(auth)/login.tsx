import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const login = useAuthStore(state => state.login);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Hiển thị Logo chữ bằng Typography Baloo 2 */}
            <Typography variant="display" color={colors.primary}>POMBO</Typography>

            <View style={{ height: 10 }} />

            <Typography variant="h2" style={styles.subtitle}>Đăng nhập để tiếp tục</Typography>

            {/* Nút bấm này cực kỳ quan trọng để kích hoạt luồng vào App chính */}
            <ButtonCTA
                title="Đăng nhập ngay"
                onPress={() => {
                    login();
                }}
                style={styles.button}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    subtitle: {
        marginBottom: 40,
        textAlign: 'center'
    },
    button: {
        width: '100%',
    }
});