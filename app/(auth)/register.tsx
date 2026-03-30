import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';

export default function RegisterScreen() {
    return (
        <View style={styles.container}>
            <Typography variant="h2">Đăng ký</Typography>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});