/**
 * Static content banks for quiz games.
 * Banks are tiered (easy → hard) so generators can scale with the
 * player's adaptive difficulty level.
 */

// ===== Reading: comprehension passages =====
export interface Passage {
  text: string;
  q: string;
  options: string[];
  correct: number;
}

export const readingPassages: Passage[] = [
  { text: 'The octopus is widely regarded as the most intelligent invertebrate. Studies show they can solve puzzles, use tools, and even escape from enclosures. Their ability to change color and texture allows them to camouflage instantly.', q: 'What makes the octopus able to camouflage?', options: ['Ink production', 'Changing color and texture', 'Hard shell', 'Long tentacles'], correct: 1 },
  { text: 'The Great Wall of China stretches over 13,000 miles. Contrary to popular belief, it is not visible from space with the naked eye. Construction began in the 7th century BC and continued for over 2,000 years.', q: 'How long did construction of the Great Wall take?', options: ['100 years', '500 years', 'Over 2,000 years', '13,000 years'], correct: 2 },
  { text: 'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible. Its low moisture content and acidic pH create an inhospitable environment for bacteria.', q: 'Why does honey not spoil?', options: ['It is artificial', 'Low moisture and acidic pH', 'It contains preservatives', 'It is heated'], correct: 1 },
  { text: 'The Amazon rainforest produces about 20% of the world\'s oxygen. It is home to 10% of all species on Earth. Deforestation threatens this ecosystem, with about 17% of the forest lost in the last 50 years.', q: 'What percentage of Earth\'s species live in the Amazon?', options: ['5%', '10%', '20%', '50%'], correct: 1 },
  { text: 'Sleep is essential for memory consolidation. During deep sleep, the brain replays and strengthens neural connections formed during the day. Adults who get less than 7 hours of sleep show reduced cognitive performance.', q: 'When does memory consolidation primarily occur?', options: ['While eating', 'During exercise', 'During deep sleep', 'While reading'], correct: 2 },
  { text: 'Photosynthesis converts sunlight into chemical energy. Plants absorb carbon dioxide and water, using light energy to produce glucose and oxygen. This process is fundamental to virtually all life on Earth.', q: 'What do plants produce during photosynthesis?', options: ['Carbon dioxide', 'Glucose and oxygen', 'Water only', 'Sunlight'], correct: 1 },
  { text: 'The human brain contains approximately 86 billion neurons. Each neuron can form thousands of connections with other neurons, creating a network of trillions of synapses. This complex network enables thought, memory, and consciousness.', q: 'Approximately how many neurons are in the human brain?', options: ['1 million', '1 billion', '86 billion', '1 trillion'], correct: 2 },
  { text: 'Coral reefs occupy less than 1% of the ocean floor yet support about 25% of all marine species. Rising ocean temperatures cause coral bleaching, threatening these vital ecosystems. Scientists estimate that 70% of coral reefs could be lost by 2050.', q: 'What percentage of the ocean floor do coral reefs occupy?', options: ['Less than 1%', 'About 10%', '25%', '50%'], correct: 0 },
  { text: 'Antarctica is the driest continent on Earth. Despite being covered in ice, some of its valleys have not seen rain or snow for nearly two million years. The ice sheet holds about 60% of the world\'s fresh water.', q: 'How much of the world\'s fresh water is held in Antarctica\'s ice sheet?', options: ['10%', '25%', '60%', '90%'], correct: 2 },
  { text: 'The printing press, invented by Johannes Gutenberg around 1440, transformed Europe. Books that once took months to copy by hand could be produced in days. Literacy spread rapidly, fueling the Renaissance and the Scientific Revolution.', q: 'What was a major effect of the printing press?', options: ['Books became rarer', 'Literacy spread rapidly', 'Handwriting improved', 'Libraries closed'], correct: 1 },
  { text: 'Bamboo is the fastest-growing plant on Earth — some species grow nearly a meter per day. Despite its tree-like appearance, bamboo is a grass. Its hollow structure gives it a strength-to-weight ratio rivaling steel.', q: 'Bamboo is classified as which type of plant?', options: ['A tree', 'A grass', 'A fern', 'A shrub'], correct: 1 },
  { text: 'Migratory birds navigate using a combination of the sun, stars, and Earth\'s magnetic field. Some species, like the Arctic tern, travel more than 70,000 kilometers each year, the longest migration of any animal.', q: 'Which bird has the longest migration of any animal?', options: ['Albatross', 'Swallow', 'Arctic tern', 'Stork'], correct: 2 },
];

// ===== Reading: main idea =====
export const mainIdeaPassages: Passage[] = [
  { text: 'Remote work has reshaped cities. With fewer commuters, downtown businesses that relied on office workers have struggled, while suburban cafes and coworking spaces have flourished. Urban planners are now rethinking what city centers are for.', q: 'What is the main idea?', options: ['Cafes are more profitable than offices', 'Remote work is changing how cities function', 'Commuting is good for business', 'City centers are obsolete'], correct: 1 },
  { text: 'A diet rich in vegetables, whole grains, and lean protein supports long-term health. Yet no single "superfood" provides every nutrient. Experts agree that overall dietary patterns matter far more than any individual ingredient.', q: 'What is the main idea?', options: ['Superfoods prevent disease', 'Protein is the most important nutrient', 'Overall diet matters more than single foods', 'Vegetables are overrated'], correct: 2 },
  { text: 'Learning a musical instrument changes the brain. Studies show musicians have enhanced connectivity between hemispheres and stronger auditory processing. These benefits appear at any age, though they are most pronounced in those who start young.', q: 'What is the main idea?', options: ['Only children benefit from music', 'Musical training reshapes the brain', 'Musicians hear better than others', 'Instruments are hard to learn'], correct: 1 },
  { text: 'Electric vehicles are getting cheaper as battery costs fall. In several countries, the lifetime cost of an EV is already below that of a gasoline car. Analysts expect purchase prices to reach parity within a few years.', q: 'What is the main idea?', options: ['Gasoline cars are unreliable', 'EVs are becoming cost-competitive', 'Batteries last forever', 'EVs are luxury items'], correct: 1 },
  { text: 'The placebo effect demonstrates the mind\'s influence on the body. Patients given sugar pills often report real improvement, especially for pain and anxiety. Researchers now study placebos not as nuisances, but as windows into self-healing.', q: 'What is the main idea?', options: ['Sugar pills cure disease', 'The mind can influence physical symptoms', 'Doctors deceive patients', 'Pain is imaginary'], correct: 1 },
  { text: 'Public libraries have quietly become community hubs. Beyond lending books, they offer job training, internet access, and safe spaces for students. In many towns, the library is the last truly free indoor public space.', q: 'What is the main idea?', options: ['Libraries are outdated', 'Books are no longer popular', 'Libraries now serve broad community needs', 'Internet access should be free'], correct: 2 },
  { text: 'Honeybees communicate through dance. A returning forager performs a "waggle dance" whose angle and duration encode the direction and distance of food. Hive mates decode the message and fly straight to the source.', q: 'What is the main idea?', options: ['Bees dance for exercise', 'Bees encode information in movement', 'Foragers get lost easily', 'Hives compete for food'], correct: 1 },
  { text: 'Procrastination is rarely about laziness. Psychologists find it is usually an emotion-regulation problem: we delay tasks that trigger anxiety or boredom. Effective fixes target the feeling, not the schedule.', q: 'What is the main idea?', options: ['Procrastinators are lazy', 'Schedules cure procrastination', 'Procrastination is driven by emotions', 'Boring tasks should be avoided'], correct: 2 },
  { text: 'Glaciers act as the planet\'s water towers, storing winter snow and releasing it gradually in summer. As they shrink, billions of people who depend on glacier-fed rivers face increasingly unreliable water supplies.', q: 'What is the main idea?', options: ['Glaciers are tourist attractions', 'Shrinking glaciers threaten water supplies', 'Rivers are drying up everywhere', 'Snowfall is increasing'], correct: 1 },
  { text: 'Handwriting notes beats typing for learning. Because writing by hand is slower, students must summarize rather than transcribe, which forces deeper processing. Studies consistently show better recall for handwritten notes.', q: 'What is the main idea?', options: ['Typing is becoming obsolete', 'Slow handwriting aids deeper learning', 'Students should avoid laptops entirely', 'Transcription improves memory'], correct: 1 },
];

// ===== Reading: fact check (passage + true/false statements) =====
export interface FactCheckSet {
  text: string;
  statements: { statement: string; isTrue: boolean }[];
}

export const factCheckSets: FactCheckSet[] = [
  {
    text: 'The Pacific Ocean is the largest and deepest ocean, covering about a third of Earth\'s surface. Its deepest point, the Challenger Deep in the Mariana Trench, lies nearly 11,000 meters below sea level.',
    statements: [
      { statement: 'The Pacific covers about a third of Earth\'s surface.', isTrue: true },
      { statement: 'The Challenger Deep is about 5,000 meters deep.', isTrue: false },
      { statement: 'The Pacific is the deepest ocean.', isTrue: true },
      { statement: 'The Mariana Trench is in the Atlantic Ocean.', isTrue: false },
    ],
  },
  {
    text: 'Marie Curie was the first person to win Nobel Prizes in two different sciences: physics in 1903 and chemistry in 1911. She discovered the elements polonium and radium with her husband Pierre.',
    statements: [
      { statement: 'Curie won Nobel Prizes in two different sciences.', isTrue: true },
      { statement: 'Her 1903 prize was in chemistry.', isTrue: false },
      { statement: 'She helped discover radium.', isTrue: true },
      { statement: 'She discovered uranium.', isTrue: false },
    ],
  },
  {
    text: 'The cheetah is the fastest land animal, reaching speeds of about 110 km/h in short bursts. Unlike most big cats, cheetahs cannot roar; they communicate with chirps and purrs. Their sprints last only 20 to 30 seconds before overheating forces them to stop.',
    statements: [
      { statement: 'Cheetahs can sustain top speed for several minutes.', isTrue: false },
      { statement: 'Cheetahs communicate with chirps.', isTrue: true },
      { statement: 'The cheetah is the fastest land animal.', isTrue: true },
      { statement: 'Cheetahs roar like lions.', isTrue: false },
    ],
  },
  {
    text: 'Venice is built on more than 100 small islands in a lagoon. Instead of roads, the city uses canals — over 150 of them — crossed by around 400 bridges. Wooden piles driven into the mud centuries ago still support many buildings.',
    statements: [
      { statement: 'Venice is built on a single large island.', isTrue: false },
      { statement: 'The city has over 150 canals.', isTrue: true },
      { statement: 'Around 400 bridges cross the canals.', isTrue: true },
      { statement: 'The buildings rest on steel foundations.', isTrue: false },
    ],
  },
  {
    text: 'The human heart beats roughly 100,000 times per day, pumping about 7,500 liters of blood. The heart has four chambers: two atria that receive blood and two ventricles that pump it out.',
    statements: [
      { statement: 'The heart beats about 100,000 times daily.', isTrue: true },
      { statement: 'The heart has six chambers.', isTrue: false },
      { statement: 'Ventricles pump blood out of the heart.', isTrue: true },
      { statement: 'The heart pumps about 750 liters per day.', isTrue: false },
    ],
  },
  {
    text: 'Mount Everest grows about 4 millimeters each year as tectonic plates collide. Its summit stands at 8,849 meters. Despite the name "the world\'s tallest mountain," Mauna Kea in Hawaii is taller when measured from its underwater base.',
    statements: [
      { statement: 'Everest grows about 4 mm per year.', isTrue: true },
      { statement: 'Everest\'s summit exceeds 9,000 meters.', isTrue: false },
      { statement: 'Mauna Kea is taller measured from its base.', isTrue: true },
      { statement: 'Everest is shrinking due to erosion.', isTrue: false },
    ],
  },
];

// ===== Reading: context clues (sentence completion), tiered =====
export interface ContextClue {
  sentence: string; // use ___ for the blank
  options: string[];
  correct: number;
  tier: 1 | 2 | 3;
}

export const contextClues: ContextClue[] = [
  { sentence: 'The room was so ___ that we could hear a pin drop.', options: ['noisy', 'silent', 'bright', 'crowded'], correct: 1, tier: 1 },
  { sentence: 'She was ___ after running the marathon and went straight to bed.', options: ['energetic', 'exhausted', 'cheerful', 'hungry'], correct: 1, tier: 1 },
  { sentence: 'The desert is extremely ___, receiving almost no rain all year.', options: ['humid', 'fertile', 'arid', 'cold'], correct: 2, tier: 1 },
  { sentence: 'He ___ his keys again, so he could not open the door.', options: ['found', 'polished', 'misplaced', 'copied'], correct: 2, tier: 1 },
  { sentence: 'The bridge was ___ after the flood, so cars had to take a detour.', options: ['impassable', 'widened', 'decorated', 'shortened'], correct: 0, tier: 1 },
  { sentence: 'Her argument was so ___ that even her critics were persuaded.', options: ['vague', 'compelling', 'quiet', 'brief'], correct: 1, tier: 2 },
  { sentence: 'The CEO gave a deliberately ___ answer to avoid committing to a date.', options: ['precise', 'evasive', 'enthusiastic', 'final'], correct: 1, tier: 2 },
  { sentence: 'After the scandal, the senator\'s support began to ___ rapidly.', options: ['flourish', 'stabilize', 'dwindle', 'expand'], correct: 2, tier: 2 },
  { sentence: 'The instructions were so ___ that nobody could follow them.', options: ['convoluted', 'simple', 'colorful', 'short'], correct: 0, tier: 2 },
  { sentence: 'A good mediator stays ___ rather than taking sides.', options: ['biased', 'impartial', 'absent', 'aggressive'], correct: 1, tier: 2 },
  { sentence: 'The witness\'s account was riddled with ___, so the jury doubted it.', options: ['details', 'discrepancies', 'compliments', 'statistics'], correct: 1, tier: 3 },
  { sentence: 'Years of drought ___ the once-fertile valley into a dust bowl.', options: ['transformed', 'restored', 'irrigated', 'preserved'], correct: 0, tier: 3 },
  { sentence: 'His ___ remarks alienated colleagues who had once admired him.', options: ['diplomatic', 'caustic', 'flattering', 'timid'], correct: 1, tier: 3 },
  { sentence: 'The treaty proved ___, collapsing within months of being signed.', options: ['durable', 'tenuous', 'celebrated', 'binding'], correct: 1, tier: 3 },
  { sentence: 'She offered only a ___ apology, clearly unmoved by the complaint.', options: ['heartfelt', 'perfunctory', 'lengthy', 'tearful'], correct: 1, tier: 3 },
];

// ===== Focus: odd one out, tiered =====
export interface OddSet {
  items: string[];
  odd: number;
  reason: string;
  tier: 1 | 2 | 3;
}

export const oddOneOutSets: OddSet[] = [
  { items: ['Dog', 'Cat', 'Hammer', 'Bird'], odd: 2, reason: 'Hammer is not an animal', tier: 1 },
  { items: ['Piano', 'Violin', 'Painting', 'Guitar'], odd: 2, reason: 'Painting is not a musical instrument', tier: 1 },
  { items: ['Apple', 'Banana', 'Carrot', 'Orange'], odd: 2, reason: 'Carrot is a vegetable', tier: 1 },
  { items: ['Running', 'Swimming', 'Reading', 'Cycling'], odd: 2, reason: 'Reading is not physical exercise', tier: 1 },
  { items: ['Red', 'Blue', 'Loud', 'Green'], odd: 2, reason: 'Loud is not a color', tier: 1 },
  { items: ['Mars', 'Venus', 'Moon', 'Jupiter'], odd: 2, reason: 'The Moon is not a planet', tier: 2 },
  { items: ['Triangle', 'Square', 'Sphere', 'Rectangle'], odd: 2, reason: 'A sphere is 3D; the others are 2D', tier: 2 },
  { items: ['Mercury', 'Iron', 'Copper', 'Granite'], odd: 3, reason: 'Granite is a rock, not a metal', tier: 2 },
  { items: ['Nile', 'Amazon', 'Sahara', 'Danube'], odd: 2, reason: 'The Sahara is a desert, not a river', tier: 2 },
  { items: ['Oak', 'Pine', 'Tulip', 'Maple'], odd: 2, reason: 'A tulip is a flower, not a tree', tier: 2 },
  { items: ['Sonnet', 'Haiku', 'Novel', 'Limerick'], odd: 2, reason: 'A novel is prose; the others are poems', tier: 3 },
  { items: ['Femur', 'Tibia', 'Bicep', 'Ulna'], odd: 2, reason: 'The bicep is a muscle, not a bone', tier: 3 },
  { items: ['Helium', 'Neon', 'Oxygen', 'Argon'], odd: 2, reason: 'Oxygen is not a noble gas', tier: 3 },
  { items: ['Cello', 'Viola', 'Oboe', 'Violin'], odd: 2, reason: 'The oboe is a woodwind, not a string instrument', tier: 3 },
  { items: ['Cumulus', 'Stratus', 'Tsunami', 'Cirrus'], odd: 2, reason: 'A tsunami is not a cloud type', tier: 3 },
  { items: ['Kilogram', 'Meter', 'Celsius', 'Second'], odd: 2, reason: 'Celsius is not an SI base unit', tier: 3 },
];

// ===== Verbal: synonyms, tiered =====
export interface WordPair {
  word: string;
  answer: string;
  wrongs: string[];
  tier: 1 | 2 | 3;
}

export const synonymPairs: WordPair[] = [
  { word: 'Happy', answer: 'Joyful', wrongs: ['Sad', 'Angry', 'Tired'], tier: 1 },
  { word: 'Fast', answer: 'Quick', wrongs: ['Slow', 'Heavy', 'Tall'], tier: 1 },
  { word: 'Big', answer: 'Large', wrongs: ['Small', 'Thin', 'Short'], tier: 1 },
  { word: 'Smart', answer: 'Clever', wrongs: ['Dull', 'Quiet', 'Loud'], tier: 1 },
  { word: 'Cold', answer: 'Chilly', wrongs: ['Warm', 'Soft', 'Damp'], tier: 1 },
  { word: 'Brave', answer: 'Courageous', wrongs: ['Afraid', 'Weak', 'Shy'], tier: 2 },
  { word: 'Begin', answer: 'Commence', wrongs: ['Conclude', 'Pause', 'Repeat'], tier: 2 },
  { word: 'Angry', answer: 'Furious', wrongs: ['Calm', 'Content', 'Sleepy'], tier: 2 },
  { word: 'Strange', answer: 'Peculiar', wrongs: ['Ordinary', 'Familiar', 'Plain'], tier: 2 },
  { word: 'Improve', answer: 'Enhance', wrongs: ['Worsen', 'Maintain', 'Ignore'], tier: 2 },
  { word: 'Honest', answer: 'Candid', wrongs: ['Deceitful', 'Reserved', 'Polite'], tier: 2 },
  { word: 'Praise', answer: 'Laud', wrongs: ['Criticize', 'Examine', 'Dismiss'], tier: 3 },
  { word: 'Hostile', answer: 'Antagonistic', wrongs: ['Amicable', 'Neutral', 'Indifferent'], tier: 3 },
  { word: 'Abundant', answer: 'Plentiful', wrongs: ['Scarce', 'Adequate', 'Modest'], tier: 3 },
  { word: 'Obstinate', answer: 'Stubborn', wrongs: ['Flexible', 'Agreeable', 'Hesitant'], tier: 3 },
  { word: 'Lucid', answer: 'Clear', wrongs: ['Murky', 'Dim', 'Dense'], tier: 3 },
  { word: 'Frugal', answer: 'Thrifty', wrongs: ['Wasteful', 'Generous', 'Wealthy'], tier: 3 },
];

// ===== Verbal: antonyms, tiered =====
export const antonymPairs: WordPair[] = [
  { word: 'Hot', answer: 'Cold', wrongs: ['Warm', 'Spicy', 'Bright'], tier: 1 },
  { word: 'Early', answer: 'Late', wrongs: ['Soon', 'First', 'Fast'], tier: 1 },
  { word: 'Empty', answer: 'Full', wrongs: ['Hollow', 'Open', 'Light'], tier: 1 },
  { word: 'Victory', answer: 'Defeat', wrongs: ['Battle', 'Triumph', 'Draw'], tier: 1 },
  { word: 'Expand', answer: 'Contract', wrongs: ['Grow', 'Stretch', 'Inflate'], tier: 2 },
  { word: 'Generous', answer: 'Stingy', wrongs: ['Kind', 'Wealthy', 'Careful'], tier: 2 },
  { word: 'Transparent', answer: 'Opaque', wrongs: ['Clear', 'Thin', 'Fragile'], tier: 2 },
  { word: 'Accept', answer: 'Reject', wrongs: ['Receive', 'Consider', 'Approve'], tier: 2 },
  { word: 'Permanent', answer: 'Temporary', wrongs: ['Stable', 'Lasting', 'Solid'], tier: 2 },
  { word: 'Scarcity', answer: 'Abundance', wrongs: ['Shortage', 'Poverty', 'Demand'], tier: 3 },
  { word: 'Benevolent', answer: 'Malevolent', wrongs: ['Charitable', 'Neutral', 'Gentle'], tier: 3 },
  { word: 'Verbose', answer: 'Concise', wrongs: ['Talkative', 'Eloquent', 'Loud'], tier: 3 },
  { word: 'Humble', answer: 'Arrogant', wrongs: ['Modest', 'Quiet', 'Honest'], tier: 3 },
  { word: 'Ephemeral', answer: 'Enduring', wrongs: ['Fleeting', 'Delicate', 'Sudden'], tier: 3 },
];

// ===== Verbal: analogies, tiered =====
export interface Analogy {
  prompt: string; // "Bird is to nest as bee is to ___"
  options: string[];
  correct: number;
  tier: 1 | 2 | 3;
}

export const analogies: Analogy[] = [
  { prompt: 'Puppy is to dog as kitten is to ___', options: ['Mouse', 'Cat', 'Lion', 'Bird'], correct: 1, tier: 1 },
  { prompt: 'Hand is to glove as foot is to ___', options: ['Leg', 'Toe', 'Sock', 'Floor'], correct: 2, tier: 1 },
  { prompt: 'Bird is to nest as bee is to ___', options: ['Honey', 'Hive', 'Flower', 'Wing'], correct: 1, tier: 1 },
  { prompt: 'Day is to night as summer is to ___', options: ['Spring', 'Heat', 'Winter', 'Autumn'], correct: 2, tier: 1 },
  { prompt: 'Author is to book as composer is to ___', options: ['Piano', 'Orchestra', 'Symphony', 'Concert'], correct: 2, tier: 2 },
  { prompt: 'Thermometer is to temperature as scale is to ___', options: ['Music', 'Weight', 'Height', 'Fish'], correct: 1, tier: 2 },
  { prompt: 'Sculptor is to marble as carpenter is to ___', options: ['Hammer', 'House', 'Wood', 'Nail'], correct: 2, tier: 2 },
  { prompt: 'Drought is to rain as famine is to ___', options: ['Food', 'Hunger', 'Crops', 'Water'], correct: 0, tier: 2 },
  { prompt: 'Library is to books as arsenal is to ___', options: ['Soldiers', 'Weapons', 'Wars', 'Forts'], correct: 1, tier: 2 },
  { prompt: 'Doctor is to diagnosis as detective is to ___', options: ['Crime', 'Clue', 'Deduction', 'Arrest'], correct: 2, tier: 3 },
  { prompt: 'Ephemeral is to permanence as turbulent is to ___', options: ['Chaos', 'Calm', 'Storm', 'Motion'], correct: 1, tier: 3 },
  { prompt: 'Miser is to generosity as coward is to ___', options: ['Fear', 'Bravery', 'Weakness', 'Retreat'], correct: 1, tier: 3 },
  { prompt: 'Archipelago is to islands as constellation is to ___', options: ['Planets', 'Stars', 'Galaxies', 'Comets'], correct: 1, tier: 3 },
  { prompt: 'Prologue is to novel as overture is to ___', options: ['Opera', 'Painting', 'Poem', 'Sculpture'], correct: 0, tier: 3 },
];

// ===== Verbal: scramble words, by length =====
export const scrambleWords: string[] = [
  // length 4–5
  'MIND', 'IDEA', 'CALM', 'GROW', 'WISE',
  'BRAIN', 'THINK', 'LEARN', 'FOCUS', 'SMART', 'QUICK', 'POWER', 'LOGIC', 'SHARP', 'AGILE',
  // length 6
  'MEMORY', 'PUZZLE', 'CLEVER', 'REASON', 'MENTAL', 'STEADY', 'BRIGHT', 'NIMBLE',
  // length 7+
  'PATTERN', 'IMPROVE', 'CAPABLE', 'ANALYZE', 'INSIGHT', 'TRAINING', 'DISCOVER', 'ATTENTION',
];

// ===== Speed: rapid sort categories, tiered =====
export interface SortBank {
  categories: Record<string, string[]>;
  tier: 1 | 2;
}

export const sortBanks: SortBank[] = [
  {
    tier: 1,
    categories: {
      Fruit: ['Apple', 'Banana', 'Orange', 'Mango', 'Grape', 'Peach'],
      Animal: ['Dog', 'Cat', 'Lion', 'Eagle', 'Horse', 'Whale'],
      Color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'],
    },
  },
  {
    tier: 2,
    categories: {
      Mammal: ['Dolphin', 'Bat', 'Elephant', 'Otter', 'Walrus'],
      Bird: ['Penguin', 'Ostrich', 'Falcon', 'Heron', 'Kiwi'],
      Reptile: ['Gecko', 'Iguana', 'Cobra', 'Tortoise', 'Chameleon'],
    },
  },
  {
    tier: 2,
    categories: {
      Planet: ['Mercury', 'Neptune', 'Saturn', 'Venus'],
      Element: ['Carbon', 'Helium', 'Sodium', 'Argon'],
      Country: ['Norway', 'Kenya', 'Chile', 'Vietnam'],
    },
  },
];

// ===== Memory board symbols =====
export const boardEmojiSet = ['◆', '●', '▲', '■', '★', '✦', '◐', '◭', '✚', '❖', '⬟', '◉'];
export const boardSymbolSet = ['Ω', 'Ψ', 'Φ', 'Δ', 'Σ', 'Λ', 'Ξ', 'Π', 'Θ', 'Γ', 'ζ', 'µ'];
