"use client";

import { useMemo, useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { FiExternalLink, FiLoader, FiWifi, FiWifiOff } from "react-icons/fi";
import { firestore } from "@/lib/firebase";
import { OnboardingData } from "@/lib/types/onboarding";
import { getPrimaryLiveDomain, normalizeDomain } from "@/lib/storefront";
import { BiRocket } from "react-icons/bi";

interface LaunchStoreSectionProps {
  userId: string;
  onboardingData: Partial<OnboardingData> | null;
  onOnboardingDataUpdate: (next: Partial<OnboardingData>) => void;
}

function ConfettiBurst({ show }: { show: boolean }) {
  if (!show) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 28 }).map((_, index) => {
        const left = (index * 17) % 100;
        const delay = (index % 7) * 0.06;
        const duration = 1.7 + (index % 5) * 0.18;
        const color = ["#38bdf8", "#22c55e", "#f59e0b", "#f43f5e", "#a78bfa"][index % 5];

        return (
          <span
            key={index}
            className="absolute top-0 h-3 w-2 rounded-sm"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animation: `launch-confetti-fall ${duration}s ease-out ${delay}s forwards`,
              transform: `translateY(-20px) rotate(${index * 25}deg)`,
              opacity: 0,
            }}
          />
        );
      })}
      <style>{`
        @keyframes launch-confetti-fall {
          0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
          10% { opacity: 1; }
          100% { opacity: 0; transform: translateY(520px) rotate(580deg); }
        }
      `}</style>
    </div>
  );
}

export default function LaunchStoreSection({
  userId,
  onboardingData,
  onOnboardingDataUpdate,
}: LaunchStoreSectionProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showConfirmModal]);

  const isPublished = Boolean(onboardingData?.website?.config?.isPublished);
  const hosting = onboardingData?.website?.config?.hosting || {};
  const activeDomain = useMemo(() => getPrimaryLiveDomain(hosting), [hosting]);
  const activeLink = activeDomain ? `https://${normalizeDomain(activeDomain)}` : "";

  const persistOnboarding = async (next: Partial<OnboardingData>) => {
    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, { onboarding: next });
    } else {
      await setDoc(userRef, { onboarding: next }, { merge: true });
    }
  };

  const updatePublishedState = async (nextState: boolean) => {
    const nextOnboarding: Partial<OnboardingData> = {
      ...(onboardingData || {}),
      website: {
        ...(onboardingData?.website || {}),
        type: onboardingData?.website?.type || null,
        config: {
          ...(onboardingData?.website?.config || {}),
          isPublished: nextState,
        },
      },
    };

    await persistOnboarding(nextOnboarding);
    localStorage.setItem(`onboarding_${userId}`, JSON.stringify(nextOnboarding));
    onOnboardingDataUpdate(nextOnboarding);
  };

  const handlePublish = async () => {
    if (!userId) return;

    setError(null);
    setSuccess(null);

    if (!activeDomain) {
      setError("Connect a domain or free subdomain before launching your store.");
      return;
    }

    setIsPublishing(true);
    try {
      await updatePublishedState(true);
      setSuccess("Your store is now live. Visitors can access your website.");
      setShowConfetti(true);
      window.setTimeout(() => setShowConfetti(false), 2500);
    } catch {
      setError("Failed to launch store. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleConfirmTakeOffline = async () => {
    if (!userId) return;
    if (confirmText.trim().toUpperCase() !== "TAKE OFFLINE") {
      setError("Type TAKE OFFLINE to confirm this action.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsUnpublishing(true);

    try {
      await updatePublishedState(false);
      setSuccess("Your store has been taken offline. Visitors now see the Coming Soon page.");
      setShowConfirmModal(false);
      setConfirmText("");
    } catch (unpublishError) {
      setError("Failed to take store offline. Please try again.");
    } finally {
      setIsUnpublishing(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_50px_-38px_rgba(15,23,42,0.75)] sm:p-8">
      <ConfettiBurst show={showConfetti} />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Launch Store</h2>
          <p className="mt-1 text-sm text-slate-600">
            Control public visibility for your storefront. Keep your site private until it is fully ready.
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
            isPublished
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {isPublished ? <FiWifi className="h-4 w-4" /> : <FiWifiOff className="h-4 w-4" />}
          {isPublished ? "Status: Live" : "Status: Draft"}
        </span>
      </div>

      {(error || success) && (
        <div
          className={`mb-6 rounded-xl p-4 text-sm ${
            error
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || success}
        </div>
      )}

      {!isPublished ? (
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6">
          <h3 className="text-xl font-semibold text-slate-900">Ready to go live?</h3>
          <p className="mt-2 text-sm text-slate-600">
            Publishing will make your storefront publicly accessible at your active domain.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || isUnpublishing}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:from-emerald-700 hover:to-cyan-700 disabled:opacity-60"
            >
              {isPublishing ? <FiLoader className="h-4 w-4 animate-spin" /> : <BiRocket className="h-4 w-4" />}
              Go Live
            </button>
            <p className="text-xs text-slate-500">
              Active domain: <span className="font-semibold text-slate-700">{activeDomain || "Not configured"}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm text-emerald-800">
            Your storefront is live and visible to customers.
          </p>
          {activeLink && (
            <a
              href={activeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              Visit live site
              <FiExternalLink className="h-4 w-4" />
            </a>
          )}
          <div>
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              disabled={isUnpublishing || isPublishing}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
            >
              {isUnpublishing ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiWifiOff className="h-4 w-4" />}
              Take Store Offline
            </button>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Take Store Offline?</h3>
            <p className="mt-3 text-sm text-slate-700">
              This action will immediately hide your storefront from all visitors. Customers will no longer be able to browse your site.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Type TAKE OFFLINE to confirm
            </p>
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="TAKE OFFLINE"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-red-500"
            />

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmText("");
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTakeOffline}
                disabled={isUnpublishing}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isUnpublishing ? <FiLoader className="h-4 w-4 animate-spin" /> : null}
                Confirm Offline
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}