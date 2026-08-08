export interface ServiceProgram {
  id: string;
  title: string;
  subtitle: string;
  category: "coaching" | "fat-loss" | "muscle-gain" | "nutrition" | "contest-prep";
  duration: string; // e.g. "12 Weeks", "Month-to-Month"
  price: number;
  currency: string;
  popular?: boolean;
  features: string[];
  description: string;
  idealFor: string;
  image: string;
}

export interface ConsultationSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM", "04:30 PM"
  available: boolean;
}

export interface ConsultationBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  fitnessGoal: string;
  activityLevel: string;
  medicalConditions?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  createdAt: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
}

export interface TrainerProfile {
  name: string;
  title: string;
  bio: string;
  experienceYears: number;
  clientsTrained: number;
  successRate: number; // percentage e.g. 98
  transformationsCompleted: number;
  certifications: string[];
  philosophy: string[];
  socials: {
    instagram: string;
    youtube: string;
    linkedin: string;
    twitter: string;
  };
  transformations: {
    id: string;
    clientName: string;
    duration: string;
    weightLostKg?: number;
    muscleGainedKg?: number;
    quote: string;
    imageBefore: string;
    imageAfter: string;
  }[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
  verifiedClient: boolean;
  transformationTag: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface PricingTier {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  price: number;
  currency: string;
  popular?: boolean;
  features: string[];
  ctaLabel: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  currentWeightKg?: number;
  targetWeightKg?: number;
  heightCm?: number;
  fitnessGoal?: string;
  activePlan?: string;
  consultationBookings: ConsultationBooking[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
