import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { gameConfigs, categoryInfo } from '../data/games';
import { shuffleArray, calculateXP } from '../utils/helpers';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
    const ops = ['+', '-', '\u00D7', '\u00F7'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a: number, b: number, answer: number;
    switch (op) {
      case '+': a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * 50) + 10; answer = a + b; break;
      case '-': a = Math.floor(Math.random() * 50) + 30; b = Math.floor(Math.random() * 30) + 1; answer = a - b; break;
      case '\u00D7': a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; answer = a * b; break;
      default: b = Math.floor(Math.random() * 10) + 2; answer = Math.floor(Math.random() * 10) + 2; a = b * answer; break;
    }
    const wrongsSet = new Set<number>();
    while (wrongsSet.size < 3) {
      const w = answer + (Math.floor(Math.random() * 10) - 5);
      if (w !== answer && w > 0) wrongsSet.add(w);
    }
    const wrongs = Array.from(wrongsSet);
    const options = shuffleArray([answer, ...wrongs]);
    questions.push({ prompt: `${a} ${op} ${b} = ?`, options: options.map(String), correctIndex: options.indexOf(answer) });
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
    const options = shuffleArray([answer, ...Array.from(wrongsSet)]);
    questions.push({
      prompt: `What comes next?\n${seq.join(', ')}, ?`,
      options: options.map(String),
      correctIndex: options.indexOf(answer),
      explanation: `The pattern adds ${diff} each time.`,
    });
  }
  return questions;
}

function generateMemorySequenceQuestions(count: number): Question[] {
  const emojis = ['\u{1F34E}', '\u{1F31F}', '\u{1F535}', '\u{1F7E2}', '\u{1F3B5}', '\u{1F319}', '\u{2764}\u{FE0F}', '\u{26A1}', '\u{1F308}', '\u{1F3AF}'];
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const len = Math.min(3 + Math.floor(i / 2), 7);
    const seq = Array.from({ length: len }, () => emojis[Math.floor(Math.random() * emojis.length)]);
    const missingIdx = Math.floor(Math.random() * len);
    const answer = seq[missingIdx];
    const display = seq.map((s, j) => j === missingIdx ? '\u{2753}' : s).join(' ');
    const wrongsSet = new Set<string>();
    while (wrongsSet.size < 3) {
      const w = emojis[Math.floor(Math.random() * emojis.length)];
      if (w !== answer) wrongsSet.add(w);
    }
    const options = shuffleArray([answer, ...Array.from(wrongsSet)]);
    questions.push({
      prompt: `Find the missing item:\n${display}`,
      options,
      correctIndex: options.indexOf(answer),
    });
  }
  return questions;
}

function generateCardMatchQuestions(count: number): Question[] {
  const pairs = ['\u{1F34E}\u{1F34E}', '\u{1F31F}\u{1F31F}', '\u{1F535}\u{1F535}', '\u{1F7E2}\u{1F7E2}', '\u{1F3B5}\u{1F3B5}', '\u{1F319}\u{1F319}', '\u{2764}\u{FE0F}\u{2764}\u{FE0F}', '\u{26A1}\u{26A1}'];
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const pairIdx = i % pairs.length;
    const target = [...pairs[pairIdx]][0];
    const wrongs = shuffleArray(pairs.filter((_, j) => j !== pairIdx).map(p => [...p][0])).slice(0, 3);
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
  { text: 'The Great Wall of China stretches over 13,000 miles. Contrary to popular belief, it is not visible from space with the naked eye. Construction began in the 7th century BC and continued for over 2,000 years.', q: 'How long did construction take?', options: ['100 years', '500 years', 'Over 2,000 years', '13,000 years'], correct: 2 },
  { text: 'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible. Its low moisture content and acidic pH create an inhospitable environment for bacteria.', q: 'Why does honey not spoil?', options: ['It is artificial', 'Low moisture and acidic pH', 'It contains preservatives', 'It is heated'], correct: 1 },
  { text: 'The Amazon rainforest produces about 20% of the world\'s oxygen. It is home to 10% of all species on Earth. Deforestation threatens this ecosystem, with about 17% of the forest lost in the last 50 years.', q: 'What % of species live in the Amazon?', options: ['5%', '10%', '20%', '50%'], correct: 1 },
  { text: 'Sleep is essential for memory consolidation. During deep sleep, the brain replays and strengthens neural connections formed during the day. Adults who get less than 7 hours show reduced cognitive performance.', q: 'When does memory consolidation occur?', options: ['While eating', 'During exercise', 'During deep sleep', 'While reading'], correct: 2 },
  { text: 'Photosynthesis converts sunlight into chemical energy. Plants absorb carbon dioxide and water, using light energy to produce glucose and oxygen. This process is fundamental to virtually all life on Earth.', q: 'What do plants produce?', options: ['Carbon dioxide', 'Glucose and oxygen', 'Water only', 'Sunlight'], correct: 1 },
  { text: 'The human brain contains approximately 86 billion neurons. Each neuron can form thousands of connections, creating a network of trillions of synapses. This complex network enables thought, memory, and consciousness.', q: 'How many neurons in the brain?', options: ['1 million', '1 billion', '86 billion', '1 trillion'], correct: 2 },
  { text: 'Coral reefs occupy less than 1% of the ocean floor yet support about 25% of all marine species. Rising ocean temperatures cause coral bleaching. Scientists estimate 70% of reefs could be lost by 2050.', q: 'How much ocean floor do reefs occupy?', options: ['Less than 1%', 'About 10%', '25%', '50%'], correct: 0 },
];

function generateReadingQuestions(count: number): Question[] {
  return shuffleArray([...readingPassages]).slice(0, count).map(p => ({
    prompt: `\u{1F4D6} Read:\n"${p.text}"\n\n${p.q}`,
    options: p.options,
    correctIndex: p.correct,
  }));
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
  const colorNames = ['Red', 'Blue', 'Green', 'Yellow'];
  return Array.from({ length: count }, (_, i) => {
    const stroop = stroopColors[i % stroopColors.length];
    const options = shuffleArray([...colorNames]);
    return {
      prompt: `What COLOR is this word displayed in?\n\n##STROOP##${stroop.color}##${stroop.word}##`,
      options,
      correctIndex: options.indexOf(stroop.answer),
      explanation: `The word says "${stroop.word}" but is displayed in ${stroop.answer}.`,
    };
  });
}

function generateOddOneOutQuestions(count: number): Question[] {
  const sets = [
    { items: ['Dog', 'Cat', 'Hammer', 'Bird'], odd: 2, reason: 'Hammer is not an animal' },
    { items: ['Piano', 'Violin', 'Painting', 'Guitar'], odd: 2, reason: 'Painting is not an instrument' },
    { items: ['Mars', 'Venus', 'Moon', 'Jupiter'], odd: 2, reason: 'Moon is not a planet' },
    { items: ['Triangle', 'Square', 'Sphere', 'Rectangle'], odd: 2, reason: 'Sphere is 3D' },
    { items: ['Apple', 'Banana', 'Carrot', 'Orange'], odd: 2, reason: 'Carrot is a vegetable' },
    { items: ['Running', 'Swimming', 'Reading', 'Cycling'], odd: 2, reason: 'Reading is not exercise' },
  ];
  return shuffleArray(sets).slice(0, count).map(s => ({
    prompt: 'Which one doesn\'t belong?',
    options: s.items,
    correctIndex: s.odd,
    explanation: s.reason,
  }));
}

function generateSpeedQuestions(count: number): Question[] {
  const categories: Record<string, string[]> = { Fruit: ['Apple', 'Banana', 'Orange', 'Mango'], Animal: ['Dog', 'Cat', 'Lion', 'Eagle'], Color: ['Red', 'Blue', 'Green', 'Yellow'] };
  const catNames = Object.keys(categories);
  return Array.from({ length: count }, () => {
    const catName = catNames[Math.floor(Math.random() * catNames.length)];
    const items = categories[catName];
    const item = items[Math.floor(Math.random() * items.length)];
    const options = shuffleArray([...catNames]);
    return { prompt: `Quick! What category: "${item}"?`, options, correctIndex: options.indexOf(catName) };
  });
}

function generateQuickTapQuestions(count: number): Question[] {
  return Array.from({ length: count }, () => {
    const target = Math.floor(Math.random() * 100);
    const wrongsSet = new Set<number>();
    while (wrongsSet.size < 3) { const w = Math.floor(Math.random() * 100); if (w !== target) wrongsSet.add(w); }
    const options = shuffleArray([target, ...Array.from(wrongsSet)]).map(String);
    return { prompt: `Tap the number: ${target}`, options, correctIndex: options.indexOf(String(target)) };
  });
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
    return { prompt: `Unscramble: ${w.scrambled}`, options, correctIndex: options.indexOf(w.word) };
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
    return { prompt: `Find the synonym of "${p.word}"`, options, correctIndex: options.indexOf(p.synonym) };
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

const GameEngineScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { gameId } = route.params;
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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
  }, [phase]);

  if (!config) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: 24 }}>
        <Text style={{ color: colors.text, fontSize: 18, marginBottom: 16 }}>Game not found</Text>
        <Button onPress={() => navigation.goBack()}>Back to Training</Button>
      </View>
    );
  }

  // ===== Intro Phase =====
  if (phase === 'intro') {
    return (
      <View style={{
        flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.bg,
      }}>
        <View style={{
          width: 100, height: 100, borderRadius: 28,
          backgroundColor: `${config.color}20`, alignItems: 'center',
          justifyContent: 'center', marginBottom: 24,
        }}>
          <Text style={{ fontSize: 48 }}>{config.icon}</Text>
        </View>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
          {config.title}
        </Text>
        <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginBottom: 8 }}>
          {config.description}
        </Text>
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 32 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>{'\u{23F1}'} {config.duration}s</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>{'\u{2753}'} {totalQuestions} questions</Text>
          <Text style={{
            fontSize: 13, fontWeight: '600', textTransform: 'capitalize',
            color: config.difficulty === 'hard' ? colors.error : config.difficulty === 'medium' ? colors.warning : colors.success,
          }}>{config.difficulty}</Text>
        </View>
        <Button onPress={startGame} size="large" style={{ minWidth: 200 }}>Start Game</Button>
        <View style={{ marginTop: 12 }}>
          <Button variant="ghost" onPress={() => navigation.goBack()}>Back</Button>
        </View>
      </View>
    );
  }

  // ===== Result Phase =====
  if (phase === 'result') {
    const accuracy = answers.length > 0 ? Math.round(answers.filter(a => a.correct).length / answers.length * 100) : 0;
    const xp = calculateXP(score, totalQuestions, config.difficulty);
    const avgTime = answers.length > 0 ? Math.round(answers.reduce((s, a) => s + a.time, 0) / answers.length / 1000 * 10) / 10 : 0;

    return (
      <View style={{
        flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.bg,
      }}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>
          {accuracy >= 80 ? '\u{1F3C6}' : accuracy >= 60 ? '\u{1F44F}' : accuracy >= 40 ? '\u{1F4AA}' : '\u{1F504}'}
        </Text>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 4 }}>
          {accuracy >= 80 ? 'Excellent!' : accuracy >= 60 ? 'Great Job!' : accuracy >= 40 ? 'Good Try!' : 'Keep Practicing!'}
        </Text>
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginBottom: 24 }}>
          {config.title} completed
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, width: '100%', maxWidth: 320, marginBottom: 32 }}>
          <Card style={{ width: '47%', alignItems: 'center' }} padding={16}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: colors.primary, marginBottom: 4 }}>{score}/{totalQuestions}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Score</Text>
          </Card>
          <Card style={{ width: '47%', alignItems: 'center' }} padding={16}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: colors.accent, marginBottom: 4 }}>{accuracy}%</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Accuracy</Text>
          </Card>
          <Card style={{ width: '47%', alignItems: 'center' }} padding={16}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: colors.warning, marginBottom: 4 }}>+{xp}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>XP Earned</Text>
          </Card>
          <Card style={{ width: '47%', alignItems: 'center' }} padding={16}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: colors.error, marginBottom: 4 }}>{avgTime}s</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>Avg Time</Text>
          </Card>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, width: '100%', maxWidth: 320 }}>
          <View style={{ flex: 1 }}>
            <Button variant="secondary" onPress={() => navigation.goBack()} fullWidth>Back</Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={startGame} fullWidth>Play Again</Button>
          </View>
        </View>
      </View>
    );
  }

  // ===== Playing Phase =====
  const question = questions[currentQ];
  if (!question) return null;
  const timerPercent = (timeLeft / config.duration) * 100;

  // Parse stroop tag
  let stroopData: { color: string; word: string } | null = null;
  let displayPrompt = question.prompt;
  const stroopMatch = question.prompt.match(/##STROOP##([^#]+)##([^#]+)##/);
  if (stroopMatch) {
    stroopData = { color: stroopMatch[1], word: stroopMatch[2] };
    displayPrompt = question.prompt.replace(/##STROOP##[^#]+##[^#]+##/, '');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16, paddingBottom: 32 }}>
      {/* Top Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity onPress={() => { if (timerRef.current) clearInterval(timerRef.current); navigation.goBack(); }}>
          <Text style={{ fontSize: 24, color: colors.textSecondary }}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>
          {currentQ + 1} / {totalQuestions}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '700', color: timeLeft <= 10 ? colors.error : colors.text }}>
          {timeLeft}s
        </Text>
      </View>

      {/* Timer Bar */}
      <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.bgTertiary, marginBottom: 24 }}>
        <View style={{
          height: '100%', borderRadius: 2,
          backgroundColor: timeLeft <= 10 ? colors.error : config.color,
          width: `${timerPercent}%`,
        }} />
      </View>

      {/* Progress Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
        {questions.map((_, i) => (
          <View key={i} style={{
            width: 8, height: 8, borderRadius: 4,
            backgroundColor: i < currentQ ? (answers[i]?.correct ? colors.success : colors.error)
              : i === currentQ ? config.color : colors.bgTertiary,
          }} />
        ))}
      </View>

      {/* Question */}
      <View style={{ alignItems: 'center', marginBottom: 32, minHeight: 120, justifyContent: 'center' }}>
        <Text style={{
          fontSize: 18, fontWeight: '600', color: colors.text,
          lineHeight: 28, textAlign: 'center', maxWidth: 360,
        }}>
          {displayPrompt}
        </Text>
        {stroopData && (
          <Text style={{ fontSize: 48, fontWeight: '900', color: stroopData.color, marginTop: 16 }}>
            {stroopData.word}
          </Text>
        )}
      </View>

      {/* Options */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
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
            <TouchableOpacity
              key={i}
              onPress={() => handleAnswer(i)}
              disabled={showFeedback}
              activeOpacity={0.7}
              style={{
                width: (SCREEN_WIDTH - 44) / 2,
                padding: 16, borderRadius: 14, borderWidth: 2, borderColor,
                backgroundColor: bg, alignItems: 'center', justifyContent: 'center', minHeight: 56,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: textColor, textAlign: 'center' }}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback */}
      {showFeedback && question.explanation && (
        <Text style={{
          textAlign: 'center', fontSize: 13, color: colors.textSecondary,
          marginTop: 16, maxWidth: 360, alignSelf: 'center',
        }}>
          {question.explanation}
        </Text>
      )}
    </View>
  );
};

export default GameEngineScreen;
