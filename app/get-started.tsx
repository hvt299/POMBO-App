import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@/components/ui/Typography';
import { ButtonCTA } from '@/components/ui/ButtonCTA';
import { useAuthStore } from '@/store/useAuthStore';

const steps = [
    { title: "Chào mừng tới POMBO", desc: "Ứng dụng học tiếng Anh vui nhộn." },
    { title: "Học qua Mini Games", desc: "Chơi game cực đỉnh, từ vựng lên trình." },
    { title: "Mục tiêu TOEIC 600", desc: "Chúng tôi sẽ đồng hành cùng bạn!" }
];

export default function GetStarted() {
    const [currentStep, setCurrentStep] = useState(0);
    const completeOnboarding = useAuthStore(state => state.completeOnboarding);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            completeOnboarding();
        }
    };

    return (
        <View style={styles.container}>
            <Typography variant="h1">{steps[currentStep].title}</Typography>
            <Typography variant="bodyBase">{steps[currentStep].desc}</Typography>

            <View style={styles.footer}>
                <ButtonCTA title={currentStep === 2 ? "Bắt đầu ngay" : "Tiếp tục"} onPress={handleNext} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
    footer: { position: 'absolute', bottom: 50, width: '100%' }
});