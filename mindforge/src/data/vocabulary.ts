import { VocabularyWord } from '../types';

const today = new Date().toISOString().split('T')[0];

function makeWord(
  id: string, word: string, definition: string, partOfSpeech: string,
  pronunciation: string, examples: string[], synonyms: string[],
  antonyms: string[], difficulty: VocabularyWord['difficulty']
): VocabularyWord {
  return {
    id, word, definition, partOfSpeech, pronunciation,
    exampleSentences: examples, synonyms, antonyms, difficulty,
    dateAdded: today, isPinned: false, reviewCount: 0,
    nextReviewDate: today, easeFactor: 2.5, interval: 1,
  };
}

export const vocabularyBank: VocabularyWord[] = [
  makeWord('v1', 'Ephemeral', 'Lasting for a very short time', 'adjective', '/ɪˈfem.ər.əl/',
    ['The ephemeral beauty of cherry blossoms makes them all the more precious.', 'Social media posts feel ephemeral, disappearing from feeds within hours.'],
    ['Transient', 'Fleeting', 'Momentary', 'Brief'], ['Permanent', 'Enduring', 'Lasting'], 'intermediate'),
  makeWord('v2', 'Ubiquitous', 'Present, appearing, or found everywhere', 'adjective', '/juːˈbɪk.wɪ.təs/',
    ['Smartphones have become ubiquitous in modern society.', 'Coffee shops are ubiquitous in downtown Seattle.'],
    ['Omnipresent', 'Pervasive', 'Universal'], ['Rare', 'Scarce', 'Uncommon'], 'intermediate'),
  makeWord('v3', 'Pragmatic', 'Dealing with things sensibly and realistically', 'adjective', '/præɡˈmæt.ɪk/',
    ['She took a pragmatic approach to solving the budget crisis.', 'Being pragmatic sometimes means compromising on ideals.'],
    ['Practical', 'Realistic', 'Sensible'], ['Idealistic', 'Impractical', 'Unrealistic'], 'intermediate'),
  makeWord('v4', 'Eloquent', 'Fluent or persuasive in speaking or writing', 'adjective', '/ˈel.ə.kwənt/',
    ['Her eloquent speech moved the entire audience to tears.', 'The author is known for his eloquent prose style.'],
    ['Articulate', 'Fluent', 'Expressive'], ['Inarticulate', 'Tongue-tied', 'Incoherent'], 'intermediate'),
  makeWord('v5', 'Resilient', 'Able to recover quickly from difficulties', 'adjective', '/rɪˈzɪl.i.ənt/',
    ['Children are remarkably resilient and can adapt to new situations quickly.', 'The resilient economy bounced back after the recession.'],
    ['Tough', 'Hardy', 'Adaptable'], ['Fragile', 'Vulnerable', 'Weak'], 'beginner'),
  makeWord('v6', 'Ambiguous', 'Open to more than one interpretation', 'adjective', '/æmˈbɪɡ.ju.əs/',
    ['The politician gave an ambiguous answer to avoid committing to a position.', 'The ending of the novel was deliberately ambiguous.'],
    ['Vague', 'Unclear', 'Equivocal'], ['Clear', 'Unambiguous', 'Definite'], 'intermediate'),
  makeWord('v7', 'Cacophony', 'A harsh, discordant mixture of sounds', 'noun', '/kəˈkɒf.ən.i/',
    ['The cacophony of car horns filled the busy intersection.', 'A cacophony of voices erupted when the verdict was announced.'],
    ['Discord', 'Din', 'Racket'], ['Harmony', 'Melody', 'Euphony'], 'advanced'),
  makeWord('v8', 'Diligent', 'Having or showing care in one\'s work or duties', 'adjective', '/ˈdɪl.ɪ.dʒənt/',
    ['The diligent student spent hours preparing for the exam.', 'Through diligent effort, she mastered three languages.'],
    ['Industrious', 'Assiduous', 'Conscientious'], ['Lazy', 'Negligent', 'Careless'], 'beginner'),
  makeWord('v9', 'Sycophant', 'A person who acts obsequiously toward someone important to gain advantage', 'noun', '/ˈsɪk.ə.fænt/',
    ['The CEO surrounded himself with sycophants who never challenged his ideas.', 'She refused to become a sycophant just to get promoted.'],
    ['Flatterer', 'Toady', 'Yes-man'], ['Critic', 'Detractor', 'Opponent'], 'advanced'),
  makeWord('v10', 'Tenacious', 'Tending to keep a firm hold; persistent', 'adjective', '/tɪˈneɪ.ʃəs/',
    ['Her tenacious pursuit of justice inspired a generation of activists.', 'The tenacious ivy clung to the old brick wall.'],
    ['Persistent', 'Determined', 'Dogged'], ['Yielding', 'Irresolute', 'Weak-willed'], 'intermediate'),
  makeWord('v11', 'Meticulous', 'Showing great attention to detail; very careful', 'adjective', '/mɪˈtɪk.jʊ.ləs/',
    ['The meticulous craftsman spent weeks perfecting each piece.', 'She kept meticulous records of every transaction.'],
    ['Thorough', 'Precise', 'Painstaking'], ['Careless', 'Sloppy', 'Negligent'], 'intermediate'),
  makeWord('v12', 'Gregarious', 'Fond of company; sociable', 'adjective', '/ɡrɪˈɡeə.ri.əs/',
    ['His gregarious nature made him the life of every party.', 'Dolphins are gregarious animals that live in pods.'],
    ['Sociable', 'Outgoing', 'Convivial'], ['Introverted', 'Reclusive', 'Antisocial'], 'advanced'),
  makeWord('v13', 'Benevolent', 'Well-meaning and kindly', 'adjective', '/bɪˈnev.əl.ənt/',
    ['The benevolent donor funded scholarships for underprivileged students.', 'She was known for her benevolent spirit and generous heart.'],
    ['Kind', 'Charitable', 'Generous'], ['Malevolent', 'Cruel', 'Selfish'], 'intermediate'),
  makeWord('v14', 'Juxtapose', 'To place close together for contrasting effect', 'verb', '/ˈdʒʌk.stə.pəʊz/',
    ['The artist liked to juxtapose light and dark elements in her paintings.', 'The documentary juxtaposes wealth and poverty in the same city.'],
    ['Compare', 'Contrast', 'Set side by side'], ['Separate', 'Isolate', 'Distance'], 'advanced'),
  makeWord('v15', 'Candor', 'The quality of being open and honest in expression', 'noun', '/ˈkæn.dər/',
    ['I appreciate your candor in telling me exactly what you think.', 'The interview was remarkable for its unusual candor.'],
    ['Frankness', 'Honesty', 'Openness'], ['Deception', 'Dishonesty', 'Guile'], 'intermediate'),
  makeWord('v16', 'Paradigm', 'A typical example or pattern of something; a model', 'noun', '/ˈpær.ə.daɪm/',
    ['The internet created a new paradigm for how we access information.', 'Einstein\'s theory represented a paradigm shift in physics.'],
    ['Model', 'Pattern', 'Framework'], ['Anomaly', 'Exception', 'Deviation'], 'advanced'),
  makeWord('v17', 'Altruistic', 'Showing a selfless concern for the well-being of others', 'adjective', '/ˌæl.truˈɪs.tɪk/',
    ['Her altruistic nature led her to volunteer at the shelter every weekend.', 'The altruistic donation saved the community center from closing.'],
    ['Selfless', 'Generous', 'Philanthropic'], ['Selfish', 'Self-centered', 'Greedy'], 'intermediate'),
  makeWord('v18', 'Esoteric', 'Intended for or understood by only a small number of people', 'adjective', '/ˌes.əˈter.ɪk/',
    ['The professor\'s esoteric lectures were only appreciated by advanced students.', 'Quantum mechanics remains esoteric to most people.'],
    ['Obscure', 'Arcane', 'Abstruse'], ['Common', 'Accessible', 'Mainstream'], 'advanced'),
  makeWord('v19', 'Persevere', 'To continue in a course of action despite difficulty', 'verb', '/ˌpɜː.sɪˈvɪər/',
    ['Despite numerous setbacks, she persevered and eventually succeeded.', 'You must persevere through the difficult early stages of learning.'],
    ['Persist', 'Endure', 'Continue'], ['Quit', 'Surrender', 'Give up'], 'beginner'),
  makeWord('v20', 'Serendipity', 'The occurrence of events by chance in a happy way', 'noun', '/ˌser.ənˈdɪp.ɪ.ti/',
    ['It was pure serendipity that they met at the bookstore that day.', 'Many scientific discoveries have been made through serendipity.'],
    ['Fortune', 'Luck', 'Chance'], ['Misfortune', 'Design', 'Planning'], 'advanced'),
  makeWord('v21', 'Prolific', 'Present in large numbers or quantities; plentiful', 'adjective', '/prəˈlɪf.ɪk/',
    ['Shakespeare was one of the most prolific writers in literary history.', 'The prolific artist produced over 500 paintings in her career.'],
    ['Productive', 'Abundant', 'Fertile'], ['Unproductive', 'Barren', 'Scarce'], 'intermediate'),
  makeWord('v22', 'Nostalgia', 'A sentimental longing for the past', 'noun', '/nɒˈstæl.dʒə/',
    ['The old photographs filled her with nostalgia for her childhood.', 'There is a growing nostalgia for the simplicity of life before smartphones.'],
    ['Longing', 'Wistfulness', 'Yearning'], ['Indifference', 'Apathy'], 'beginner'),
  makeWord('v23', 'Enigmatic', 'Difficult to interpret or understand; mysterious', 'adjective', '/ˌen.ɪɡˈmæt.ɪk/',
    ['The Mona Lisa\'s enigmatic smile has fascinated viewers for centuries.', 'He remained enigmatic, never revealing his true intentions.'],
    ['Mysterious', 'Puzzling', 'Cryptic'], ['Obvious', 'Transparent', 'Clear'], 'advanced'),
  makeWord('v24', 'Innovative', 'Featuring new methods; advanced and original', 'adjective', '/ˈɪn.ə.veɪ.tɪv/',
    ['The company is known for its innovative approach to renewable energy.', 'Innovative teaching methods can transform student engagement.'],
    ['Creative', 'Original', 'Inventive'], ['Conservative', 'Traditional', 'Conventional'], 'beginner'),
  makeWord('v25', 'Quintessential', 'Representing the most perfect example of a quality', 'adjective', '/ˌkwɪn.tɪˈsen.ʃəl/',
    ['Paris is the quintessential romantic city.', 'She is the quintessential professional — always prepared and composed.'],
    ['Archetypal', 'Classic', 'Definitive'], ['Atypical', 'Unusual', 'Uncharacteristic'], 'advanced'),
  makeWord('v26', 'Empathy', 'The ability to understand and share the feelings of another', 'noun', '/ˈem.pə.θi/',
    ['A good leader shows empathy toward their team members.', 'Reading fiction has been shown to increase empathy.'],
    ['Compassion', 'Understanding', 'Sympathy'], ['Apathy', 'Indifference', 'Callousness'], 'beginner'),
  makeWord('v27', 'Anomaly', 'Something that deviates from what is standard or expected', 'noun', '/əˈnɒm.əl.i/',
    ['The warm December weather was an anomaly for the region.', 'Scientists investigated the anomaly in the data.'],
    ['Irregularity', 'Deviation', 'Aberration'], ['Norm', 'Standard', 'Regularity'], 'intermediate'),
  makeWord('v28', 'Verbose', 'Using or expressed in more words than are needed', 'adjective', '/vɜːˈbəʊs/',
    ['His verbose writing style made the report twice as long as necessary.', 'Try not to be too verbose in your cover letter.'],
    ['Wordy', 'Long-winded', 'Prolix'], ['Concise', 'Succinct', 'Brief'], 'intermediate'),
];

export function getDailyWords(date: string): VocabularyWord[] {
  const dateNum = new Date(date).getTime();
  const dayIndex = Math.floor(dateNum / (1000 * 60 * 60 * 24)) % vocabularyBank.length;
  const words: VocabularyWord[] = [];
  for (let i = 0; i < 3; i++) {
    const idx = (dayIndex + i * 7) % vocabularyBank.length;
    words.push({ ...vocabularyBank[idx], dateAdded: date });
  }
  return words;
}
