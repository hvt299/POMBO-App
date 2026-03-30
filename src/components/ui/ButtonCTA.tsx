import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

interface ButtonCTAProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export const ButtonCTA = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style
}: ButtonCTAProps) => {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const getBackgroundColor = () => {
        if (disabled) return colors.disabled;
        if (variant === 'outline') return 'transparent';
        if (variant === 'secondary') return colors.secondary;
        return colors.primary;
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && { borderWidth: 2, borderColor: colors.primary },
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color="#FFF" />
            ) : (
                <Typography
                    variant="buttonCTA"
                    color={variant === 'outline' ? colors.primary : colors.textOnAction}
                >
                    {title}
                </Typography>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});