// app/create/page.js
"use client"; // we need state to track steps

import { useState } from "react";
import Stepper from "@/components/Stepper";

export default function CreateCampaignPage() {
  // 5‑step wizard (based on the PDF spec)
  const [step, setStep] = useState(1);
  const total = 5;

  // Simple form state (expand later)
  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    goal: "",
  });

  const next = () => setStep((s) => Math.min(s + 1, total));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <label className="block mb-3">
              <span className="font-semibold">Campaign Title</span>
              <input
                className="mt-1 w-full border rounded px-3 py-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Repair Mbeya Primary School Roof"
              />
            </label>

            <label className="block mb-3">
              <span className="font-semibold">Category</span>
              <select
                className="mt-1 w-full border rounded px-3 py-2"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="">Select category</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Community">Community Development</option>
              </select>
            </label>

            <label className="block mb-6">
              <span className="font-semibold">Location</span>
              <input
                className="mt-1 w-full border rounded px-3 py-2"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Mbeya, Tanzania"
              />
            </label>
          </>
        );

      // Other steps would go here (story, goal, verification, review…)
      default:
        return <p>Step {step} content coming soon…</p>;
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-4">Create a Campaign</h1>

      {/* Visual progress bar */}
      <Stepper step={step} total={total} />

      {renderStep()}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={back}
          disabled={step === 1}
          className="px-4 py-2 rounded border disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={next}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
        >
          {step === total ? "Submit" : "Next"}
        </button>
      </div>
    </section>
  );
}
