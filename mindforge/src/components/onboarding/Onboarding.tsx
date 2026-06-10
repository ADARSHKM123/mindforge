import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, ArrowRight, Check } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { categoryInfo } from '../../data/games';
import { SkillCategory } from '../../types';
import Button from '../ui/Button';
import CategoryIcon from '../ui/CategoryIcon';

const categories = Object.keys(categoryInfo) as SkillCategory[];
const goalOptions = [
  { value: 3, label: '3 sessions', sub: 'Casual — about 5 min/day' },
  { value: 5, label: '5 sessions', sub: 'Regular — about 10 min/day' },
  { value: 10, label: '10 sessions', sub: 'Serious — about 20 min/day' },
];

const steps = ['welcome', 'name', 'focus', 'goal'] as const;
type Step = typeof steps[number];

const Onboarding: React.FC = () => {
  const { completeOnboarding } = useUser();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [focusAreas, setFocusAreas] = useState<SkillCategory[]>([]);
  const [goal, setGoal] = useState(3);

  const stepIndex = steps.indexOf(step);
  const next = () => setStep(steps[Math.min(stepIndex + 1, steps.length - 1)]);

  const toggleFocus = (cat: SkillCategory) =>
    setFocusAreas(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const finish = () => completeOnboarding(name.trim() || 'Player', focusAreas, goal);

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient floating orb */}
      <div className="orb" style={{ width: 340, height: 340, top: '-90px', right: '-70px', opacity: 0.75 }} />
      <div className="orb" style={{ width: 220, height: 220, bottom: '-60px', left: '-50px', opacity: 0.45, animationDelay: '-4.5s' }} />

      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 40, position: 'relative' }}>
        {steps.map((s, i) => (
          <div key={s} style={{
            width: i === stepIndex ? 24 : 8, height: 8, borderRadius: 4,
            background: i <= stepIndex ? 'var(--accent)' : 'var(--bg-subtle)',
            boxShadow: i === stepIndex ? 'var(--glow-accent)' : 'none',
            transition: 'all 300ms',
          }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
          style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}
        >
          {step === 'welcome' && (
            <>
              <div style={{
                width: 72, height: 72, borderRadius: 20,
                background: 'linear-gradient(135deg, var(--accent), #7C5AF5)',
                color: '#FFFFFF', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 28px',
                boxShadow: 'var(--glow-accent-strong)',
              }}>
                <BrainCircuit size={34} />
              </div>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Adaptive brain training</p>
              <h1 className="display-hero" style={{ marginBottom: 16 }}>
                Forge a<br />
                <span style={{
                  background: 'linear-gradient(110deg, var(--accent), #9B7CF8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  sharper mind
                </span>
              </h1>
              <p className="text-secondary" style={{ fontSize: 15.5, lineHeight: 1.6, marginBottom: 36 }}>
                A few focused minutes a day. Adaptive exercises for memory, focus, speed, math, reading and vocabulary — built to push you exactly where you need it.
              </p>
              <Button size="lg" fullWidth onClick={next}>
                Get started <ArrowRight size={16} />
              </Button>
            </>
          )}

          {step === 'name' && (
            <>
              <h1 style={{ fontSize: 24, marginBottom: 8 }}>What should we call you?</h1>
              <p className="text-secondary" style={{ marginBottom: 28 }}>Used for your profile and daily greeting.</p>
              <input
                className="input"
                autoFocus
                placeholder="Your name"
                value={name}
                maxLength={30}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && next()}
                style={{ marginBottom: 20, textAlign: 'center', fontSize: 17 }}
              />
              <Button size="lg" fullWidth disabled={!name.trim()} onClick={next}>
                Continue <ArrowRight size={16} />
              </Button>
            </>
          )}

          {step === 'focus' && (
            <>
              <h1 style={{ fontSize: 24, marginBottom: 8 }}>What do you want to improve?</h1>
              <p className="text-secondary" style={{ marginBottom: 28 }}>Pick any — your daily workout will prioritize these.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                {categories.map(cat => {
                  const active = focusAreas.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleFocus(cat)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                        borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                        background: active ? 'var(--accent-soft)' : 'var(--card)',
                        transition: 'all 150ms',
                      }}
                    >
                      <CategoryIcon category={cat} size={17} />
                      <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{categoryInfo[cat].name}</span>
                      {active && <Check size={15} color="var(--accent)" />}
                    </button>
                  );
                })}
              </div>
              <Button size="lg" fullWidth onClick={next}>
                {focusAreas.length > 0 ? 'Continue' : 'Skip — train everything'} <ArrowRight size={16} />
              </Button>
            </>
          )}

          {step === 'goal' && (
            <>
              <h1 style={{ fontSize: 24, marginBottom: 8 }}>Set your daily goal</h1>
              <p className="text-secondary" style={{ marginBottom: 28 }}>Consistency beats intensity — you can change this anytime.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {goalOptions.map(opt => {
                  const active = goal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setGoal(opt.value)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                        border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                        background: active ? 'var(--accent-soft)' : 'var(--card)',
                        transition: 'all 150ms',
                      }}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: 15, fontWeight: 700 }}>{opt.label}</p>
                        <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{opt.sub}</p>
                      </div>
                      {active && <Check size={17} color="var(--accent)" />}
                    </button>
                  );
                })}
              </div>
              <Button size="lg" fullWidth onClick={finish}>
                Start training <ArrowRight size={16} />
              </Button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
