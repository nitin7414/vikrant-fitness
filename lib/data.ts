import { ServiceProgram, TrainerProfile, ConsultationSlot, ConsultationBooking, UserProfile } from "./types";

export const MOCK_SERVICES: ServiceProgram[] = [
  {
    id: "coaching-1on1",
    title: "1-on-1 Elite Personal Coaching",
    subtitle: "Comprehensive 12-week transformation customized exclusively for your body and lifestyle.",
    category: "coaching",
    duration: "12 Weeks",
    price: 499,
    currency: "USD",
    popular: true,
    features: [
      "Custom weekly workout plan tailored to your equipment & gym access",
      "Personalized macro & micronutrient meal strategy (Veg/Non-Veg options)",
      "Weekly 1-on-1 Video check-ins & real-time form correction via WhatsApp",
      "Supplements protocol & sleep recovery optimization",
      "24/7 Priority support & mindset coaching directly with Coach Vikrant"
    ],
    description: "Our flagship program designed for high achievers who want guaranteed physical and mental transformation without generic template routines.",
    idealFor: "Busy professionals, athletes, and anyone seeking elite accountability and tailored guidance.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "fat-loss-shred",
    title: "Rapid Fat Loss & Conditioning",
    subtitle: "Accelerated 8-week body recomposition program focused on burning stubborn fat while maintaining lean muscle.",
    category: "fat-loss",
    duration: "8 Weeks",
    price: 349,
    currency: "USD",
    popular: false,
    features: [
      "Targeted metabolic conditioning and strength splits",
      "Aggressive yet sustainable calorie deficit meal guides",
      "Heart rate & cardio intensity progression tracking",
      "Bi-weekly progress photo evaluations & calorie adjustments",
      "Access to private client community support"
    ],
    description: "Engineered to break plateaus and torch fat safely while protecting your hard-earned muscle mass.",
    idealFor: "Individuals wanting fast, visible fat reduction and athletic conditioning.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "muscle-hypertrophy",
    title: "Hypertrophy & Strength Blueprint",
    subtitle: "Science-backed hypertrophy protocol to build dense lean mass and increase overall raw power.",
    category: "muscle-gain",
    duration: "16 Weeks",
    price: 599,
    currency: "USD",
    popular: false,
    features: [
      "Periodized progressive overload training structure",
      "Clean bulking & lean mass caloric surplus nutrition plan",
      "Advanced lifting technique breakdowns and video analysis",
      "Deload strategy and joint longevity protocols",
      "Direct direct Q&A access with Coach Vikrant"
    ],
    description: "Maximize natural muscle building potential with biomechanically sound exercise selections and precise progressive overload.",
    idealFor: "Skinny-fat or intermediate lifters ready to pack on serious muscle density.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "custom-nutrition",
    title: "Precision Nutrition & Habits Coaching",
    subtitle: "A sustainable food philosophy designed around your culture, daily routine, and personal preferences.",
    category: "nutrition",
    duration: "Monthly",
    price: 199,
    currency: "USD",
    popular: false,
    features: [
      "Fully customized meal plan with exact gram measurements & recipes",
      "Flexible dieting & eating out strategies for social life",
      "Gut health & digestion optimization",
      "Daily habit tracker and metabolic health assessment",
      "Weekly plan recalibration based on biofeedback"
    ],
    description: "No starvation diets. Learn how to eat the foods you love while achieving your target physique effortlessly.",
    idealFor: "Anyone struggling with meal prep consistency, food relationships, or fat loss plateaus.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1200&auto=format&fit=crop"
  }
];

export const MOCK_TRAINER: TrainerProfile = {
  name: "Vikrant",
  title: "Founder & Elite Strength & Transformation Coach",
  bio: "With over 8+ years of dedicated coaching experience, Vikrant has helped hundreds of individuals worldwide break through physical limits, shed thousands of pounds of body fat, and build lasting, healthy habits.",
  experienceYears: 8,
  clientsTrained: 1250,
  successRate: 98,
  transformationsCompleted: 850,
  certifications: [
    "Certified Personal Trainer (ACE / NSCA)",
    "Precision Nutrition Level 2 Certified Coach",
    "Biomechanics & Hypertrophy Specialist",
    "Sports Injury Prevention & Rehabilitation"
  ],
  philosophy: [
    "Consistency trumps intensity every single time.",
    "Form and biomechanics come before heavy ego weights.",
    "Nutrition must fit your life, not ruin your lifestyle.",
    "True physical transformation builds unbreakable mental toughness."
  ],
  socials: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com"
  },
  transformations: [
    {
      id: "trans-1",
      clientName: "Rahul Sharma",
      duration: "16 Weeks",
      weightLostKg: 18,
      quote: "Working with Vikrant completely changed my life. I went from feeling sluggish every day to running 10k races and feeling confident in my skin.",
      imageBefore: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop",
      imageAfter: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "trans-2",
      clientName: "Ananya Patel",
      duration: "12 Weeks",
      muscleGainedKg: 4,
      weightLostKg: 8,
      quote: "The personalized attention to my busy schedule and diet preferences was the game changer. No cookie-cutter plans here!",
      imageBefore: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
      imageAfter: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "trans-3",
      clientName: "Marcus Vance",
      duration: "24 Weeks",
      weightLostKg: 25,
      muscleGainedKg: 6,
      quote: "Vikrant's focus on progressive overload and biomechanics saved my shoulders and built real muscle strength I never thought possible.",
      imageBefore: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      imageAfter: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop"
    }
  ]
};

export const MOCK_CONSULTATION_SLOTS: ConsultationSlot[] = [
  { id: "slot-1", date: "2026-08-10", time: "09:00 AM", available: true },
  { id: "slot-2", date: "2026-08-10", time: "11:30 AM", available: false },
  { id: "slot-3", date: "2026-08-10", time: "03:00 PM", available: true },
  { id: "slot-4", date: "2026-08-10", time: "06:00 PM", available: true },
  { id: "slot-5", date: "2026-08-11", time: "10:00 AM", available: true },
  { id: "slot-6", date: "2026-08-11", time: "02:30 PM", available: true },
  { id: "slot-7", date: "2026-08-11", time: "05:00 PM", available: false },
  { id: "slot-8", date: "2026-08-12", time: "09:30 AM", available: true },
  { id: "slot-9", date: "2026-08-12", time: "04:00 PM", available: true },
];

export const MOCK_BOOKINGS: ConsultationBooking[] = [
  {
    id: "bk-1001",
    name: "Alex Rivera",
    email: "alex@example.com",
    phone: "+1 555 0192",
    age: 29,
    gender: "Male",
    fitnessGoal: "Fat Loss & Muscle Building",
    activityLevel: "Moderate (2-3 workouts/week)",
    preferredDate: "2026-08-10",
    preferredTime: "09:00 AM",
    notes: "Interested in 1-on-1 coaching starting next week.",
    createdAt: "2026-08-07T14:30:00Z",
    status: "confirmed"
  }
];

export const MOCK_USER: UserProfile = {
  id: "usr-demo",
  name: "Vikrant Client",
  email: "demo@vikrantfitness.com",
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  currentWeightKg: 78,
  targetWeightKg: 70,
  heightCm: 175,
  fitnessGoal: "Fat Loss & Physique Conditioning",
  activePlan: "1-on-1 Elite Personal Coaching",
  consultationBookings: MOCK_BOOKINGS
};
