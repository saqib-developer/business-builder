"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import {
  OnboardingData,
  LogoSetup,
  SocialMediaSetup,
  WebsiteSetup,
} from "@/lib/types/onboarding";
import Step1Introduction from "@/components/onboarding/Step1Introduction";
import Step2BusinessName from "@/components/onboarding/Step2BusinessName";
import Step3LogoSetup from "@/components/onboarding/Step3LogoSetup";
import Step4SocialMedia from "@/components/onboarding/Step4SocialMedia";
import Step5WebsiteBuilder from "@/components/onboarding/Step5WebsiteBuilder";
import { FiCheck } from "react-icons/fi";

function OnboardingContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>(
    {
      completedSteps: [],
    }
  );

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (!user) {
      router.push("/sign-in?redirect=/onboarding");
      return;
    }

    // Check if user wants to edit a specific step
    const stepParam = searchParams.get("step");

    // Load saved onboarding data from localStorage
    const saved = localStorage.getItem(`onboarding_${user.id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setOnboardingData(data);

        // If step parameter is provided, go to that step
        if (stepParam) {
          const requestedStep = parseInt(stepParam);
          if (requestedStep >= 1 && requestedStep <= 5) {
            setCurrentStep(requestedStep);
            return;
          }
        }

        // Otherwise, resume from last incomplete step
        if (data.completedSteps && data.completedSteps.length > 0) {
          const lastStep = Math.max(...data.completedSteps);
          setCurrentStep(lastStep + 1 > 5 ? 5 : lastStep + 1);
        }
      } catch (error) {
        console.error("Error loading onboarding data:", error);
      }
    } else if (stepParam) {
      // If no saved data but step param exists, go to that step
      const requestedStep = parseInt(stepParam);
      if (requestedStep >= 1 && requestedStep <= 5) {
        setCurrentStep(requestedStep);
      }
    }
  }, [user, router, searchParams]);

  const saveProgress = (data: Partial<OnboardingData>) => {
    if (user) {
      const updatedData = {
        ...data,
        userId: user.id,
        updatedAt: new Date(),
      };
      localStorage.setItem(
        `onboarding_${user.id}`,
        JSON.stringify(updatedData)
      );
      setOnboardingData(updatedData);
    }
  };

  const markStepComplete = (step: number) => {
    const completedSteps = [...(onboardingData.completedSteps || [])];
    if (!completedSteps.includes(step)) {
      completedSteps.push(step);
    }
    return completedSteps;
  };

  const isEditing = onboardingData?.isComplete === true;

  const handleSaveAndReturn = () => {
    router.push("/dashboard");
  };

  const handleStep2Complete = (businessName: string) => {
    const completedSteps = markStepComplete(2);
    saveProgress({
      ...onboardingData,
      businessName,
      completedSteps,
    });
    if (isEditing) {
      router.push("/dashboard");
    } else {
      setCurrentStep(3);
    }
  };

  const handleStep3Complete = (logoData: LogoSetup) => {
    const completedSteps = markStepComplete(3);
    saveProgress({
      ...onboardingData,
      logo: logoData,
      completedSteps,
    });
    if (isEditing) {
      router.push("/dashboard");
    } else {
      setCurrentStep(4);
    }
  };

  const handleStep4Complete = (socialData: SocialMediaSetup) => {
    const completedSteps = markStepComplete(4);
    saveProgress({
      ...onboardingData,
      socialMedia: socialData,
      completedSteps,
    });
    if (isEditing) {
      router.push("/dashboard");
    } else {
      setCurrentStep(5);
    }
  };

  const handleStep5Complete = (websiteData: WebsiteSetup) => {
    const completedSteps = markStepComplete(5);
    const finalData = {
      ...onboardingData,
      website: websiteData,
      completedSteps,
      isComplete: true,
    };
    saveProgress(finalData);

    // Redirect to dashboard
    router.push("/dashboard");
  };

  const steps = [
    { number: 1, name: "Welcome" },
    { number: 2, name: "Business Name" },
    { number: 3, name: "Logo" },
    { number: 4, name: "Social Media" },
    { number: 5, name: "Website" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Progress Bar */}
      {currentStep > 1 && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        currentStep > step.number
                          ? "bg-green-500 text-white"
                          : currentStep === step.number
                          ? "bg-blue-600 text-white ring-4 ring-blue-200"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 font-medium ${
                        currentStep >= step.number
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 rounded transition-all ${
                        currentStep > step.number
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="max-w-7xl mx-auto">
        {currentStep === 1 && (
          <Step1Introduction onNext={() => setCurrentStep(2)} />
        )}

        {currentStep === 2 && (
          <Step2BusinessName
            initialValue={onboardingData.businessName}
            onNext={handleStep2Complete}
            onBack={isEditing ? handleSaveAndReturn : () => setCurrentStep(1)}
            isEditing={isEditing}
          />
        )}

        {currentStep === 3 && (
          <Step3LogoSetup
            initialValue={onboardingData.logo}
            onNext={handleStep3Complete}
            onBack={isEditing ? handleSaveAndReturn : () => setCurrentStep(2)}
            isEditing={isEditing}
          />
        )}

        {currentStep === 4 && (
          <Step4SocialMedia
            initialValue={onboardingData.socialMedia}
            onNext={handleStep4Complete}
            onBack={isEditing ? handleSaveAndReturn : () => setCurrentStep(3)}
            isEditing={isEditing}
          />
        )}

        {currentStep === 5 && (
          <Step5WebsiteBuilder
            businessName={onboardingData.businessName || "Your Business"}
            onNext={handleStep5Complete}
            onBack={() => setCurrentStep(4)}
          />
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
