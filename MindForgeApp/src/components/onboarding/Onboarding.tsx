import React, { useState } from 'react';
import { View, Text, TextInput, Dimensions } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import Button from '../common/Button';

const { width } = Dimensions.get('window');

const steps = [
  {
    icon: '\u{1F9E0}',
    title: 'Welcome to MindForge',
    subtitle: 'Your personal cognitive training companion',
    description: 'Train your brain daily with scientifically-designed exercises that improve memory, focus, math skills, and more.',
  },
  {
    icon: '\u{1F4CA}',
    title: 'Track Your Progress',
    subtitle: 'Watch yourself improve over time',
    description: 'Detailed analytics show your strengths and areas for growth. Set daily goals and build streaks to stay motivated.',
  },
  {
    icon: '\u{1F4DA}',
    title: 'Daily Vocabulary',
    subtitle: 'Learn new words every day',
    description: 'Expand your vocabulary with curated words, definitions, and spaced repetition to ensure long-term retention.',
  },
  {
    icon: '\u{1F3C6}',
    title: 'Earn Achievements',
    subtitle: 'Challenge yourself and level up',
    description: 'Unlock achievements, earn XP, and compete with yourself. Every session makes you sharper.',
  },
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const { colors } = useTheme();
  const { completeOnboarding } = useUser();

  const isLastStep = step === steps.length;

  const handleComplete = () => {
    if (name.trim()) {
      completeOnboarding(name.trim());
    }
  };

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: colors.bg,
    }}>
      {!isLastStep ? (
        <>
          <Text style={{ fontSize: 80, marginBottom: 32 }}>
            {steps[step].icon}
          </Text>
          <Text style={{
            fontSize: 28,
            fontWeight: '800',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            {steps[step].title}
          </Text>
          <Text style={{
            fontSize: 16,
            color: colors.primary,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 16,
          }}>
            {steps[step].subtitle}
          </Text>
          <Text style={{
            fontSize: 15,
            color: colors.textSecondary,
            textAlign: 'center',
            maxWidth: 320,
            lineHeight: 24,
            marginBottom: 48,
          }}>
            {steps[step].description}
          </Text>

          {/* Dots */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 32 }}>
            {steps.map((_, i) => (
              <View key={i} style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === step ? colors.primary : colors.border,
              }} />
            ))}
          </View>

          <View style={{ flexDirection: 'row', gap: 12, width: '100%', maxWidth: 320 }}>
            {step > 0 && (
              <View style={{ flex: 1 }}>
                <Button variant="secondary" onPress={() => setStep(step - 1)} fullWidth>
                  Back
                </Button>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Button onPress={() => setStep(step + 1)} fullWidth size="large">
                {step === steps.length - 1 ? "Let's Go!" : 'Next'}
              </Button>
            </View>
          </View>
        </>
      ) : (
        <>
          <Text style={{ fontSize: 64, marginBottom: 24 }}>{'\u{1F44B}'}</Text>
          <Text style={{
            fontSize: 28,
            fontWeight: '800',
            color: colors.text,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            What's your name?
          </Text>
          <Text style={{
            fontSize: 15,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: 32,
          }}>
            We'll personalize your experience
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textTertiary}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => { if (name.trim()) handleComplete(); }}
            style={{
              width: '100%',
              maxWidth: 320,
              padding: 16,
              fontSize: 18,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: colors.border,
              backgroundColor: colors.bgSecondary,
              color: colors.text,
              textAlign: 'center',
              marginBottom: 24,
            }}
          />
          <View style={{ flexDirection: 'row', gap: 12, width: '100%', maxWidth: 320 }}>
            <View style={{ flex: 1 }}>
              <Button variant="secondary" onPress={() => setStep(step - 1)} fullWidth>
                Back
              </Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button onPress={handleComplete} fullWidth size="large" disabled={!name.trim()}>
                Start Training
              </Button>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default Onboarding;
