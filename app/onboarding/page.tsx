"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
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

function removeUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => removeUndefinedDeep(item))
      .filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object") {
    const cleaned = Object.entries(value as Record<string, unknown>).reduce(
      (acc, [key, entry]) => {
        if (entry === undefined) {
          return acc;
        }
        acc[key] = removeUndefinedDeep(entry);
        return acc;
      },
      {} as Record<string, unknown>,
    );
    return cleaned as T;
  }

  return value;
}

// Local helper function as `saveOnboardingData` was not officially exposed previously
async function saveOnboardingData(userId: string, data: Partial<OnboardingData>) {
  try {
    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);
    const sanitizedData = removeUndefinedDeep(data);

    if (userDoc.exists()) {
      await updateDoc(userRef, { onboarding: sanitizedData });
    } else {
      await setDoc(userRef, { onboarding: sanitizedData }, { merge: true });
    }
  } catch (error) {
    void error;
  }
}

function OnboardingContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDashboardEditMode =
    searchParams.get("source") === "dashboard" ||
    searchParams.get("mode") === "edit";
  const shouldOpenWebsiteCustomizer = searchParams.get("edit") === "true";
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>();
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (!user) {
      router.push("/sign-in?redirect=/onboarding");
      return;
    }

    if (initialDataLoaded) return; // Prevent double loads

    // Check if user wants to edit a specific step
    const stepParam = searchParams.get("step");

    // Load saved onboarding data from localStorage
    const saved = localStorage.getItem(`onboarding_${user.id}`);
    
    // Create an immutable reference scope so we update both state properties cleanly without chaining rules
    let loadedData: Partial<OnboardingData> = { completedSteps: [] };
    let initialStep = 1;
    
    if (saved) {
      try {
        const data = JSON.parse(saved);
        loadedData = data;
        
        // If step parameter is provided, go to that step
        if (stepParam) {
          const requestedStep = parseInt(stepParam);
          if (requestedStep >= 1 && requestedStep <= 5) {
            initialStep = requestedStep;
          }
        } 
        // Otherwise, resume from last incomplete step
        else if (data.completedSteps && data.completedSteps.length > 0) {
          const lastStep = Math.max(...data.completedSteps);
          initialStep = lastStep + 1 > 5 ? 5 : lastStep + 1;
        }
      } catch (error) {
        void error;
      }
    } else if (stepParam) {
      // If no saved data but step param exists, go to that step
      const requestedStep = parseInt(stepParam);
      if (requestedStep >= 1 && requestedStep <= 5) {
        initialStep = requestedStep;
      }
    }
    
    // Use timeout to bypass cascading render errors from sync effect boundaries.
    setTimeout(() => {
      setOnboardingData(loadedData);
      setCurrentStep(initialStep);
      setInitialDataLoaded(true);
    }, 0);
    
  }, [user, router, searchParams, initialDataLoaded]);

  // Make sure we have a fallback for when the loading yields nothing or initial state
  const currentOnboardingData = onboardingData || { completedSteps: [] };

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
    const completedSteps = [...(currentOnboardingData.completedSteps || [])];
    if (!completedSteps.includes(step)) {
      completedSteps.push(step);
    }
    return completedSteps;
  };

  const handleSaveAndReturn = () => {
    router.push("/dashboard");
  };

  const handleStep2Complete = (businessName: string) => {
    const completedSteps = markStepComplete(2);
    saveProgress({
      ...currentOnboardingData,
      businessName,
      completedSteps,
    });
    if (isDashboardEditMode) {
      router.push("/dashboard");
    } else {
      setCurrentStep(3);
    }
  };

  const handleStep3Complete = (logoData: LogoSetup) => {
    const completedSteps = markStepComplete(3);
    saveProgress({
      ...currentOnboardingData,
      logo: logoData,
      completedSteps,
    });
    if (isDashboardEditMode) {
      router.push("/dashboard");
    } else {
      setCurrentStep(4);
    }
  };

  const handleStep4Complete = (socialData: SocialMediaSetup) => {
    const completedSteps = markStepComplete(4);
    saveProgress({
      ...currentOnboardingData,
      socialMedia: socialData,
      completedSteps,
    });
    if (isDashboardEditMode) {
      router.push("/dashboard");
    } else {
      setCurrentStep(5);
    }
  };

  const handleStep5Complete = async (websiteData: WebsiteSetup) => {
    const completedSteps = markStepComplete(5);
    const finalData = {
      ...currentOnboardingData,
      website: websiteData,
      completedSteps,
      isComplete: true,
    };
    saveProgress(finalData);

    if (user) {
      await saveOnboardingData(user.id, finalData);
    }

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

  if (!user || !initialDataLoaded) {
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
      {!isDashboardEditMode && currentStep > 1 && (
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
            initialValue={currentOnboardingData.businessName}
            onNext={handleStep2Complete}
            onBack={isDashboardEditMode ? handleSaveAndReturn : () => setCurrentStep(1)}
            isEditing={isDashboardEditMode}
          />
        )}

        {currentStep === 3 && (
          <Step3LogoSetup
            initialValue={currentOnboardingData.logo}
            onNext={handleStep3Complete}
            onBack={isDashboardEditMode ? handleSaveAndReturn : () => setCurrentStep(2)}
            isEditing={isDashboardEditMode}
          />
        )}

        {currentStep === 4 && (
          <Step4SocialMedia
            initialValue={currentOnboardingData.socialMedia}
            onNext={handleStep4Complete}
            onBack={isDashboardEditMode ? handleSaveAndReturn : () => setCurrentStep(3)}
            isEditing={isDashboardEditMode}
          />
        )}

        {currentStep === 5 && (
          <Step5WebsiteBuilder
            businessName={currentOnboardingData.businessName || "Your Business"}
            initialData={currentOnboardingData.website}
            onNext={handleStep5Complete}
            onBack={isDashboardEditMode ? handleSaveAndReturn : () => setCurrentStep(4)}
            isEditing={isDashboardEditMode}
            openCustomizer={shouldOpenWebsiteCustomizer}
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
