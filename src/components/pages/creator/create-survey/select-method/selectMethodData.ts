import { FiShield, FiSliders, FiTarget, FiZap } from "react-icons/fi";

import type { MethodTip, SurveyMethod } from "./selectMethodTypes";

export const surveyMethods: SurveyMethod[] = [
  {
    id: "ai",
    title: "AI-Assisted Survey Generation",
    description:
      "Generate a strong first draft of survey questions with AI based on your survey goals, audience, and category.",
    buttonLabel: "Choose AI Method",
    buttonVariant: "solid",
    features: [
      "Fast setup with AI-generated question suggestions",
      "Recommended question types and answer options",
      "Ideal for quick survey creation",
      "You can edit every question before publishing",
    ],
    tags: [
      { label: "Recommended", icon: FiShield },
      { label: "Faster workflow", icon: FiZap },
      { label: "Best for speed", icon: FiTarget },
    ],
  },
  {
    id: "manual",
    title: "Manual Survey Creation",
    description:
      "Create your survey from scratch by manually adding and organizing your own questions and answers.",
    buttonLabel: "Choose Manual Method",
    buttonVariant: "outline",
    features: [
      "Full control over each question and answer",
      "Flexible structure for custom survey flows",
      "Ideal for advanced or highly specific surveys",
      "You can edit every question before publishing",
    ],
    tags: [
      { label: "Most control", icon: FiShield },
      { label: "Custom workflow", icon: FiSliders },
    ],
  },
];

export const methodTips: MethodTip[] = [
  {
    title: "Use AI",
    description: "If you want a faster start and smart suggestions.",
    icon: FiTarget,
  },
  {
    title: "Choose Manual",
    description: "If you already know the exact questions you want.",
    icon: FiShield,
  },
  {
    title: "Both methods let you edit",
    description: "Questions and answers can be refined before publishing.",
    icon: FiSliders,
  },
];