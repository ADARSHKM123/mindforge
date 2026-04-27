import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { gameConfigs, categoryInfo } from '../../data/games';
import { shuffleArray, calculateXP } from '../../utils/helpers';
import Button from '../common/Button';
import Card from '../common/Card';

// ===== Question Generators =====

interface Question {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

function generateMathQuestions(count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const ops = ['+', '-', '×', '÷'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a: number, b: number, answer: number;
    switch (op) {
      case '+': a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * 50) + 10; answer = a + b; break;
      case '-': a = Math.floor(Math.random() * 50) + 30; b = Math.floor(Math.random() * 30) + 1; answer = a - b; break;
      case '×': a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; answer = a * b; break;
      default: b = Math.floor(Math.random() * 10) + 2; answer = Math.floor(Math.random() * 10) + 2; a = b * answer; break;
    }
    const wrongsSet = new Set<number>();
    while (wrongsSet.size < 3) {
      const w = answer + (Math.floor(Math.random() * 10) - 5);
      if (w !== answer && w > 0) wrongsSet.add(w);
    }
    const wrongs = Array.from(wrongsSet);
    const options = shuffleArray([answer, ...wrongs]);
    questions.push({
      prompt: `${a} ${op} ${b} = ?`,
      options: options.map(String),
      correctIndex: options.indexOf(answer),
    });
  }
  return questions;
}

function generatePatternQuestions(count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const start = Math.floor(Math.random() * 10) + 1;
    const diff = Math.floor(Math.random() * 8) + 2;
    const seq = Array.from({ length: 5 }, (_, j) => start + diff * j);
    const answer = start + diff * 5;
    const wrongsSet = new Set<number>();
    while (wrongsSet.size < 3) {
      const w = answer + (Math.floor(Math.random() * 10) - 5);
      if (w !== answer) wrongsSet.add(w);
    }
    const wrongs = Array.from(wrongsSet);
    const options = shuffleArray([answer, ...wrongs]);
    questions.push({
      prompt: `What comes next? ${seq.join(', ')}, ?`,
      options: options.map(String),
      correctIndex: options.indexOf(answer),
      explanation: `The pattern adds ${diff} each time.`,
    });
  }
  return questions;
}

function generateMemorySequenceQuestions(count: number): Question[] {
  const emojis = ['🍎', '🌟', '🔵', '🟢', '🎵', '🌙', '❤️', '⚡', '🌈', '🎯'];
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const len = Math.min(3 + Math.floor(i / 2), 7);
    const seq = Array.from({ length: len }, () => emojis[Math.floor(Math.random() * emojis.length)]);
    const missingIdx = Math.floor(Math.random() * len);
    const answer = seq[missingIdx];
    const display = seq.map((s, j) => j === missingIdx ? '❓' : s).join(' ');
    const wrongsSet = new Set<string>();
    while (wrongsSet.size < 3) {
      const w = emojis[Math.floor(Math.random() * emojis.length)];
      if (w !== answer) wrongsSet.add(w);
    }
    const options = shuffleArray([answer, ...Array.from(wrongsSet)]);
    questions.push({
      prompt: `Remember the sequence, then find the missing item:\n${display}`,
      options,
      correctIndex: options.indexOf(answer),
    });
  }
  return questions;
}

function generateCardMatchQuestions(count: number): Question[] {
  const pairs = ['🍎🍎', '🌟🌟', '🔵🔵', '🟢🟢', '🎵🎵', '🌙🌙', '❤️❤️', '⚡⚡'];
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const pairIdx = i % pairs.length;
    const target = pairs[pairIdx][0];
    const wrongs = shuffleArray(pairs.filter((_, j) => j !== pairIdx).map(p => p[0])).slice(0, 3);
    const options = shuffleArray([target, ...wrongs]);
    questions.push({
      prompt: `Find the match for: ${target}`,
      options,
      correctIndex: options.indexOf(target),
    });
  }
  return questions;
}

const readingPassages = [
  { text: 'The octopus is widely regarded as the most intelligent invertebrate. Studies show they can solve puzzles, use tools, and even escape from enclosures. Their ability to change color and texture allows them to camouflage instantly.', q: 'What makes the octopus able to camouflage?', options: ['Ink production', 'Changing color and texture', 'Hard shell', 'Long tentacles'], correct: 1 },
  { text: 'The Great Wall of China stretches over 13,000 miles. Contrary to popular belief, it is not visible from space with the naked eye. Construction began in the 7th century BC and continued for over 2,000 years.', q: 'How long did construction of the Great Wall take?', options: ['100 years', '500 years', 'Over 2,000 years', '13,000 years'], correct: 2 },
  { text: 'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible. Its low moisture content and acidic pH create an inhospitable environment for bacteria.', q: 'Why does honey not spoil?', options: ['It is artificial', 'Low moisture and acidic pH', 'It contains preservatives', 'It is heated'], correct: 1 },
  { text: 'The Amazon rainforest produces about 20% of the world\'s oxygen. It is home to 10% of all species on Earth. Deforestation threatens this ecosystem, with about 17% of the forest lost in the last 50 years.', q: 'What percentage of Earth\'s species live in the Amazon?', options: ['5%', '10%', '20%', '50%'], correct: 1 },
  { text: 'Sleep is essential for memory consolidation. During deep sleep, the brain replays and strengthens neural connections formed during the day. Adults who get less than 7 hours of sleep show reduced cognitive performance.', q: 'When does memory consolidation primarily occur?', options: ['While eating', 'During exercise', 'During deep sleep', 'While reading'], correct: 2 },
  { text: 'Photosynthesis converts sunlight into chemical energy. Plants absorb carbon dioxide and water, using light energy to produce glucose and oxygen. This process is fundamental to virtually all life on Earth.', q: 'What do plants produce during photosynthesis?', options: ['Carbon dioxide', 'Glucose and oxygen', 'Water only', 'Sunlight'], correct: 1 },
  { text: 'The human brain contains approximately 86 billion neurons. Each neuron can form thousands of connections with other neurons, creating a network of trillions of synapses. This complex network enables thought, memory, and consciousness.', q: 'Approximately how many neurons are in the human brain?', options: ['1 million', '1 billion', '86 billion', '1 trillion'], correct: 2 },
  { text: 'Coral reefs occupy less than 1% of the ocean floor yet support about 25% of all marine species. Rising ocean temperatures cause coral bleaching, threatening these vital ecosystems. Scientists estimate that 70% of coral reefs could be lost by 2050.', q: 'What percentage of the ocean floor do coral reefs occupy?', options: ['Less than 1%', 'About 10%', '25%', '50%'], correct: 0 },
];

function generateReadingQuestions(count: number): Question[] {
  const questions: Question[] = [];
  const shuffled = shuffleArray([...readingPassages]);
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const p = shuffled[i];
    questions.push({
      prompt: `📖 Read:\n"${p.text}"\n\n${p.q}`,
      options: p.options,
      correctIndex: p.correct,
    });
  }
  return questions;
}

const stroopColors = [
  { word: 'RED', color: '#3498DB', answer: 'Blue' },
  { word: 'BLUE', color: '#E74C3C', answer: 'Red' },
  { word: 'GREEN', color: '#F39C12', answer: 'Yellow' },
  { word: 'YELLOW', color: '#2ECC71', answer: 'Green' },
  { word: 'PURPLE', color: '#E74C3C', answer: 'Red' },
  { word: 'ORANGE', color: '#3498DB', answer: 'Blue' },
  { word: 'RED', color: '#2ECC71', answer: 'Green' },
  { word: 'BLUE', color: '#F39C12', answer: 'Yellow' },
];

function generateFocusQuestions(count: number): Question[] {
  const questions: Question[] = [];
  const colors = ['Red', 'Blue', 'Green', 'Yellow'];
  for (let i = 0; i < count; i++) {
    const stroop = stroopColors[i % stroopColors.length];
    const options = shuffleArray([...colors]);
    questions.push({
      prompt: `What COLOR is this word displayed in?\n\n<stroop color="${stroop.color}" word="${stroop.word}"/>`,
      options,
      correctIndex: options.indexOf(stroop.answer),
      explanation: `The word says "${stroop.word}" but is displayed in ${stroop.answer}.`,
    });
  }
  return questions;
}

function generateOddOneOutQuestions(count: number): Question[] {
  const sets = [
    { items: ['Dog', 'Cat', 'Hammer', 'Bird'], odd: 2, reason: 'Hammer is not an animal' },
    { items: ['Piano', 'Violin', 'Painting', 'Guitar'], odd: 2, reason: 'Painting is not a musical instrument' },
    { items: ['Mars', 'Venus', 'Moon', 'Jupiter'], odd: 2, reason: 'Moon is not a planet' },
    { items: ['Triangle', 'Square', 'Sphere', 'Rectangle'], odd: 2, reason: 'Sphere is 3D, others are 2D' },
    { items: ['Apple', 'Banana', 'Carrot', 'Orange'], odd: 2, reason: 'Carrot is a vegetable, not a fruit' },
    { items: ['Running', 'Swimming', 'Reading', 'Cycling'], odd: 2, reason: 'Reading is not a physical exercise' },
  ];
  return shuffleArray(sets).slice(0, count).map(s => ({
    prompt: `Which one doesn't belong?`,
    options: s.items,
    correctIndex: s.odd,
    explanation: s.reason,
  }));
}

function generateSpeedQuestions(count: number): Question[] {
  const questions: Question[] = [];
  const categories = { Fruit: ['Apple', 'Banana', 'Orange', 'Mango'], Animal: ['Dog', 'Cat', 'Lion', 'Eagle'], Color: ['Red', 'Blue', 'Green', 'Yellow'] };
  const catNames = Object.keys(categories);
  for (let i = 0; i < count; i++) {
    const catName = catNames[Math.floor(Math.random() * catNames.length)];
    const items = (categories as any)[catName];
    const item = items[Math.floor(Math.random() * items.length)];
    const options = shuffleArray([...catNames]);
    questions.push({
      prompt: `Quick! What category: "${item}"?`,
      options,
      correctIndex: options.indexOf(catName),
    });
  }
  return questions;
}

function generateQuickTapQuestions(count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const target = Math.floor(Math.random() * 100);
    const wrongsSet = new Set<number>();
    while (wrongsSet.size < 3) {
      const w = Math.floor(Math.random() * 100);
      if (w !== target) wrongsSet.add(w);
    }
    const options = shuffleArray([target, ...Array.from(wrongsSet)]).map(String);
    questions.push({
      prompt: `Tap the number: ${target}`,
      options,
      correctIndex: options.indexOf(String(target)),
    });
  }
  return questions;
}

const scrambleWords = [
  { word: 'BRAIN', scrambled: 'NIBRA' }, { word: 'THINK', scrambled: 'KNITH' },
  { word: 'LEARN', scrambled: 'NRAEL' }, { word: 'FOCUS', scrambled: 'SUCOF' },
  { word: 'SMART', scrambled: 'TRAMS' }, { word: 'QUICK', scrambled: 'KCUIQ' },
  { word: 'POWER', scrambled: 'REWOP' }, { word: 'LOGIC', scrambled: 'CIGOL' },
];

function generateWordScrambleQuestions(count: number): Question[] {
  return shuffleArray(scrambleWords).slice(0, count).map(w => {
    const wrongs = shuffleArray(scrambleWords.filter(x => x.word !== w.word)).slice(0, 3).map(x => x.word);
    const options = shuffleArray([w.word, ...wrongs]);
    return {
      prompt: `Unscramble: ${w.scrambled}`,
      options,
      correctIndex: options.indexOf(w.word),
    };
  });
}

const synonymPairs = [
  { word: 'Happy', synonym: 'Joyful', wrongs: ['Sad', 'Angry', 'Tired'] },
  { word: 'Fast', synonym: 'Quick', wrongs: ['Slow', 'Heavy', 'Tall'] },
  { word: 'Big', synonym: 'Large', wrongs: ['Small', 'Thin', 'Short'] },
  { word: 'Smart', synonym: 'Clever', wrongs: ['Dull', 'Quiet', 'Loud'] },
  { word: 'Brave', synonym: 'Courageous', wrongs: ['Afraid', 'Weak', 'Shy'] },
  { word: 'Beautiful', synonym: 'Gorgeous', wrongs: ['Ugly', 'Plain', 'Dull'] },
  { word: 'Angry', synonym: 'Furious', wrongs: ['Calm', 'Happy', 'Sleepy'] },
  { word: 'Begin', synonym: 'Commence', wrongs: ['End', 'Stop', 'Finish'] },
];

function generateSynonymQuestions(count: number): Question[] {
  return shuffleArray(synonymPairs).slice(0, count).map(p => {
    const options = shuffleArray([p.synonym, ...p.wrongs]);
    return {
      prompt: `Find the synonym of "${p.word}"`,
      options,
      correctIndex: options.indexOf(p.synonym),
    };
  });
}

function getQuestions(gameId: string, count: number): Question[] {
  switch (gameId) {
    case 'mental-math': return generateMathQuestions(count);
    case 'number-patterns': return generatePatternQuestions(count);
    case 'card-match': return generateCardMatchQuestions(count);
    case 'sequence-recall': return generateMemorySequenceQuestions(count);
    case 'reading-comprehension': case 'word-context': return generateReadingQuestions(count);
    case 'color-match': return generateFocusQuestions(count);
    case 'odd-one-out': return generateOddOneOutQuestions(count);
    case 'rapid-sort': return generateSpeedQuestions(count);
    case 'quick-tap': return generateQuickTapQuestions(count);
    case 'word-scramble': return generateWordScrambleQuestions(count);
    case 'synonym-match': return generateSynonymQuestions(count);
    default: return generateMathQuestions(count);
  }
}

// ===== Game Engine Component =====

const GameEngine: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { addGameResult } = useUser();

  const config = gameConfigs.find(g => g.id === gameId);
  const totalQuestions = 8;

  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(config?.duration || 60);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; time: number }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const questionStartRef = useRef<number>(Date.now());

  const startGame = useCallback(() => {
    const qs = getQuestions(gameId || '', totalQuestions);
    setQuestions(qs);
    setCurrentQ(0);
    setScore(0);
    setTimeLeft(config?.duration || 60);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers([]);
    setPhase('playing');
    questionStartRef.current = Date.now();
  }, [gameId, config]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase('result');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    const timeSpent = Date.now() - questionStartRef.current;
    const correct = index === questions[currentQ].correctIndex;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (correct) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, { correct, time: timeSpent }]);

    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase('result');
      } else {
        setCurrentQ(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        questionStartRef.current = Date.now();
      }
    }, 800);
  };

  // Save result on completion
  useEffect(() => {
    if (phase === 'result' && config) {
      const totalTime = answers.reduce((sum, a) => sum + a.time, 0) / 1000;
      const xp = calculateXP(score, totalQuestions, config.difficulty);
      addGameResult({
        gameId: config.id,
        category: config.category,
        score,
        maxScore: totalQuestions,
        accuracy: answers.length > 0 ? answers.filter(a => a.correct).length / answers.length * 100 : 0,
        timeSpent: totalTime,
        date: new Date().toISOString().split('T')[0],
        xpEarned: xp,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!config) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2 style={{ color: colors.text }}>Game not found</h2>
        <Button onClick={() => navigate('/training')}>Back to Training</Button>
      </div>
    );
  }

  // ===== Render Phases =====

  if (phase === 'intro') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '24px', background: colors.bg,
      }}>
        <div style={{
          width: '100px', height: '100px', borderRadius: '28px',
          background: `${config.color}20`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '24px',
        }}>
          {config.icon}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: colors.text, marginBottom: '8px' }}>
          {config.title}
        </h1>
        <p style={{ fontSize: '15px', color: colors.textSecondary, textAlign: 'center', marginBottom: '8px' }}>
          {config.description}
        </p>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <span style={{ fontSize: '13px', color: colors.textSecondary }}>
            ⏱️ {config.duration}s
          </span>
          <span style={{ fontSize: '13px', color: colors.textSecondary }}>
            ❓ {totalQuestions} questions
          </span>
          <span style={{
            fontSize: '13px', fontWeight: 600,
            color: config.difficulty === 'hard' ? colors.error : config.difficulty === 'medium' ? colors.warning : colors.success,
            textTransform: 'capitalize',
          }}>
            {config.difficulty}
          </span>
        </div>
        <Button onClick={startGame} size="large" style={{ minWidth: '200px' }}>
          Start Game
        </Button>
        <Button variant="ghost" onClick={() => navigate('/training')} style={{ marginTop: '12px' }}>
          Back
        </Button>
      </div>
    );
  }

  if (phase === 'result') {
    const accuracy = answers.length > 0 ? Math.round(answers.filter(a => a.correct).length / answers.length * 100) : 0;
    const xp = calculateXP(score, totalQuestions, config.difficulty);
    const avgTime = answers.length > 0 ? Math.round(answers.reduce((s, a) => s + a.time, 0) / answers.length / 1000 * 10) / 10 : 0;

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '24px', background: colors.bg,
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>
          {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '👏' : accuracy >= 40 ? '💪' : '🔄'}
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: colors.text, marginBottom: '4px' }}>
          {accuracy >= 80 ? 'Excellent!' : accuracy >= 60 ? 'Great Job!' : accuracy >= 40 ? 'Good Try!' : 'Keep Practicing!'}
        </h1>
        <p style={{ fontSize: '15px', color: colors.textSecondary, marginBottom: '24px' }}>
          {config.title} completed
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
          width: '100%', maxWidth: '320px', marginBottom: '32px',
        }}>
          <Card style={{ textAlign: 'center' }} padding="16px">
            <p style={{ fontSize: '28px', fontWeight: 800, color: colors.primary, margin: '0 0 4px' }}>
              {score}/{totalQuestions}
            </p>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>Score</p>
          </Card>
          <Card style={{ textAlign: 'center' }} padding="16px">
            <p style={{ fontSize: '28px', fontWeight: 800, color: colors.accent, margin: '0 0 4px' }}>
              {accuracy}%
            </p>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>Accuracy</p>
          </Card>
          <Card style={{ textAlign: 'center' }} padding="16px">
            <p style={{ fontSize: '28px', fontWeight: 800, color: colors.warning, margin: '0 0 4px' }}>
              +{xp}
            </p>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>XP Earned</p>
          </Card>
          <Card style={{ textAlign: 'center' }} padding="16px">
            <p style={{ fontSize: '28px', fontWeight: 800, color: colors.error, margin: '0 0 4px' }}>
              {avgTime}s
            </p>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>Avg Time</p>
          </Card>
        </div>

        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '320px' }}>
          <Button variant="secondary" onClick={() => navigate('/training')} fullWidth>
            Back
          </Button>
          <Button onClick={startGame} fullWidth>
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  // ===== Playing Phase =====
  const question = questions[currentQ];
  const timerPercent = (timeLeft / (config.duration)) * 100;

  // Parse stroop tag if present
  let stroopData: { color: string; word: string } | null = null;
  let displayPrompt = question.prompt;
  const stroopMatch = question.prompt.match(/<stroop color="([^"]+)" word="([^"]+)"\/>/);
  if (stroopMatch) {
    stroopData = { color: stroopMatch[1], word: stroopMatch[2] };
    displayPrompt = question.prompt.replace(/<stroop[^/]*\/>/, '');
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, padding: '16px', paddingBottom: '32px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); navigate('/training'); }}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: colors.textSecondary }}>
          ←
        </button>
        <span style={{ fontSize: '13px', fontWeight: 600, color: colors.textSecondary }}>
          {currentQ + 1} / {totalQuestions}
        </span>
        <span style={{
          fontSize: '16px', fontWeight: 700,
          color: timeLeft <= 10 ? colors.error : colors.text,
        }}>
          {timeLeft}s
        </span>
      </div>

      {/* Timer Bar */}
      <div style={{ height: '4px', borderRadius: '2px', background: colors.bgTertiary, marginBottom: '24px' }}>
        <div style={{
          height: '100%', borderRadius: '2px',
          background: timeLeft <= 10 ? colors.error : config.color,
          width: `${timerPercent}%`, transition: 'width 1s linear',
        }} />
      </div>

      {/* Progress Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '24px' }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: i < currentQ ? (answers[i]?.correct ? colors.success : colors.error)
              : i === currentQ ? config.color : colors.bgTertiary,
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Question */}
      <div style={{ textAlign: 'center', marginBottom: '32px', minHeight: '120px' }}>
        <p style={{
          fontSize: '18px', fontWeight: 600, color: colors.text,
          lineHeight: 1.6, whiteSpace: 'pre-line', maxWidth: '400px', margin: '0 auto',
        }}>
          {displayPrompt}
        </p>
        {stroopData && (
          <p style={{
            fontSize: '48px', fontWeight: 900, color: stroopData.color,
            margin: '16px 0', fontFamily: 'Arial, sans-serif',
          }}>
            {stroopData.word}
          </p>
        )}
      </div>

      {/* Options */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
        maxWidth: '400px', margin: '0 auto',
      }}>
        {question.options.map((option, i) => {
          let bg = colors.card;
          let borderColor = colors.border;
          let textColor = colors.text;
          if (showFeedback) {
            if (i === question.correctIndex) {
              bg = `${colors.success}20`;
              borderColor = colors.success;
              textColor = colors.success;
            } else if (i === selectedAnswer && i !== question.correctIndex) {
              bg = `${colors.error}20`;
              borderColor = colors.error;
              textColor = colors.error;
            }
          } else if (i === selectedAnswer) {
            bg = `${config.color}15`;
            borderColor = config.color;
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={showFeedback}
              style={{
                padding: '16px', borderRadius: '14px', border: `2px solid ${borderColor}`,
                background: bg, color: textColor, fontSize: '16px', fontWeight: 600,
                cursor: showFeedback ? 'default' : 'pointer',
                transition: 'all 0.2s', fontFamily: 'inherit',
                minHeight: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && question.explanation && (
        <p style={{
          textAlign: 'center', fontSize: '13px', color: colors.textSecondary,
          marginTop: '16px', maxWidth: '360px', margin: '16px auto 0',
        }}>
          {question.explanation}
        </p>
      )}
    </div>
  );
};

export default GameEngine;
