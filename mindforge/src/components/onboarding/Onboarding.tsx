import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import Button from '../common/Button';

const steps = [
  {
    icon: '🧠',
    title: 'Welcome to MindForge',
    subtitle: 'Your personal cognitive training companion',
    description: 'Train your brain daily with scientifically-designed exercises that improve memory, focus, math skills, and more.',
  },
  {
    icon: '📊',
    title: 'Track Your Progress',
    subtitle: 'Watch yourself improve over time',
    description: 'Detailed analytics show your strengths and areas for growth. Set daily goals and build streaks to stay motivated.',
  },
  {
    icon: '📚',
    title: 'Daily Vocabulary',
    subtitle: 'Learn new words every day',
    description: 'Expand your vocabulary with curated words, definitions, and spaced repetition to ensure long-term retention.',
  },
  {
    icon: '🏆',
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: colors.bg,
    }}>
      {!isLastStep ? (
        <>
          <div style={{
            fontSize: '80px',
            marginBottom: '32px',
            animation: 'bounce 1s ease-in-out',
          }}>
            {steps[step].icon}
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: colors.text,
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            {steps[step].title}
          </h1>
          <p style={{
            fontSize: '16px',
            color: colors.primary,
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '16px',
          }}>
            {steps[step].subtitle}
          </p>
          <p style={{
            fontSize: '15px',
            color: colors.textSecondary,
            textAlign: 'center',
            maxWidth: '320px',
            lineHeight: 1.6,
            marginBottom: '48px',
          }}>
            {steps[step].description}
          </p>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                width: i === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === step ? colors.primary : colors.border,
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '320px' }}>
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)} fullWidth>
                Back
              </Button>
            )}
            <Button onClick={() => setStep(step + 1)} fullWidth size="large">
              {step === steps.length - 1 ? "Let's Go!" : 'Next'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>👋</div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: colors.text,
            textAlign: 'center',
            marginBottom: '8px',
          }}>
            What's your name?
          </h1>
          <p style={{
            fontSize: '15px',
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            We'll personalize your experience
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) handleComplete(); }}
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '16px 20px',
              fontSize: '18px',
              borderRadius: '12px',
              border: `2px solid ${colors.border}`,
              background: colors.bgSecondary,
              color: colors.text,
              outline: 'none',
              textAlign: 'center',
              fontFamily: 'inherit',
              marginBottom: '24px',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = colors.primary}
            onBlur={(e) => e.target.style.borderColor = colors.border}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '320px' }}>
            <Button variant="secondary" onClick={() => setStep(step - 1)} fullWidth>
              Back
            </Button>
            <Button onClick={handleComplete} fullWidth size="large" disabled={!name.trim()}>
              Start Training
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Onboarding;
