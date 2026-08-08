"use client";

import React, { useState } from "react";
import { ExploreContent } from "@/components/ExploreContent";
import { WizardPortal } from "@/components/WizardPortal";
import { Footer } from "@/components/Footer";

export default function ExplorePage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "26",
    weightKg: "75",
    targetWeightKg: "70",
    fitnessGoal: "Fat Loss & Muscle Shredding",
    workoutDays: "4-5 Days / Week",
  });

  const getProgressPercentage = () => {
    switch (currentStep) {
      case 1:
        return 10;
      case 2:
        return 40;
      case 3:
        return 75;
      case 4:
        return 100;
      default:
        return 10;
    }
  };

  return (
    <>
      <WizardPortal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        formData={formData}
        setFormData={setFormData}
        getProgressPercentage={getProgressPercentage}
      />
      <ExploreContent onOpenWizard={() => {
        setWizardOpen(true);
        setCurrentStep(1);
      }} />
      <Footer forceRender />
    </>
  );
}
