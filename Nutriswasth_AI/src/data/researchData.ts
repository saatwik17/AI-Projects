export interface PaperRef {
  authors: string;
  year: number;
  title: string;
  contribution: string;
}

export interface SDGItem {
  sdgNumber: number;
  sdgTitle: string;
  color: string;
  impactPoints: string[];
}

export const RESEARCH_PAPERS: PaperRef[] = [
  {
    authors: 'Kalpakoglou et al.',
    year: 2025,
    title: 'An AI-based nutrition recommendation system: technical validation with insights from global cuisine',
    contribution: 'Provides the primary technical foundation for rule-based multi-factor weekly meal plan generation and expert-validated food databases.',
  },
  {
    authors: 'Sharma & Gaur',
    year: 2024,
    title: 'Optimizing Nutritional Outcomes: The Role of AI in Personalized Diet Planning',
    contribution: 'Demonstrates why individualized machine learning meal plans achieve higher adherence and better health outcomes than static generic diet charts.',
  },
  {
    authors: 'Malve, Mahajan, Mali, Waghmare, & Pagar',
    year: 2024,
    title: 'AI Based Web Application for Diet Planning and Recipe Generation',
    contribution: 'Pioneered web-based diet planners combining machine learning and ingredient availability for custom meal recipes.',
  },
  {
    authors: 'NutriAI Research Group',
    year: 2024,
    title: 'NutriAI: An Intelligent Nutrition Planning System for School Students',
    contribution: 'Proves the value of target group user profiling (age, routine, hostel constraints) in improving recommendation adoption.',
  },
  {
    authors: 'Mamatha, Gurudev, Karthik, & Sree Vishnu',
    year: 2025,
    title: 'Smart Health Diet Planner',
    contribution: 'Highlights practical web application architectures, interactive dashboards, and voice/scanning integrations.',
  },
  {
    authors: 'Adarsh Raj, Jyoti Gautam, & Rockey Kumar',
    year: 2026,
    title: 'AI-Based Personalized Nutrition and Diet Planner',
    contribution: 'Supports computer vision and adaptive daily health data tracking for continuous plan optimization.',
  },
  {
    authors: 'Panayotova',
    year: 2025,
    title: 'Artificial Intelligence in Nutrition and Dietetics: A Comprehensive Review',
    contribution: 'Highlights current AI gaps in cultural customization, transparency, and low-resource accessibility that NutriSwasth solves.',
  },
];

export const SYSTEM_LIMITATIONS_COMPARISON = [
  {
    dimension: 'Cuisine & Regional Scope',
    globalAINR: 'Limited to global/western cuisines (Spanish, Japanese, Western fast food).',
    nutriSwasthAI: '100% Indian regional foods (North, South, East, West, Jain, Halal, Veg, Non-Veg).',
  },
  {
    dimension: 'Real User Demographics',
    globalAINR: 'Tested mainly on synthetic ideal user profiles without age/lifestyle diversity.',
    nutriSwasthAI: 'Supports children, teenagers, college students, working adults, and senior citizens.',
  },
  {
    dimension: 'Dynamic Routine Context',
    globalAINR: 'Static weekly charts that ignore daily stress, exams, or travel routine shifts.',
    nutriSwasthAI: 'Real-time mood & context awareness (Exam/Deadline days, High-Stress, Travel, Normal days).',
  },
  {
    dimension: 'Affordability & Preparation',
    globalAINR: 'Ignores local food cost, hostel mess constraints, and cooking times.',
    nutriSwasthAI: 'Stores cost estimates in INR (₹), hostel mess compatibility, and quick prep times.',
  },
  {
    dimension: 'Lifestyle Risk Interventions',
    globalAINR: 'No consideration for smoking, alcohol, or oxidative stress countermeasures.',
    nutriSwasthAI: 'Risk-aware module adding antioxidant Vitamin C boosts and liver-supportive nutrients.',
  },
  {
    dimension: 'Interactive AI & Voice',
    globalAINR: 'Static tabular output without interactive natural language or voice assistance.',
    nutriSwasthAI: 'Conversational Gemini AI Chatbot with speech-to-text voice interaction.',
  },
];

export const SDG_ALIGNMENT: SDGItem[] = [
  {
    sdgNumber: 3,
    sdgTitle: 'Good Health & Well-Being',
    color: '#43a047',
    impactPoints: [
      'Promotes balanced Indian meals tailored to blood sugar control, hypertension, and weight management.',
      'Reduces long-term lifestyle disease risks through stress-aware and lifestyle risk (smoking/alcohol) dietary countermeasures.',
      'Improves health literacy through interactive Gemini AI nutrition guidance.',
    ],
  },
  {
    sdgNumber: 2,
    sdgTitle: 'Zero Hunger (Improved Nutrition Quality)',
    color: '#e53935',
    impactPoints: [
      'Shifts focus from empty calorie counting to nutrient-dense Indian foods (pulses, sprouts, millets).',
      'Enables students and budget-constrained families to eat balanced meals under ₹100-₹200/day.',
    ],
  },
  {
    sdgNumber: 12,
    sdgTitle: 'Responsible Consumption & Production',
    color: '#f57c00',
    impactPoints: [
      'Encourages shift away from ultra-processed junk foods and excessive alcohol towards local staples.',
      'Reduces food waste through planned weekly grocery shopping lists with exact portioning.',
    ],
  },
];
