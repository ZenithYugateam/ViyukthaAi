import React from "react";
import { motion } from "framer-motion";

export type Step = {
  key: string;
  label: string;
};

type Props = {
  steps: Step[];
  current: number;
  onStepChange?: (index: number) => void;
};

const Stepper: React.FC<Props> = ({ steps, current, onStepChange }) => {
  return (
    <motion.div
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <ol className="grid grid-cols-1 md:grid-cols-6 gap-3">
        {steps.map((s, idx) => {
          const active = idx === current;
          const done = idx < current;
          return (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => onStepChange?.(idx)}
                className={`w-full flex items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors ${
                  active
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : done
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-muted bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold border ${
                    active
                      ? "bg-blue-500 text-white border-blue-500"
                      : done
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-muted text-foreground/70"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="text-sm font-medium truncate">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
};

export default Stepper;
