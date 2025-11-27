import { motion } from "framer-motion";

type CircularProgessProps = {
  value : number
}

export default function CircularProgress({ value } : CircularProgessProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - value) / 100) * circumference;

  return (
    <svg width="90" height="90">
      <circle
        cx="45"
        cy="45"
        r={radius}
        stroke="#e5e7eb"
        strokeWidth="8"
        fill="none"
      />

      <motion.circle
        cx="45"
        cy="45"
        r={radius}
        stroke="#10b981"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={progress}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: progress }}
        transition={{ duration: 1 }}
      />
    </svg>
  );
}
