"use client";

import { useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEdit3,
  FiExternalLink,
  FiGlobe,
  FiLoader,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";
import MotivationalQuote from "./MotivationalQuote";

interface Step2BusinessNameProps {
  initialValue?: string;
  onNext: (businessName: string) => void;
  onBack: () => void;
  isEditing?: boolean;
}

type DomainStatus = "idle" | "loading" | "available" | "taken" | "error";

export default function Step2BusinessName({
  initialValue = "",
  onNext,
  onBack,
  isEditing = false,
}: Step2BusinessNameProps) {
  const [businessName, setBusinessName] = useState(initialValue);
  const [error, setError] = useState("");
  const [domainName, setDomainName] = useState("");
  const [extension, setExtension] = useState(".com");
  const [domainStatus, setDomainStatus] = useState<DomainStatus>("idle");
  const [domainMessage, setDomainMessage] = useState("");
  const [checkedDomain, setCheckedDomain] = useState("");

  const buildDomainFromName = (value: string) => {
    const root = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "")
      .replace(/-+/g, "-");

    return root;
  };

  const getFullDomain = () => {
    const base = domainName.trim().toLowerCase();
    if (!base) return "";
    return `${base}${extension}`;
  };

  const handleDomainCheck = async () => {
    const base = domainName.trim().toLowerCase();
    if (!base) {
      setDomainStatus("error");
      setDomainMessage("Enter a business domain name to check availability.");
      return;
    }

    const fullDomain = `${base}${extension}`;

    setDomainStatus("loading");
    setDomainMessage("");
    setCheckedDomain(fullDomain);

    try {
      const response = await fetch("/api/check-domain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: fullDomain }),
      });

      const data = await response.json();

      if (!response.ok) {
        setDomainStatus("error");
        setDomainMessage(data?.error || "Unable to check domain right now.");
        return;
      }

      if (data?.available) {
        setDomainStatus("available");
        setDomainMessage(
          `Great news! ${fullDomain} is available. Claim it before someone else does.`,
        );
        return;
      }

      setDomainStatus("taken");
      setDomainMessage(
        `${fullDomain} is already taken. Try another extension or a slight variation.`,
      );
    } catch {
      setDomainStatus("error");
      setDomainMessage("Network issue while checking the domain. Please retry.");
    }
  };

  const buyDomainUrl = checkedDomain
    ? `https://www.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(
        checkedDomain,
      )}`
    : "#";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessName.trim()) {
      setError("Please enter your business name");
      return;
    }

    if (businessName.trim().length < 2) {
      setError("Business name must be at least 2 characters");
      return;
    }

    onNext(businessName.trim());
  };

  const suggestions = [
    "Keep it simple and memorable",
    "Make sure it's easy to spell",
    "Check if domain is available",
    "Ensure social handles are available",
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6">
          <FiEdit3 className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          What&apos;s Your Business Name?
        </h1>
        <p className="text-xl text-gray-600">
          This is the foundation of your brand. Choose wisely! ✨
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <label
                htmlFor="businessName"
                className="block text-lg font-semibold text-gray-900 mb-3"
              >
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value);
                  setError("");

                  if (!domainName.trim()) {
                    const nextDomain = buildDomainFromName(e.target.value);
                    setDomainName(nextDomain);
                  }
                }}
                placeholder="e.g., Elite Fashion Boutique"
                className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all"
                autoFocus
              />
              {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-blue-600" />
                Tips for a Great Business Name
              </h3>
              <ul className="space-y-2">
                {suggestions.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="bg-white rounded-2xl p-6 shadow-lg border-2 border-indigo-200 lg:sticky lg:top-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-1">
              <FiGlobe className="w-5 h-5 text-indigo-600" />
              Check Domain Availability
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Great name! Let&apos;s see if the website is available...
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={domainName}
                onChange={(e) => {
                  setDomainName(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "")
                      .replace(/^-+|-+$/g, ""),
                  );
                  setDomainStatus("idle");
                  setDomainMessage("");
                }}
                placeholder="yourbrand"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
              />

              <div className="grid grid-cols-[1fr_auto] gap-3">
                <select
                  value={extension}
                  onChange={(e) => {
                    setExtension(e.target.value);
                    setDomainStatus("idle");
                    setDomainMessage("");
                  }}
                  className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white"
                >
                  <option value=".com">.com</option>
                  <option value=".net">.net</option>
                  <option value=".io">.io</option>
                  <option value=".co">.co</option>
                  <option value=".store">.store</option>
                </select>

                <button
                  type="button"
                  onClick={handleDomainCheck}
                  disabled={domainStatus === "loading"}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {domainStatus === "loading" ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <FiSearch className="w-4 h-4" />
                      Check
                    </>
                  )}
                </button>
              </div>

              {domainStatus === "idle" && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-indigo-900 text-sm">
                  Optional step: check now or continue and do it later.
                </div>
              )}

              {domainStatus === "loading" && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-900 flex items-center gap-2 text-sm">
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Checking {getFullDomain()} availability...
                </div>
              )}

              {domainStatus === "available" && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="text-green-900 font-semibold mb-3 text-sm">{domainMessage}</p>
                  <a
                    href={buyDomainUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all"
                  >
                    Buy this Domain
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {(domainStatus === "taken" || domainStatus === "error") && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900 flex items-start gap-2 text-sm">
                  <FiXCircle className="w-5 h-5 mt-0.5" />
                  <p>{domainMessage}</p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Motivational Quote */}
        <div className="mb-8">
          <MotivationalQuote index={1} />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            {isEditing ? "Back to Dashboard" : "Back"}
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
          >
            {isEditing ? (
              <>
                <FiCheckCircle className="w-5 h-5" />
                Save Changes
              </>
            ) : (
              <>
                Continue
                <FiArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
