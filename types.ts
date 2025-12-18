
export type SubscriptionTier = 'Free' | 'Founder' | 'Operator' | 'Vanguard';
export type UserType = 'Student' | 'Freelancer' | 'Founder' | 'Business Owner' | 'Agency';

// StartupProfile stores the configuration and state of the user's venture
export interface StartupProfile {
  userType: UserType;
  problem: string;
  targetUser: string;
  monetization: string;
  stage: string;
  runwayMonths: number;
  monthlyBurn: number;
  executionStreak: number;
  validationScore: number;
  tier: SubscriptionTier;
}

export interface Decision {
  id: string;
  question: string;
  options: string[];
  selectedOption?: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface Task {
  id: string;
  label: string;
  description: string;
  estimatedTime: string;
  status: 'pending' | 'completed';
}

export interface CoFounderResponse {
  summary: string;
  nextAction: string;
  riskAlert: string;
  metric: string;
  task60Min: string;
  validationScore: number;
  insight?: string;
  decisions?: Decision[];
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  structuredData?: CoFounderResponse;
  timestamp: number;
}

export type AppView = 'dashboard' | 'tasks' | 'decisions' | 'health' | 'review' | 'billing';
