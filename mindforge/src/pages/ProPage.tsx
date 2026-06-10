import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { gameConfigs } from '../data/games';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const features = [
  `All ${gameConfigs.length} exercises (free plan: ${gameConfigs.filter(g => !g.proOnly).length})`,
  'Full 5-exercise daily workout (free plan: 3)',
  'Complete progress analytics & skill history',
  'Adaptive difficulty across every category',
  'Priority access to new exercises',
];

const ProPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, upgradeToPro } = useUser();
  const [plan, setPlan] = useState<'annual' | 'monthly'>('annual');

  if (user.isPro) {
    return (
      <div className="page" style={{ maxWidth: 440, textAlign: 'center', paddingTop: 80 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, background: 'var(--warning-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <Sparkles size={28} color="var(--warning)" />
        </div>
        <h1 style={{ marginBottom: 8 }}>You're on Pro</h1>
        <p className="text-secondary" style={{ marginBottom: 24 }}>
          Everything is unlocked. Enjoy the full training program.
        </p>
        <Button size="lg" onClick={() => navigate('/home')}>Start training</Button>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 520, position: 'relative' }}>
      <div className="orb" style={{ width: 280, height: 280, top: '-60px', right: '-90px', opacity: 0.5 }} />

      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          color: 'var(--text-secondary)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', marginBottom: 24,
        }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative' }}>
        <span className="badge badge-pro" style={{ marginBottom: 16 }}>MINDFORGE PRO</span>
        <h1 className="display-hero" style={{ marginBottom: 12 }}>
          Train without<br />
          <span style={{
            background: 'linear-gradient(110deg, var(--accent), #9B7CF8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            limits
          </span>
        </h1>
        <p className="text-secondary">One subscription, your complete cognitive training program.</p>
      </div>

      <Card style={{ marginBottom: 16 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
            <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 14 }}>{f}</span>
          </div>
        ))}
      </Card>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        <Card
          interactive
          className={plan === 'annual' ? 'card-glow' : ''}
          onClick={() => setPlan('annual')}
          style={{
            padding: 18, textAlign: 'center', position: 'relative',
            borderColor: plan === 'annual' ? 'var(--accent)' : undefined,
          }}
        >
          <span className="badge badge-accent" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', fontSize: 10.5 }}>
            BEST VALUE
          </span>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 6 }}>Annual</p>
          <p style={{ fontSize: 26, fontWeight: 800, margin: '4px 0' }}>$39.99<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)' }}>/yr</span></p>
          <p style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>$3.33/month — save 58%</p>
        </Card>
        <Card
          interactive
          className={plan === 'monthly' ? 'card-glow' : ''}
          onClick={() => setPlan('monthly')}
          style={{
            padding: 18, textAlign: 'center',
            borderColor: plan === 'monthly' ? 'var(--accent)' : undefined,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginTop: 6 }}>Monthly</p>
          <p style={{ fontSize: 26, fontWeight: 800, margin: '4px 0' }}>$7.99<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)' }}>/mo</span></p>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Cancel anytime</p>
        </Card>
      </div>

      <Button size="lg" fullWidth onClick={upgradeToPro}>
        <Sparkles size={16} />
        Start {plan === 'annual' ? 'annual' : 'monthly'} plan
      </Button>
      <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 12 }}>
        Demo build: payments aren't connected yet, so this activates Pro instantly.
        Production launch will use a payment provider (e.g. Stripe) here.
      </p>
    </div>
  );
};

export default ProPage;
