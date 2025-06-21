// components/Stepper.js
"use client";

import { useState, useEffect } from "react";

/**
 * Enhanced stepper component for multi-step processes
 * @param {Object} props - Component props
 * @param {number} props.step - Current active step (zero-based index)
 * @param {number} props.total - Total number of steps
 * @param {string[]} [props.labels] - Optional labels for each step
 * @param {function} [props.onChange] - Optional callback when a step is clicked
 */
export default function Stepper({
  step,
  total,
  labels = [],
  onChange = null
}) {
  const [animatedStep, setAnimatedStep] = useState(0);

  // Animate the progress when step changes
  useEffect(() => {
    if (step > animatedStep) {
      const timer = setTimeout(() => {
        setAnimatedStep(prev => Math.min(prev + 1, step));
      }, 200);
      return () => clearTimeout(timer);
    } else if (step < animatedStep) {
      setAnimatedStep(step);
    }
  }, [step, animatedStep]);

  const handleStepClick = (index) => {
    if (onChange && index <= step) {
      onChange(index);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-2 relative">
        {/* Progress line */}
        <div className="absolute h-0.5 bg-gray-200 top-1/2 left-0 right-0 -translate-y-1/2 z-0" />

        {/* Animated progress */}
        <div
          className="absolute h-0.5 bg-purple-600 top-1/2 left-0 -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${(animatedStep / (total - 1)) * 100}%` }}
        />

        {/* Step circles */}
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex flex-col items-center flex-1 z-10">
            <button
              onClick={() => handleStepClick(i)}
              disabled={!onChange || i > step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1
                ${i <= step
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-500 border-2 border-gray-200'}
                ${onChange && i <= step ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}
                transition-all duration-300
              `}
              aria-current={i === step ? "step" : undefined}
            >
              {i + 1}
            </button>

            {/* Step label */}
            {labels[i] && (
              <span className={`text-xs font-medium ${
                i <= step ? 'text-purple-600' : 'text-gray-500'
              } text-center transition-colors duration-300 max-w-[120px] truncate`}>
                {labels[i]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Step counter text */}
      <div className="text-center text-sm text-gray-500 mt-2">
        Step {step + 1} of {total}
      </div>
    </div>
  );
}
